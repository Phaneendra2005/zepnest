import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateRequest from './pages/CreateRequest';
import RequestDetail from './pages/RequestDetail';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/requests/new"
            element={
              <PrivateRoute>
                <CreateRequest />
              </PrivateRoute>
            }
          />
          <Route
            path="/requests/:id"
            element={
              <PrivateRoute>
                <RequestDetail />
              </PrivateRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="border-t border-zinc-800/60 py-6 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col items-center gap-2 sm:flex-row sm:justify-between text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} Zepnest. All rights reserved.</p>
          <p className="font-mono">v1.0.0</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
