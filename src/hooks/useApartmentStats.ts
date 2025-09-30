import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ApartmentStats {
  totalViews: number;
  totalMessages: number;
  apartmentViews: Record<string, number>;
  apartmentMessages: Record<string, number>;
}

const STATS_STORAGE_KEY = 'casarao_apartment_stats';

export const useApartmentStats = () => {
  const [stats, setStats] = useState<ApartmentStats>({
    totalViews: 0,
    totalMessages: 0,
    apartmentViews: {},
    apartmentMessages: {}
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Tentar carregar do Supabase primeiro
      const { data: statsData, error } = await supabase
        .from('apartment_stats')
        .select('*');

      if (!error && statsData) {
        const apartmentViews: Record<string, number> = {};
        const apartmentMessages: Record<string, number> = {};
        let totalViews = 0;
        let totalMessages = 0;

        statsData.forEach((stat: any) => {
          if (stat.apartment_id) {
            apartmentViews[stat.apartment_id] = stat.views || 0;
            apartmentMessages[stat.apartment_id] = stat.messages || 0;
            totalViews += stat.views || 0;
            totalMessages += stat.messages || 0;
          }
        });

        setStats({
          totalViews,
          totalMessages,
          apartmentViews,
          apartmentMessages
        });
        return;
      }

      // Fallback para localStorage se Supabase falhar
      const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      // Fallback para localStorage em caso de erro
      try {
        const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
        if (savedStats) {
          setStats(JSON.parse(savedStats));
        }
      } catch (localError) {
        console.error('Erro ao carregar do localStorage:', localError);
      }
    }
  };

  const saveStats = (newStats: ApartmentStats) => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
      setStats(newStats);
    } catch (error) {
      console.error('Erro ao salvar estatísticas:', error);
    }
  };

  const incrementViews = async (apartmentId: string) => {
    try {
      // Tentar atualizar no Supabase primeiro
      const { error } = await supabase
        .from('apartment_stats')
        .upsert({
          apartment_id: apartmentId,
          views: (stats.apartmentViews[apartmentId] || 0) + 1,
          messages: stats.apartmentMessages[apartmentId] || 0
        }, {
          onConflict: 'apartment_id'
        });

      if (!error) {
        // Atualizar estado local
        const newStats = {
          ...stats,
          totalViews: stats.totalViews + 1,
          apartmentViews: {
            ...stats.apartmentViews,
            [apartmentId]: (stats.apartmentViews[apartmentId] || 0) + 1
          }
        };
        setStats(newStats);
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
        return;
      }
    } catch (error) {
      console.error('Erro ao incrementar views no Supabase:', error);
    }

    // Fallback para localStorage
    const newStats = {
      ...stats,
      totalViews: stats.totalViews + 1,
      apartmentViews: {
        ...stats.apartmentViews,
        [apartmentId]: (stats.apartmentViews[apartmentId] || 0) + 1
      }
    };
    saveStats(newStats);
  };

  const incrementMessages = async (apartmentId: string) => {
    try {
      // Tentar atualizar no Supabase primeiro
      const { error } = await supabase
        .from('apartment_stats')
        .upsert({
          apartment_id: apartmentId,
          views: stats.apartmentViews[apartmentId] || 0,
          messages: (stats.apartmentMessages[apartmentId] || 0) + 1
        }, {
          onConflict: 'apartment_id'
        });

      if (!error) {
        // Atualizar estado local
        const newStats = {
          ...stats,
          totalMessages: stats.totalMessages + 1,
          apartmentMessages: {
            ...stats.apartmentMessages,
            [apartmentId]: (stats.apartmentMessages[apartmentId] || 0) + 1
          }
        };
        setStats(newStats);
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
        return;
      }
    } catch (error) {
      console.error('Erro ao incrementar messages no Supabase:', error);
    }

    // Fallback para localStorage
    const newStats = {
      ...stats,
      totalMessages: stats.totalMessages + 1,
      apartmentMessages: {
        ...stats.apartmentMessages,
        [apartmentId]: (stats.apartmentMessages[apartmentId] || 0) + 1
      }
    };
    saveStats(newStats);
  };

  const clearStats = () => {
    const emptyStats: ApartmentStats = {
      totalViews: 0,
      totalMessages: 0,
      apartmentViews: {},
      apartmentMessages: {}
    };
    saveStats(emptyStats);
  };

  return {
    stats,
    incrementViews,
    incrementMessages,
    clearStats,
    refreshStats: loadStats
  };
};
