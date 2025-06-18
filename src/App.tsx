import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ApartmentDetails from './pages/ApartmentDetails';
import Reviews from './pages/Reviews';

function App() {
  const [showFloatingButtons, setShowFloatingButtons] = useState(true);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (footerRef.current) {
        const footerTop = footerRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // Define um limite para ocultar os botões um pouco antes do rodapé
        const threshold = 150; 
        if (footerTop < windowHeight - threshold) {
          setShowFloatingButtons(false);
        } else {
          setShowFloatingButtons(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/apartment/:id" element={<ApartmentDetails />} />
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
        </main>
        <Footer ref={footerRef} />
        {showFloatingButtons && <WhatsAppButton />}
      </div>
    </Router>
  );
}

export default App;