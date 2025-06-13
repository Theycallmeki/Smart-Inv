// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your page components (assumes file names are lowercase)
import Homepage from "./Pages/home";
import Item from "./Pages/item";
import Admin from "./Pages/admin";
import SalesHistory from "./Pages/salesHistory";
import Prediction from "./Pages/prediction";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/item" element={<Item />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/sales-history" element={<SalesHistory />} />
          <Route path="/prediction" element={<Prediction />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
