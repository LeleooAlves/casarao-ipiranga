import React, { useState } from 'react';
import { LogOut, X } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';

const AdminHeader: React.FC = () => {
  const { logout } = useAdminAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <img src="/logo/logo-casarao.png" alt="Casarão Ipiranga" className="h-20 w-auto" />
          
          {/* Logout Button */}
          <button
            onClick={confirmLogout}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-300"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Modal de Confirmação de Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9999]">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sair da Área Administrativa</h3>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja sair da área administrativa? Você precisará fazer login novamente para acessar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
