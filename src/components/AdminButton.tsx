import React from 'react';
import { Settings } from 'lucide-react';

interface AdminButtonProps {
  onClick: () => void;
}

const AdminButton: React.FC<AdminButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 left-4 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors duration-300 z-40"
      title="Acesso Administrativo"
    >
      <Settings className="h-5 w-5" />
    </button>
  );
};

export default AdminButton;
