import React, { useState, useEffect } from 'react';
import { Database, Upload } from 'lucide-react';
import { migrateLocalStorageToSupabase, checkMigrationStatus } from '../utils/migrateData';
import { migrateVideoUrls } from '../utils/migrateVideoUrls';

const MigrationButton: React.FC = () => {
  const [migrationStatus, setMigrationStatus] = useState({
    hasLocalData: false,
    hasSupabaseData: false,
    localCount: 0,
    supabaseCount: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const status = await checkMigrationStatus();
    setMigrationStatus(status);
  };

  const handleMigration = async () => {
    setIsLoading(true);
    try {
      const success = await migrateLocalStorageToSupabase();
      if (success) {
        // Também migra vídeos com blob URLs
        await migrateVideoUrls();
        setShowModal(true);
        await checkStatus(); // Atualiza status após migração
      } else {
        alert('Erro na migração. Verifique o console para mais detalhes.');
      }
    } catch (error) {
      console.error('Erro na migração:', error);
      alert('Erro na migração. Verifique o console para mais detalhes.');
    } finally {
      setIsLoading(false);
    }
  };

  // Não mostra o botão se não há dados locais para migrar
  if (!migrationStatus.hasLocalData) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleMigration}
        disabled={isLoading}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <Upload className="w-4 h-4 animate-spin" />
        ) : (
          <Database className="w-4 h-4" />
        )}
        {isLoading ? 'Migrando...' : `Migrar ${migrationStatus.localCount} apartamentos`}
      </button>

      {/* Modal de sucesso */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Migração Concluída!</h3>
            <p className="text-gray-600 mb-4">
              {migrationStatus.localCount} apartamentos foram migrados para o Supabase com sucesso!
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MigrationButton;
