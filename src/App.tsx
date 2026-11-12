import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { useToast } from './context/useToast';
import { AuthModal } from './components/auth/AuthModal';
import { GithubAuthModal } from './components/auth/GithubAuthModal';
import { DemoModal } from './components/demo/DemoModal';

const Landing = lazy(() => import('./pages/Landing'));
const Scorecard = lazy(() => import('./pages/Scorecard'));

function ProtectedDashboard() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();
  const promptedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && window.location.pathname === '/dashboard' && !promptedRef.current) {
      promptedRef.current = true;
      showToast('Please sign in to access the CampusCode dashboard.', 'info');
      openAuthModal('signin');
    }
  }, [isAuthenticated, openAuthModal, showToast]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Scorecard />;
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Suspense
            fallback={
              <div className="cc-shell flex min-h-screen items-center justify-center px-4 text-xs text-[color:var(--color-muted)]">
                Loading CampusCode…
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<ProtectedDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <AuthModal />
          <GithubAuthModal />
          <DemoModal />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
