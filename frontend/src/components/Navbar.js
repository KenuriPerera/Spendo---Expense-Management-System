import React from "react";
import { NavLink } from "react-router-dom"; // use NavLink for automatic active styling
import "./expense.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-logo">Spendo</h1>
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/expenses-form"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Add Expense
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/expenses-list"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Expense List
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
