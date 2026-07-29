// src/App.js
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // ✅ Import AuthProvider

/* AUTH PAGES */
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* DASHBOARD PAGES */
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AIAdvisorPage from "./pages/AIAdvisorPage";
import CategoryPage from "./pages/CategoryPage"; // ✅ Import CategoryPage

/* PROTECTED ROUTE */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider> {/* ✅ Wrap everything with AuthProvider */}
      <BrowserRouter>
        <Routes>
          {/* LANDING PAGE */}
          <Route path="/" element={<LandingPage />} />

          {/* AUTH PAGES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* EXPENSES */}
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />

          {/* INCOME */}
          <Route
            path="/income"
            element={
              <ProtectedRoute>
                <Income />
              </ProtectedRoute>
            }
          />

          {/* BUDGETS */}
          <Route
            path="/budgets"
            element={
              <ProtectedRoute>
                <Budgets />
              </ProtectedRoute>
            }
          />

          {/* GOALS */}
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />

          {/* REPORTS */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* TRANSACTIONS */}
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />

          {/* CATEGORIES */} {/* ✅ Added Categories Route */}
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            }
          />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* SETTINGS */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* AI ADVISOR */}
          <Route
            path="/advisor"
            element={
              <ProtectedRoute>
                <AIAdvisorPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;