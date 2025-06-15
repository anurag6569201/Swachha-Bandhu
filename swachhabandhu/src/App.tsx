// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';

// Route Wrappers
import PublicOnlyRoute from './auth/PublicOnlyRoute';
import ProtectedRoute from './auth/ProtectedRoute';

// Modular Route Components
import LandingRoutes from './routes/LandingRoutes';
import AuthFlowRoutes from './routes/AuthFlowRoutes';
import AppProtectedRoutes from './routes/AppProtectedRoutes';

// Global 404 Page
import NotFoundPage from './pages/landing/landingpages/NotFoundPage';
import PrivateLayout from './layouts/PrivateLayout';

function AppStructure() {
  return (
    <Routes>
      <Route element={<PrivateLayout />}>

        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <AppProtectedRoutes />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route element={<PublicLayout />}>
        <Route
          path="/auth/*"
          element={
            <PublicOnlyRoute>
              <AuthFlowRoutes />
            </PublicOnlyRoute>
          }
        />
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="/*" element={<PublicOnlyRoute><LandingRoutes /></PublicOnlyRoute>} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppStructure />
      </AuthProvider>
    </Router>
  );
}

export default App;