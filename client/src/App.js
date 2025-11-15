import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import ListPage from "./pages/ListPage/ListPage";
import ItemPage from "./pages/ItemPage/ItemPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App__header">
          <h1>Avito Модерация</h1>
          <nav className="App__nav">
            <Link to="/list" className="App__nav-link">Список объявлений</Link>
          </nav>
        </header>

        <div className="App__content">
          <Routes>
            <Route path="/" element={<Navigate to="/list" replace />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/item/:id" element={<ItemPage />} /> 
            <Route path="*" element={<h2>404: Страница не найдена</h2>} />
          </Routes>
        </div>

        <footer className="App__footer">
          &copy; 2025 Avito Модерация
        </footer>
      </div>
    </Router>
  );
}

export default App;
