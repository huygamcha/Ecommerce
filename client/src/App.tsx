import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Category from "./pages/category";
import Supplier from "./pages/supplier";
import Product from "./pages/product";
import { Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="categories" element={<Category />} />
        <Route path="categories/:id" element={<Category />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
