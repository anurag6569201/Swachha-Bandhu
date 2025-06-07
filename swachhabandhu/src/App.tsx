// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import LeaderboardPage from './pages/apps/gamification/LeaderboardPage';

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

function AppStructure() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>

        {/* Explicit Leaderboard Routes */}
        <Route 
          path="/app/leaderboard" 
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app/leaderboard/:view" 
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          } 
        />

        {/* Existing app protected routes under /app/* */}
        <Route 
          path="/app/*" 
          element={
            <ProtectedRoute> 
              <AppProtectedRoutes />
            </ProtectedRoute>
          } 
        />

        {/* Auth routes */}
        <Route 
          path="/auth/*" 
          element={
            <PublicOnlyRoute>
              <AuthFlowRoutes />
            </PublicOnlyRoute>
          } 
        />
        
        {/* Landing routes */}
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
