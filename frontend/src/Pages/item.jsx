import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Static/item.css";

const Item = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    category: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:3005/items");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3005/items/${editingId}`, form);
      } else {
        await axios.post("http://localhost:3005/items", form);
      }
      setForm({ name: "", quantity: "", category: "", price: "" });
      setEditingId(null);
      fetchItems();
    } catch (err) {
      console.error("Error saving item:", err);
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      price: item.price,
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`http://localhost:3005/items/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.id && item.id.toString().includes(searchTerm))
  );

  return (
    <div className="item-container">
      <div className="container">
        <div className="header">
          <h1>📦 Inventory Management</h1>
          <p>Manage your items with ease</p>
        </div>

        <div className="form-section">
          <div className="search-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search items by name, category, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <form className="item-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Item Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Enter category"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (₱)</label>
              <input
                id="price"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price"
                step="0.01"
                min="0"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              {editingId ? "Update Item" : "Add Item"}
            </button>
          </form>
        </div>

        <div className="items-section">
          <h3>Items List ({filteredItems.length} of {items.length} items)</h3>
          {filteredItems.length === 0 ? (
            <div className="no-items">
              {searchTerm
                ? `No items found matching "${searchTerm}"`
                : "No items found. Add your first item above!"}
            </div>
          ) : (
            <div className="table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td className="item-name-cell">{item.id}</td>        
                         <td className="item-name-cell">{item.name}</td>
                      <td className="quantity-cell">{item.quantity}</td>
                      <td className="category-cell">
                        <span className="category-badge">{item.category}</span>
                      </td>
                      <td className="price-cell">
                        ₱{parseFloat(item.price || 0).toFixed(2)}
                      </td>
                      <td className="actions-cell">
                        <div className="item-actions">
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEdit(item)}
                            title="Edit item"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(item.id)}
                            title="Delete item"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Item;
