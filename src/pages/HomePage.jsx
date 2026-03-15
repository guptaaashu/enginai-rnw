import HomeNavbar from '../components/HomeNavbar';
import OngoingCourses from '../components/OngoingCourses';
import AllCourses from '../components/AllCourses';
import ChatBot from '../components/ChatBot';

export default function HomePage() {
  return (
    <>
      <HomeNavbar />
      <OngoingCourses />
      <AllCourses />
      <ChatBot />
    </>
  );
}
