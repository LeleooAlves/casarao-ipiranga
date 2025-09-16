import { useState, useEffect } from 'react';
import { Apartment } from '../types';
import { supabase } from '../lib/supabase';

const APARTMENTS_STORAGE_KEY = 'casarao_apartments';

export const useApartments = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApartments();
  }, []);

  const loadApartments = async () => {
    try {
      // Primeiro, tenta carregar do Supabase
      const { data: supabaseApartments, error } = await supabase
        .from('apartments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar do Supabase:', error);
        // Fallback para localStorage se Supabase falhar
        const savedApartments = localStorage.getItem(APARTMENTS_STORAGE_KEY);
        if (savedApartments) {
          const localApartments = JSON.parse(savedApartments);
          setApartments(localApartments);
        }
      } else {
        // Converte dados do Supabase para formato da interface
        const formattedApartments: Apartment[] = supabaseApartments.map(apt => ({
          id: apt.id,
          slug: apt.slug,
          title: apt.title,
          description: apt.description,
          price: {
            monthly: apt.price_monthly,
            daily: apt.price_daily
          },
          images: apt.images,
          video: apt.video,
          amenities: apt.amenities,
          size: apt.size,
          bedrooms: apt.bedrooms,
          bathrooms: apt.bathrooms,
          type: apt.type,
          available: apt.available,
          location: {
            lat: apt.location_lat,
            lng: apt.location_lng,
            address: apt.location_address
          },
          nearbyAttractions: apt.nearby_attractions
        }));
        
        setApartments(formattedApartments);
      }
    } catch (error) {
      console.error('Erro ao carregar apartamentos:', error);
      // Fallback para localStorage em caso de erro
      try {
        const savedApartments = localStorage.getItem(APARTMENTS_STORAGE_KEY);
        if (savedApartments) {
          setApartments(JSON.parse(savedApartments));
        }
      } catch (localError) {
        console.error('Erro ao carregar do localStorage:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveApartments = (apartmentsList: Apartment[]) => {
    try {
      const dataToSave = JSON.stringify(apartmentsList);
      const sizeInMB = new Blob([dataToSave]).size / (1024 * 1024);
      
      if (sizeInMB > 4) {
        throw new Error(`Dados muito grandes (${sizeInMB.toFixed(2)}MB). Limite: 4MB`);
      }
      
      localStorage.setItem(APARTMENTS_STORAGE_KEY, dataToSave);
      setApartments(apartmentsList);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        alert('Erro: Limite de armazenamento excedido. Tente usar imagens menores ou remover apartamentos antigos.');
      } else {
        console.error('Erro ao salvar apartamentos:', error);
        alert('Erro ao salvar apartamento. Tente novamente com imagens menores.');
      }
      throw error;
    }
  };

  const createSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .trim()
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-'); // Remove hífens duplicados
  };

  const addApartment = async (apartment: Omit<Apartment, 'id' | 'slug'>) => {
    const slug = createSlug(apartment.title);
    
    try {
      // Tenta salvar no Supabase primeiro
      const { data, error } = await supabase
        .from('apartments')
        .insert({
          slug,
          title: apartment.title,
          description: apartment.description,
          price_monthly: apartment.price.monthly,
          price_daily: apartment.price.daily,
          images: apartment.images,
          video: apartment.video,
          amenities: apartment.amenities,
          size: apartment.size,
          bedrooms: apartment.bedrooms,
          bathrooms: apartment.bathrooms,
          type: apartment.type,
          available: true,
          location_lat: apartment.location.lat,
          location_lng: apartment.location.lng,
          location_address: apartment.location.address,
          nearby_attractions: apartment.nearbyAttractions
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar no Supabase:', error);
        // Fallback para localStorage
        const newApartment: Apartment = {
          ...apartment,
          id: Date.now().toString(),
          slug,
          available: true
        };
        const updatedApartments = [...apartments, newApartment];
        saveApartments(updatedApartments);
        return newApartment;
      } else {
        // Converte dados do Supabase para formato da interface
        const newApartment: Apartment = {
          id: data.id,
          slug: data.slug,
          title: data.title,
          description: data.description,
          price: {
            monthly: data.price_monthly,
            daily: data.price_daily
          },
          images: data.images,
          video: data.video,
          amenities: data.amenities,
          size: data.size,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          type: data.type,
          available: data.available,
          location: {
            lat: data.location_lat,
            lng: data.location_lng,
            address: data.location_address
          },
          nearbyAttractions: data.nearby_attractions
        };
        
        // Atualiza estado local
        setApartments(prev => [...prev, newApartment]);
        return newApartment;
      }
    } catch (error) {
      console.error('Erro ao adicionar apartamento:', error);
      // Fallback para localStorage
      const newApartment: Apartment = {
        ...apartment,
        id: Date.now().toString(),
        slug,
        available: true
      };
      const updatedApartments = [...apartments, newApartment];
      saveApartments(updatedApartments);
      return newApartment;
    }
  };

  const updateApartment = async (id: string, updates: Partial<Apartment>) => {
    try {
      // Converte updates para formato do Supabase
      const supabaseUpdates: any = {};
      if (updates.title) supabaseUpdates.title = updates.title;
      if (updates.description) supabaseUpdates.description = updates.description;
      if (updates.price) {
        supabaseUpdates.price_monthly = updates.price.monthly;
        supabaseUpdates.price_daily = updates.price.daily;
      }
      if (updates.images) supabaseUpdates.images = updates.images;
      if (updates.video !== undefined) supabaseUpdates.video = updates.video;
      if (updates.amenities) supabaseUpdates.amenities = updates.amenities;
      if (updates.size) supabaseUpdates.size = updates.size;
      if (updates.bedrooms) supabaseUpdates.bedrooms = updates.bedrooms;
      if (updates.bathrooms) supabaseUpdates.bathrooms = updates.bathrooms;
      if (updates.type) supabaseUpdates.type = updates.type;
      if (updates.available !== undefined) supabaseUpdates.available = updates.available;
      if (updates.location) {
        supabaseUpdates.location_lat = updates.location.lat;
        supabaseUpdates.location_lng = updates.location.lng;
        supabaseUpdates.location_address = updates.location.address;
      }
      if (updates.nearbyAttractions) supabaseUpdates.nearby_attractions = updates.nearbyAttractions;

      const { error } = await supabase
        .from('apartments')
        .update(supabaseUpdates)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar no Supabase:', error);
        // Fallback para localStorage
        const updatedApartments = apartments.map(apt => 
          apt.id === id ? { ...apt, ...updates } : apt
        );
        saveApartments(updatedApartments);
      } else {
        // Atualiza estado local
        setApartments(prev => prev.map(apt => 
          apt.id === id ? { ...apt, ...updates } : apt
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar apartamento:', error);
      // Fallback para localStorage
      const updatedApartments = apartments.map(apt => 
        apt.id === id ? { ...apt, ...updates } : apt
      );
      saveApartments(updatedApartments);
    }
  };

  const deleteApartment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('apartments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar no Supabase:', error);
        // Fallback para localStorage
        const updatedApartments = apartments.filter(apt => apt.id !== id);
        saveApartments(updatedApartments);
      } else {
        // Atualiza estado local
        setApartments(prev => prev.filter(apt => apt.id !== id));
      }
    } catch (error) {
      console.error('Erro ao deletar apartamento:', error);
      // Fallback para localStorage
      const updatedApartments = apartments.filter(apt => apt.id !== id);
      saveApartments(updatedApartments);
    }
  };

  const clearAllApartments = async () => {
    try {
      const { error } = await supabase
        .from('apartments')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Deleta todos os registros

      if (error) {
        console.error('Erro ao limpar Supabase:', error);
        // Fallback para localStorage
        localStorage.removeItem(APARTMENTS_STORAGE_KEY);
        setApartments([]);
      } else {
        // Atualiza estado local
        setApartments([]);
        // Também remove do localStorage para manter sincronizado
        localStorage.removeItem(APARTMENTS_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Erro ao limpar apartamentos:', error);
      // Fallback para localStorage
      localStorage.removeItem(APARTMENTS_STORAGE_KEY);
      setApartments([]);
    }
  };

  const getApartmentById = (id: string) => {
    return apartments.find(apt => apt.id === id);
  };

  const getApartmentBySlug = (slug: string) => {
    return apartments.find(apt => apt.slug === slug);
  };

  return {
    apartments,
    isLoading,
    addApartment,
    updateApartment,
    deleteApartment,
    clearAllApartments,
    getApartmentById,
    getApartmentBySlug,
    refreshApartments: loadApartments
  };
};
