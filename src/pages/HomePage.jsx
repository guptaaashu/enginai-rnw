import HomeNavbar from '../components/HomeNavbar';
import OngoingCourses from '../components/OngoingCourses';
import AllCourses from '../components/AllCourses';
import ChatBot from '../components/ChatBot';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { loading } = useAuth();

  if (loading) return null;

  return (
    <>
      <HomeNavbar />
      <OngoingCourses />
      <AllCourses />
      <ChatBot />
    </>
  );
}
