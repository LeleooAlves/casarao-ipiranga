import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useApartments } from './useApartments';

export interface UserInterest {
  id: string;
  apartment_id: string;
  user_name: string;
  user_whatsapp: string;
  user_type: 'available' | 'rented';
  apartment_title: string;
  apartment_available: boolean;
  created_at: string | null;
}

export const useUserInterests = () => {
  const [interests, setInterests] = useState<UserInterest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { apartments } = useApartments();

  useEffect(() => {
    loadInterests();

    // Configurar subscription para atualizações em tempo real
    const interestsChannel = supabase
      .channel('user-interests-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_interests' },
        () => {
          console.log('Interesses alterados - recarregando lista');
          loadInterests();
        }
      )
      .subscribe();

    // Configurar polling a cada 2 segundos como backup
    const pollingInterval = setInterval(() => {
      console.log('Polling: Atualizando interesses automaticamente');
      loadInterests();
    }, 2000); // 2 segundos

    // Cleanup function
    return () => {
      supabase.removeChannel(interestsChannel);
      clearInterval(pollingInterval);
    };
  }, []);

  const loadInterests = async () => {
    try {
      const { data, error } = await supabase
        .from('user_interests')
        .select('*')
        .order('created_at', { ascending: true }); // Mais antigo primeiro (quem chegou primeiro)

      if (error) {
        console.error('Erro ao carregar interesses:', error);
        return;
      }

      setInterests(data || []);
    } catch (error) {
      console.error('Erro ao carregar interesses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addInterest = async (
    apartmentId: string,
    userName: string,
    userWhatsapp: string,
    apartmentTitle: string,
    apartmentAvailable: boolean
  ) => {
    try {
      const userType = apartmentAvailable ? 'available' : 'rented';
      
      const { data, error } = await supabase
        .from('user_interests')
        .insert({
          apartment_id: apartmentId,
          user_name: userName,
          user_whatsapp: userWhatsapp,
          user_type: userType,
          apartment_title: apartmentTitle,
          apartment_available: apartmentAvailable
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar interesse:', error);
        return false;
      }

      // Mensagem já registrada no ApartmentDetails.tsx quando usuário clica no WhatsApp

      // Atualiza a lista local
      setInterests(prev => [data, ...prev]);
      return true;
    } catch (error) {
      console.error('Erro ao adicionar interesse:', error);
      return false;
    }
  };

  const getInterestsByApartment = (apartmentId: string) => {
    return interests.filter(interest => interest.apartment_id === apartmentId);
  };

  const getInterestsCount = () => {
    return {
      total: interests.length,
      available: interests.filter(interest => interest.user_type === 'available').length,
      rented: interests.filter(interest => interest.user_type === 'rented').length
    };
  };

  const getInterestsByType = (type: 'available' | 'rented') => {
    return interests.filter(interest => interest.user_type === type);
  };

  const getApartmentsWithInterests = () => {
    const apartmentMap = new Map();
    
    interests.forEach(interest => {
      if (!apartmentMap.has(interest.apartment_id)) {
        // Verificar se o apartamento ainda existe
        const apartmentExists = apartments.some(apt => apt.id === interest.apartment_id);
        const currentApartment = apartments.find(apt => apt.id === interest.apartment_id);
        
        apartmentMap.set(interest.apartment_id, {
          apartment_id: interest.apartment_id,
          apartment_title: interest.apartment_title,
          apartment_available: apartmentExists ? (currentApartment?.available || false) : false,
          apartment_exists: apartmentExists,
          interests: []
        });
      }
      apartmentMap.get(interest.apartment_id).interests.push(interest);
    });

    // Ordenar interesses por data (mais recente primeiro)
    apartmentMap.forEach(apartment => {
      apartment.interests.sort((a: UserInterest, b: UserInterest) => 
        new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      );
    });

    return Array.from(apartmentMap.values());
  };

  return {
    interests,
    isLoading,
    addInterest,
    getInterestsByApartment,
    getInterestsCount,
    getInterestsByType,
    getApartmentsWithInterests,
    refreshInterests: loadInterests
  };
};
