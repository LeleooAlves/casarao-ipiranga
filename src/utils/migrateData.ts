import { supabase } from '../lib/supabase';
import { Apartment } from '../types';

const APARTMENTS_STORAGE_KEY = 'casarao_apartments';

export const migrateLocalStorageToSupabase = async (): Promise<boolean> => {
  try {
    // Verifica se há dados no localStorage
    const savedApartments = localStorage.getItem(APARTMENTS_STORAGE_KEY);
    if (!savedApartments) {
      console.log('Nenhum dado encontrado no localStorage para migrar');
      return true;
    }

    const localApartments: Apartment[] = JSON.parse(savedApartments);
    if (localApartments.length === 0) {
      console.log('localStorage vazio, nada para migrar');
      return true;
    }

    console.log(`Migrando ${localApartments.length} apartamentos do localStorage para Supabase...`);

    // Converte dados para formato do Supabase
    const supabaseData = localApartments.map(apt => ({
      id: apt.id,
      slug: apt.slug,
      title: apt.title,
      description: apt.description,
      price_monthly: apt.price.monthly,
      price_daily: apt.price.daily,
      images: apt.images,
      video: apt.video,
      amenities: apt.amenities,
      size: apt.size,
      bedrooms: apt.bedrooms,
      bathrooms: apt.bathrooms,
      type: apt.type,
      available: apt.available,
      location_lat: apt.location.lat,
      location_lng: apt.location.lng,
      location_address: apt.location.address,
      nearby_attractions: apt.nearbyAttractions
    }));

    // Insere dados no Supabase usando upsert para evitar duplicatas
    const { error } = await supabase
      .from('apartments')
      .upsert(supabaseData, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('Erro na migração:', error);
      return false;
    }

    console.log('Migração concluída com sucesso!');
    
    // Opcional: Criar backup do localStorage antes de limpar
    localStorage.setItem(`${APARTMENTS_STORAGE_KEY}_backup`, savedApartments);
    
    // Remove dados do localStorage após migração bem-sucedida
    localStorage.removeItem(APARTMENTS_STORAGE_KEY);
    
    return true;
  } catch (error) {
    console.error('Erro durante a migração:', error);
    return false;
  }
};

export const checkMigrationStatus = async (): Promise<{
  hasLocalData: boolean;
  hasSupabaseData: boolean;
  localCount: number;
  supabaseCount: number;
}> => {
  try {
    // Verifica localStorage
    const savedApartments = localStorage.getItem(APARTMENTS_STORAGE_KEY);
    const localApartments = savedApartments ? JSON.parse(savedApartments) : [];
    
    // Verifica Supabase
    const { data: supabaseApartments, error } = await supabase
      .from('apartments')
      .select('id', { count: 'exact' });

    const supabaseCount = error ? 0 : (supabaseApartments?.length || 0);

    return {
      hasLocalData: localApartments.length > 0,
      hasSupabaseData: supabaseCount > 0,
      localCount: localApartments.length,
      supabaseCount
    };
  } catch (error) {
    console.error('Erro ao verificar status da migração:', error);
    return {
      hasLocalData: false,
      hasSupabaseData: false,
      localCount: 0,
      supabaseCount: 0
    };
  }
};
