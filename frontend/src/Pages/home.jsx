import React from "react";
import "../Static/homepage.css";

function Homepage() {
  return (
    <div className="homepage-container">
      <h1>Welcome to the Home Page.</h1>
      <a href="/item">Go to Items</a>
      <a href="/admin">Go to Admin Panel</a>
      <a href="/sales-history">Go to Sales History</a>
      <a href="/prediction">Go to Prediction</a>
    </div>
  );
}

export default Homepage;
