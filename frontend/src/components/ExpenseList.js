import React, { useEffect, useState } from "react";
import API from "../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const res = await API.get("/");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Delete
  const handleDelete = async (id) => {
    try {
      await API.delete(`/${id}`);
      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  // Start editing
  const handleEditClick = (expense) => {
    setEditingId(expense._id);
    setEditFormData({
      title: expense.title,
      type: expense.type,
      category: expense.category,
      date: expense.date.split("T")[0],
      amount: expense.amount,
      description: expense.description || "",
    });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setEditFormData({});
  };

  // Handle input change in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Save updated expense
  const handleSave = async (id) => {
    try {
      const res = await API.put(`/${id}`, {
        ...editFormData,
        amount: parseFloat(editFormData.amount),
      });
      setExpenses(expenses.map((exp) => (exp._id === id ? res.data : exp)));
      setEditingId(null);
      setEditFormData({});
    } catch (err) {
      console.error("Error updating expense:", err);
    }
  };

  // Improved safe search filter
const filteredExpenses = expenses.filter((exp) => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return true; // Show all if search is empty

  return (
    (exp.title || "").toLowerCase().includes(term) ||
    (exp.category || "").toLowerCase().includes(term) ||
    (exp.type || "").toLowerCase().includes(term) ||
    (exp.description || "").toLowerCase().includes(term) ||
    (exp.amount !== undefined ? exp.amount.toString().includes(term) : false)
  );
});



  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredExpenses.map(({ _id, ...rest }) => rest)
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Spando_expenses.xlsx");
  };

  return (
    <div className="expense-list">
      <h2>Expense List</h2>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search by title, category, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "10px", width: "78%", borderRadius: "6px", border: "1px solid #ccc", fontSize: "16px" }}
        />
        <button onClick={exportToExcel} style={{ padding: "10px 16px", borderRadius: "3px", backgroundColor: "#220ff1ff", color: "#fff", fontSize: "14px" }}>
          Export to Excel
        </button>
      </div>

      {filteredExpenses.length === 0 ? (
        <p className="empty-state">No expenses found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((exp) => (
              <tr key={exp._id}>
                {editingId === exp._id ? (
                  <>
                    <td><input name="title" value={editFormData.title} onChange={handleInputChange} /></td>
                    <td>
                      <select name="type" value={editFormData.type} onChange={handleInputChange}>
                        <option value="expense">Expense</option>
                        <option value="savings">Savings</option>
                      </select>
                    </td>
                    <td><input name="category" value={editFormData.category} onChange={handleInputChange} /></td>
                    <td><input type="date" name="date" value={editFormData.date} onChange={handleInputChange} /></td>
                    <td><input type="number" name="amount" value={editFormData.amount} onChange={handleInputChange} /></td>
                    <td><input name="description" value={editFormData.description} onChange={handleInputChange} /></td>
                    <td className="expense-actions">
                      <button className="btn-update" onClick={() => handleSave(exp._id)}>Save</button>
                      <button className="btn-delete" onClick={handleCancel}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{exp.title}</td>
                    <td>{exp.type}</td>
                    <td>{exp.category}</td>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td className={exp.type.toLowerCase() === "savings" ? "expense-amount savings" : "expense-amount expense"}>
                      {exp.amount}
                    </td>
                    <td>{exp.description}</td>
                    <td className="expense-actions">
                      <button className="btn-update" onClick={() => handleEditClick(exp)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(exp._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExpenseList;
