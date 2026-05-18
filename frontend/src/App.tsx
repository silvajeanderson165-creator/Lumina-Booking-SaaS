import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DemoRoute from './components/DemoRoute';
import IntegrationShowcase from './pages/IntegrationShowcase';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Login />} />

        {/* Rotas autenticadas — exigem JWT válido (validação em ProtectedRoute). */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/integration-showcase" element={
          <ProtectedRoute>
            <IntegrationShowcase />
          </ProtectedRoute>
        } />

        {/* Rota de demo (modo portfólio público) — isolada do ProtectedRoute.
            Auditoria 2026-05-18 discrepância #3 / checklist item 39B. */}
        <Route path="/demo" element={
          <DemoRoute>
            <Dashboard />
          </DemoRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
