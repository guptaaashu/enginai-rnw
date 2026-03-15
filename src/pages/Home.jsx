import { useState } from 'react';
import Banner from '../components/Banner';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Courses from '../components/Courses';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <Banner onLoginClick={() => setShowLogin(true)} />
      <Navbar onLoginClick={() => setShowLogin(true)} />
      <Hero onLoginClick={() => setShowLogin(true)} />
      <Courses onLoginClick={() => setShowLogin(true)} />
      <Footer />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
