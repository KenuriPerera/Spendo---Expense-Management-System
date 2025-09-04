import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

function App() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/Expenses")
      .then(res => res.json())
      .then(data => setExpenses(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard expenses={expenses} />} />
          <Route path="/expenses-form" element={<ExpenseForm />} />
          <Route path="/expenses-list" element={<ExpenseList expenses={expenses} onDelete={() => {}} onUpdate={() => {}} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
