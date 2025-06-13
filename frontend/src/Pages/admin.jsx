import React, { useEffect, useRef, useState } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

export default function AdminPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    fetch('/items')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch items');
        return res.json();
      })
      .then(data => {
        setItems(data);
        setLoading(false);
        setError('');
        renderChart(data);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      });
  }, []);

  const renderChart = (data) => {
    if (!chartRef.current) return;

    const freqMap = {};
    data.forEach(item => {
      const cat = item.category || 'Uncategorized';
      freqMap[cat] = (freqMap[cat] || 0) + 1;
    });

    const labels = Object.keys(freqMap);
    const frequencies = Object.values(freqMap);
    const total = frequencies.reduce((a, b) => a + b, 0);
    const percentages = frequencies.map(f => ((f / total) * 100).toFixed(2));

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: frequencies,
            backgroundColor: [
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)',
              'rgba(255, 159, 64, 0.8)',
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 205, 86, 0.8)',
              'rgba(201, 203, 207, 0.8)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 205, 86, 1)',
              'rgba(201, 203, 207, 1)',
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: ctx => {
                const label = ctx.label || '';
                const count = ctx.raw || 0;
                const pct = percentages[ctx.dataIndex];
                return `${label}: ${count} (${pct}%)`;
              },
            },
          },
          legend: {
            position: 'bottom',
            labels: {
              color: '#fff',
              usePointStyle: true,
              padding: 20,
            },
          },
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-blue-900 text-white p-4">
      <div className="max-w-6xl mx-auto bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Panel</h1>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Table */}
          <div className="flex-1 bg-white bg-opacity-10 p-4 rounded-lg overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4 text-center md:text-left">Inventory Items</h2>
            {loading && <p className="text-center text-white/70">Loading items...</p>}
            {error && <p className="text-center text-red-400 bg-red-100/10 rounded-md py-2">{error}</p>}
            {!loading && !error && (
              <table className="w-full text-sm text-left border border-white/20">
                <thead className="bg-white/20">
                  <tr>
                    <th className="p-2">ID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Quantity</th>
                    <th className="p-2">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-white/70">
                        No items found.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="hover:bg-white/10">
                        <td className="p-2">{item.id}</td>
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">{item.category || 'Uncategorized'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Chart */}
          <div className="md:w-[350px] w-full bg-white bg-opacity-10 p-4 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Category Demand Chart</h2>
            {loading && <p className="text-white/70">Loading chart...</p>}
            {!loading && !error && <canvas ref={chartRef} className="mx-auto w-full max-w-xs h-[300px]" />}
          </div>
        </div>
      </div>
    </div>
  );
}
