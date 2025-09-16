import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AdminButton from './components/AdminButton';
import AdminLoginModal from './components/AdminLoginModal';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ApartmentDetails from './pages/ApartmentDetails';
import AdminProtected from './pages/AdminProtected';
import { useAdminAuth } from './hooks/useAdminAuth';

function App() {
  const [showFloatingButtons, setShowFloatingButtons] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);
  const { login: adminLogin } = useAdminAuth();

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
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="min-h-screen bg-background flex flex-col">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <main className="flex-1">
                <Home />
              </main>
              <Footer ref={footerRef} />
              {showFloatingButtons && <WhatsAppButton />}
              {showFloatingButtons && (
                <AdminButton onClick={() => setShowAdminModal(true)} />
              )}
            </>
          } />
          <Route path="/catalog" element={
            <>
              <Header />
              <main className="flex-1">
                <Catalog />
              </main>
              <Footer ref={footerRef} />
              {showFloatingButtons && <WhatsAppButton />}
              {showFloatingButtons && (
                <AdminButton onClick={() => setShowAdminModal(true)} />
              )}
            </>
          } />
          <Route path="/catalog/apartment/:slug" element={
            <>
              <Header />
              <main className="flex-1">
                <ApartmentDetails />
              </main>
              <Footer ref={footerRef} />
              {showFloatingButtons && <WhatsAppButton />}
              {showFloatingButtons && (
                <AdminButton onClick={() => setShowAdminModal(true)} />
              )}
            </>
          } />
          <Route path="/admin" element={<AdminProtected />} />
        </Routes>
        <AdminLoginModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          onLogin={adminLogin}
        />
      </div>
    </Router>
  );
}

export default App;