import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Search } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const navigation = [
    { name: 'Início', href: '/', icon: Home },
    { name: 'Catálogo', href: '/catalog', icon: Search },
  ];

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        const scrollThreshold = 100; // Pixels para rolar antes de ocultar/mostrar

        if (currentScrollY <= scrollThreshold) {
          // Mostrar navbar apenas quando estiver no topo da página
          setIsVisible(true);
        } else {
          // Esconder navbar quando rolar para baixo
          setIsVisible(false);
        }

        setLastScrollY(currentScrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getActiveIndex = () => {
    return navigation.findIndex(item => item.href === location.pathname);
  };

  const shouldShowNavigation = () => {
    // Ocultar navegação nas páginas de detalhes do apartamento
    return !location.pathname.startsWith('/catalog/apartment/');
  };

  const shouldShowHeader = () => {
    // Ocultar header completamente nas páginas de detalhes do apartamento
    return !location.pathname.startsWith('/catalog/apartment/');
  };

  if (!shouldShowHeader()) {
    return null;
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Header */}
        <div className="hidden md:flex flex-col items-center py-6">
          {/* Logo (Desktop) */}
          <img src="/logo/logo-casarao.png" alt="Casarão Ipiranga" className="h-28 w-auto mb-4" />
          {/* Desktop Navigation */}
          {shouldShowNavigation() && (
            <nav className="relative">
              <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg px-8 py-3 relative">
                {/* Sliding indicator */}
                <div 
                  className="absolute top-0 left-0 h-full bg-primary/10 rounded-full transition-all duration-300 ease-in-out"
                  style={{
                    width: `${100 / navigation.length}%`,
                    transform: `translateX(${getActiveIndex() * 100}%)`,
                  }}
                />
                
                <div className="flex space-x-8 relative z-10">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                          isActive(item.href)
                            ? 'text-primary'
                            : 'text-gray-600 hover:text-primary'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>
          )}
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between py-6 px-4">
          {/* Logo (Mobile) */}
          <img src="/logo/logo-casarao.png" alt="Casarão Ipiranga" className="h-28 w-auto" />
          {/* Mobile menu button (Hamburger) */}
          {shouldShowNavigation() && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-white/90 backdrop-blur-md rounded-full p-3 shadow-lg text-primary hover:bg-white transition-colors duration-200 ml-auto"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && shouldShowNavigation() && (
          <div className="md:hidden pb-4">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg mx-4 p-4">
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;