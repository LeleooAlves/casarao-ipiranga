import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface DashboardStats {
  totalViews: number;
  totalMessages: number;
  totalApartments: number;
  availableApartments: number;
  rentedApartments: number;
  lastUpdated: string;
}

export interface ApartmentAnalytics {
  apartmentId: string;
  apartmentTitle: string;
  apartmentSlug: string;
  views: number;
  messages: number;
  lastViewed?: string;
  lastMessage?: string;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    totalMessages: 0,
    totalApartments: 0,
    availableApartments: 0,
    rentedApartments: 0,
    lastUpdated: new Date().toISOString()
  });
  
  const [apartmentAnalytics, setApartmentAnalytics] = useState<ApartmentAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar estatísticas globais
  const loadDashboardStats = async () => {
    try {
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Erro ao carregar estatísticas do dashboard:', error);
        return;
      }

      if (data) {
        setStats({
          totalViews: data.total_views || 0,
          totalMessages: data.total_messages || 0,
          totalApartments: data.total_apartments || 0,
          availableApartments: data.available_apartments || 0,
          rentedApartments: data.rented_apartments || 0,
          lastUpdated: data.last_updated || new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  // Carregar analytics por apartamento
  const loadApartmentAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('apartment_stats')
        .select(`
          apartment_id,
          views,
          messages,
          apartments!apartment_stats_apartment_id_fkey (
            title,
            slug
          )
        `);

      if (error) {
        console.error('Erro ao carregar analytics dos apartamentos:', error);
        return;
      }

      if (data) {
        const analytics: ApartmentAnalytics[] = data.map((item: any) => ({
          apartmentId: item.apartment_id,
          apartmentTitle: item.apartments?.title || 'Apartamento Removido',
          apartmentSlug: item.apartments?.slug || 'removido',
          views: item.views || 0,
          messages: item.messages || 0
        }));

        // Analytics básicos sem consultas adicionais para evitar erros

        setApartmentAnalytics(analytics);
      }
    } catch (error) {
      console.error('Erro ao carregar analytics dos apartamentos:', error);
    }
  };

  // Registrar visualização
  const recordView = async (apartmentId: string, apartmentTitle: string, apartmentSlug: string) => {
    try {
      const { error } = await supabase
        .from('apartment_views')
        .insert({
          apartment_id: apartmentId,
          apartment_title: apartmentTitle,
          apartment_slug: apartmentSlug,
          user_ip: 'anonymous', // Não identificar usuário específico
          user_agent: navigator.userAgent || 'unknown',
          referrer: document.referrer || null
        });

      if (error) {
        console.error('Erro ao registrar visualização:', error);
      } else {
        // Recarregar estatísticas
        await loadDashboardStats();
        await loadApartmentAnalytics();
      }
    } catch (error) {
      console.error('Erro ao registrar visualização:', error);
    }
  };

  // Registrar mensagem
  const recordMessage = async (
    apartmentId: string,
    apartmentTitle: string,
    apartmentSlug: string,
    senderName: string,
    messageContent: string,
    senderEmail?: string,
    senderPhone?: string,
    messageType: 'interest' | 'inquiry' | 'booking' = 'interest'
  ) => {
    try {
      const { error } = await supabase
        .from('apartment_messages')
        .insert({
          apartment_id: apartmentId,
          apartment_title: apartmentTitle,
          apartment_slug: apartmentSlug,
          sender_name: senderName,
          sender_email: senderEmail,
          sender_phone: senderPhone,
          message_content: messageContent,
          message_type: messageType,
          user_ip: 'anonymous' // Não identificar usuário específico
        });

      if (error) {
        console.error('Erro ao registrar mensagem:', error);
      } else {
        // Recarregar estatísticas
        await loadDashboardStats();
        await loadApartmentAnalytics();
      }
    } catch (error) {
      console.error('Erro ao registrar mensagem:', error);
    }
  };


  // Carregar dados iniciais e configurar subscriptions + polling em tempo real
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        loadDashboardStats(),
        loadApartmentAnalytics()
      ]);
      setIsLoading(false);
    };

    loadData();

    // Configurar subscriptions para atualizações em tempo real
    const apartmentsChannel = supabase
      .channel('apartments-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'apartments' },
        () => {
          console.log('Apartamento alterado - atualizando dashboard');
          loadDashboardStats();
          loadApartmentAnalytics();
        }
      )
      .subscribe();

    const viewsChannel = supabase
      .channel('views-changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'apartment_views' },
        () => {
          console.log('Nova visualização - atualizando dashboard');
          loadDashboardStats();
          loadApartmentAnalytics();
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel('messages-changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'apartment_messages' },
        () => {
          console.log('Nova mensagem - atualizando dashboard');
          loadDashboardStats();
          loadApartmentAnalytics();
        }
      )
      .subscribe();

    const statsChannel = supabase
      .channel('stats-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'apartment_stats' },
        () => {
          console.log('Estatísticas alteradas - atualizando dashboard');
          loadDashboardStats();
          loadApartmentAnalytics();
        }
      )
      .subscribe();

    const interestsChannel = supabase
      .channel('interests-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_interests' },
        () => {
          console.log('Interesses alterados - atualizando dashboard');
          loadDashboardStats();
          loadApartmentAnalytics();
        }
      )
      .subscribe();

    // Configurar polling a cada 2 segundos como backup
    const pollingInterval = setInterval(async () => {
      console.log('Polling: Atualizando dashboard automaticamente');
      await Promise.all([
        loadDashboardStats(),
        loadApartmentAnalytics()
      ]);
    }, 2000); // 2 segundos

    // Cleanup function para remover subscriptions e polling
    return () => {
      supabase.removeChannel(apartmentsChannel);
      supabase.removeChannel(viewsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(statsChannel);
      supabase.removeChannel(interestsChannel);
      clearInterval(pollingInterval);
    };
  }, []);


  return {
    stats,
    apartmentAnalytics,
    isLoading,
    recordView,
    recordMessage,
    refreshStats: async () => {
      await Promise.all([
        loadDashboardStats(),
        loadApartmentAnalytics()
      ]);
    }
  };
};
