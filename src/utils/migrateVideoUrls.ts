import { supabase } from '../lib/supabase';
import { storageService } from '../lib/storage';

/**
 * Migra vídeos com blob URLs para Supabase Storage
 */
export const migrateVideoUrls = async (): Promise<void> => {
  try {
    // Busca todos os apartamentos com vídeos
    const { data: apartments, error } = await supabase
      .from('apartments')
      .select('id, video')
      .not('video', 'is', null);

    if (error) {
      console.error('Erro ao buscar apartamentos:', error);
      return;
    }

    if (!apartments || apartments.length === 0) {
      console.log('Nenhum apartamento com vídeo encontrado');
      return;
    }

    console.log(`Encontrados ${apartments.length} apartamentos com vídeos para verificar`);

    for (const apartment of apartments) {
      const videoUrl = apartment.video;
      
      // Verifica se é uma blob URL que precisa ser migrada
      if (videoUrl && storageService.isBlobUrl(videoUrl)) {
        console.log(`Migrando vídeo blob para apartamento ${apartment.id}`);
        
        try {
          // Converte blob URL para arquivo
          const videoFile = await storageService.blobUrlToFile(videoUrl, 'video.mp4');
          
          if (videoFile) {
            // Faz upload para o Supabase Storage
            const newVideoUrl = await storageService.uploadVideo(videoFile);
            
            if (newVideoUrl) {
              // Atualiza o registro no banco
              const { error: updateError } = await supabase
                .from('apartments')
                .update({ video: newVideoUrl })
                .eq('id', apartment.id);

              if (updateError) {
                console.error(`Erro ao atualizar apartamento ${apartment.id}:`, updateError);
              } else {
                console.log(`Vídeo migrado com sucesso para apartamento ${apartment.id}`);
              }
            }
          }
        } catch (migrationError) {
          console.error(`Erro na migração do vídeo do apartamento ${apartment.id}:`, migrationError);
        }
      }
    }

    console.log('Migração de vídeos concluída');
  } catch (error) {
    console.error('Erro geral na migração de vídeos:', error);
  }
};
