// src/components/Dashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import API from "../api";
import "./expense.css";

const COLORS = [
   "#79d25eff", "#2d827dff", "#ecde47ff", "#d2421e",
  "#08801cff", "#9c9332ff", "#802912", "#02445e", "#f5de5f",
  "#4bae8d", "#d0e59a", "#fec74e", "#0d489aff", "#85b780",
  "#fbb609", "#1e7b7c", "#1f6549", "#180808", "#4F0208",
  "#AD0517", "#D75F72", "#7C8D61"
];

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [daysRange, setDaysRange] = useState(30); // NEW: range selector state

  // Fetch records
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await API.get("/");
      setRecords(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch records");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Aggregate by type and category
  const aggregateByType = (type) => {
    const filtered = records.filter(r => r.type === type);
    const map = new Map();
    filtered.forEach(r => map.set(r.category, (map.get(r.category) || 0) + r.amount));
    return Array.from(map, ([name, value]) => ({ name, value }));
  };

  const expenseData = useMemo(() => aggregateByType("expense"), [records]);
  const savingsData = useMemo(() => aggregateByType("savings"), [records]);

  // Total calculations
  const totalExpenses = useMemo(() => records.filter(r => r.type === "expense").reduce((sum, r) => sum + r.amount, 0), [records]);
  const totalSavings = useMemo(() => records.filter(r => r.type === "savings").reduce((sum, r) => sum + r.amount, 0), [records]);
  const balance = totalSavings - totalExpenses;

  // Time-based insights: last N days
  const lastNDays = (numDays) => {
    return [...Array(numDays)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();
  };

  const trendData = useMemo(() => {
    return lastNDays(daysRange).map(day => {
      const dailyRecords = records.filter(r => r.date.split("T")[0] === day);
      const expenseTotal = dailyRecords.filter(r => r.type === "expense").reduce((sum, r) => sum + r.amount, 0);
      const savingsTotal = dailyRecords.filter(r => r.type === "savings").reduce((sum, r) => sum + r.amount, 0);
      return { date: day.slice(5), expense: expenseTotal, savings: savingsTotal };
    });
  }, [records, daysRange]);

  const renderPieChart = (data, title) => (
    <div className="chart-box">
      <h3 className="chart-title">{title}</h3>
      {data.length ? (
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
            onClick={(entry) => setSelectedCategory(entry.name)}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : <p>No data yet!</p>}
      {selectedCategory && (
        <div style={{ marginTop: "10px" }}>
          <strong>Transactions for {selectedCategory}:</strong>
          <ul>
            {records.filter(r => r.category === selectedCategory).map(r => (
              <li key={r._id}>{r.title}: {r.amount}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="charts-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      
      {/* Totals Summary */}
      <div className="summary-container" style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div className="summary-card" style={{ backgroundColor: "#902e2bff", color: "#fff", padding: "15px", borderRadius: "12px", minWidth: "150px", textAlign: "center",boxShadow: "5px 8px 20px rgba(0, 0, 0, 0.25)" }}>
          <h4>Total Expenses</h4>
          <p> {totalExpenses}</p>
        </div>
        <div className="summary-card" style={{ backgroundColor: "#b0a80fff", color: "#fff", padding: "15px", borderRadius: "12px", minWidth: "150px", textAlign: "center" ,boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.25)"}}>
          <h4>Total Savings</h4>
          <p> {totalSavings}</p>
        </div>
        <div className="summary-card" style={{ backgroundColor: "#11ac78ff", color: "#fff", padding: "15px", borderRadius: "12px", minWidth: "150px", textAlign: "center" ,boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.25)"}}>
          <h4>Balance</h4>
          <p> {balance}</p>
        </div>
      </div>

      {/* Pie Charts */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
        {renderPieChart(expenseData, "💸 Expenses by Category")}
        {renderPieChart(savingsData, "💰 Savings by Category")}
      </div>
      
      {/* Trend Line Chart */}
      <div className="chart-box" style={{ marginTop: "30px" }}>
        <h3 className="chart-title">📈 Last {daysRange} Days Trend</h3>

        {/* Toggle buttons */}
        <div style={{ marginBottom: "15px" }}>
          <button 
            onClick={() => setDaysRange(7)} 
            style={{ marginRight: "10px", padding: "6px 12px", borderRadius: "8px", border: daysRange === 7 ? "2px solid #333" : "1px solid #13b85dff" }}
          >
            7 Days
          </button>
          <button 
            onClick={() => setDaysRange(30)} 
            style={{ padding: "6px 12px", borderRadius: "8px", border: daysRange === 30 ? "2px solid #333" : "1px solid #951111ff" }}
          >
            30 Days
          </button>
        </div>

        <LineChart width={700} height={300} data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="expense" stroke="#cb1b16" />
          <Line type="monotone" dataKey="savings" stroke="#0c9832ff" />
        </LineChart>
      </div>
    </div>
    
  );
}
