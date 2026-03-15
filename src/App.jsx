import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import AuthCallback from './pages/AuthCallback';
import Welcome from './pages/Welcome';
import HomePage from './pages/HomePage';
import CoursePage from './pages/CoursePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
