import React, { useState } from "react";
import API from "../api";
import "./expense.css";

const getCurrentDate = () => new Date().toISOString().split("T")[0];

const categories = {
  expense: [
    { value: "food", label: "Food", emoji: "🍔" },
    { value: "transport", label: "Transport", emoji: "🚗" },
    { value: "housing", label: "Housing", emoji: "🏠" },
    { value: "entertainment", label: "Entertainment", emoji: "🎉" },
    { value: "health", label: "Health", emoji: "💊" },
    { value: "education", label: "Education", emoji: "📚" },
    { value: "work", label: "Work", emoji: "💼" },
    { value: "utilities", label: "Utilities", emoji: "💡" },
    { value: "shopping", label: "Shopping", emoji: "🛍️" },
    { value: "other", label: "Other", emoji: "📦" },
  ],
  savings: [
    { value: "bank", label: "Bank Deposit", emoji: "🏦" },
    { value: "cash", label: "Cash Savings", emoji: "💰" },
    { value: "invest", label: "Investments", emoji: "📈" },
    { value: "goal", label: "Goal Savings", emoji: "🎯" },
    { value: "other", label: "Other Savings", emoji: "💎" },
  ],
};

export default function ExpenseForm({ onAdd }) {
  const [activeTab, setActiveTab] = useState("expense");
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "expense",
    date: getCurrentDate(),
    category: "",
    amount: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [userMsg, setUserMsg] = useState("");
  const [devDetails, setDevDetails] = useState(null);

  const resetForm = () =>
    setForm({ title: "", description: "", type: activeTab, date: getCurrentDate(), category: "", amount: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) { setUserMsg("Title is required."); return false; }
    if (!form.category) { setUserMsg("Category is required."); return false; }
    if (!form.date) { setUserMsg("Date is required."); return false; }
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) { setUserMsg("Amount must be a positive number."); return false; }
    setUserMsg(""); return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDevDetails(null);
    if (!validate()) return;

    const payload = {
      title: form.title.trim(),
      type: activeTab,
      date: form.date,
      category: form.category,
      amount: parseFloat(form.amount),
      description: form.description.trim() || undefined,
    };

    try {
      setSubmitting(true);
      const res = await API.post("/", payload);
      onAdd?.(res.data);
      resetForm();
      setUserMsg(`${activeTab === "expense" ? "Expense" : "Savings"} added successfully ✅`);
    } catch (err) {
      console.error("Submit error:", err);
      setDevDetails({ message: err.message, response: err.response?.data || null });
      setUserMsg(err.response?.data?.message || "Error adding record. Check console.");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="expense-savings-container">
      <div className="tab-container">
        <button className={activeTab==="expense"?"active":""} onClick={()=>{setActiveTab("expense"); setForm(p=>({...p,type:"expense",category:""}));}}>💸 Expense</button>
        <button className={activeTab==="savings"?"active":""} onClick={()=>{setActiveTab("savings"); setForm(p=>({...p,type:"savings",category:""}));}}>💰 Savings</button>
      </div>

      <form className="expense-form" onSubmit={handleSubmit} noValidate>
        <h3>{activeTab==="expense"?"Add Expense":"Add Savings"}</h3>
        {userMsg && <div className="user-msg">{userMsg}</div>}

        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Optional" />

        <label>Date</label>
        <input name="date" type="date" value={form.date} onChange={handleChange} max={getCurrentDate()} required />

        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select category</option>
          {(categories[activeTab] || []).map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
        </select>

        <label>Amount</label>
        <input name="amount" type="number" inputMode="decimal" placeholder="0.00" value={form.amount} onChange={handleChange} required min="0.01" step="0.01"/>

        <button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save"}</button>

        {devDetails && <details style={{marginTop:12}}><summary>Dev error details</summary><pre style={{fontSize:12}}>{JSON.stringify(devDetails,null,2)}</pre></details>}
      </form>
    </div>
  );
}
