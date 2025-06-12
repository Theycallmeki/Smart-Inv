// src/components/Homepage.jsx
import React from "react";
import "./homepage.css"; // We'll extract the CSS into a separate file

function Homepage() {
  return (
    <div className="container">
      <h1>Welcome to the Home Page.</h1>
      <a href="/item">Go to Items</a>
      <a href="/admin">Go to Admin Panel</a>
      <a href="/sales-history">Go to Sales History</a>
      <a href="/prediction">Go to Prediction</a>
    </div>
  );
}

export default Homepage;
