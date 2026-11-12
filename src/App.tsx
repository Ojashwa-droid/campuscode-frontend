import Landing from './pages/Landing';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { GithubAuthModal } from './components/auth/GithubAuthModal';
import { DemoModal } from './components/demo/DemoModal';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Landing />
        <AuthModal />
        <GithubAuthModal />
        <DemoModal />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
