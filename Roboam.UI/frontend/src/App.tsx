import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PageLink } from "./utils/links";
import MainPage from "./pages/main/main";
import NotFoundPage from "./pages/not-found/not-found";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={PageLink.main}
          element={<MainPage />}
        />
        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
