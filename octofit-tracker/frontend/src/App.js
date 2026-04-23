import React from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import './App.css';

function App() {
  return (
    <div className="container py-4">
      <nav className="navbar navbar-expand-lg navbar-dark rounded mb-4 shadow-lg header-navbar">
        <div className="container-fluid">
          <NavLink className="navbar-brand d-flex align-items-center fw-bold" to="/">
            <img src="/octofitapp-small.png" alt="OctoFit logo" className="app-logo me-2" />
            <span>OctoFit Tracker</span>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/activities">
                  Activities
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/leaderboard">
                  Leaderboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/teams">
                  Teams
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/users">
                  Users
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/workouts">
                  Workouts
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h1 className="card-title display-6">OctoFit Tracker</h1>
                <p className="lead">
                  Use the menu to browse Activities, Leaderboard, Teams, Users, and Workouts from the backend API.
                </p>
                <p>
                  This React frontend demonstrates how to fetch and display data from a REST API using Bootstrap for styling. Each section includes search and refresh functionality for an interactive experience.
                </p>
                    <NavLink className="btn btn-primary btn-lg me-2" to="/activities">
                  View Activities
                </NavLink>
                <NavLink className="btn btn-secondary btn-lg" to="/leaderboard">
                  View Leaderboard
                </NavLink>
              </div>
            </div>
          }
        />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/users" element={<Users />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>
    </div>
  );
}

export default App;
