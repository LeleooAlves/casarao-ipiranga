import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Funções utilitárias para YouTube
const extractYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const getYouTubeEmbedUrl = (url: string): string | null => {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const getYouTubeThumbnail = (url: string): string | null => {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
};

export interface FaqVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  video_file_path: string | null;
  thumbnail_url: string | null;
  faq_question_id: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useFaqVideos = () => {
  const [videos, setVideos] = useState<FaqVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVideos();

    // Configurar subscription para atualizações em tempo real
    const videosChannel = supabase
      .channel('faq-videos-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'faq_videos' },
        () => {
          console.log('Vídeos FAQ alterados - recarregando lista');
          loadVideos();
        }
      )
      .subscribe();

    // Configurar polling a cada 2 segundos como backup
    const pollingInterval = setInterval(() => {
      console.log('Polling: Atualizando vídeos FAQ automaticamente');
      loadVideos();
    }, 2000);

    // Cleanup function
    return () => {
      supabase.removeChannel(videosChannel);
      clearInterval(pollingInterval);
    };
  }, []);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('faq_videos')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar vídeos FAQ:', error);
        return;
      }

      setVideos(data || []);
    } catch (error) {
      console.error('Erro ao carregar vídeos FAQ:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addVideo = async (
    faqQuestionId: string,
    description: string,
    videoFile?: File,
    videoUrl?: string,
    thumbnailUrl?: string,
    orderIndex?: number
  ) => {
    try {
      let videoFilePath = null;
      let processedVideoUrl = videoUrl;
      let processedThumbnailUrl = thumbnailUrl;
      
      // Upload do arquivo de vídeo se fornecido
      if (videoFile) {
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `faq-videos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(filePath, videoFile);

        if (uploadError) {
          console.error('Erro ao fazer upload do vídeo:', uploadError);
          return false;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(filePath);

        videoFilePath = publicUrl;
      }

      // Processar URL do YouTube se fornecida
      if (videoUrl) {
        const embedUrl = getYouTubeEmbedUrl(videoUrl);
        if (embedUrl) {
          processedVideoUrl = embedUrl;
          // Se não há thumbnail fornecida, usar a do YouTube
          if (!thumbnailUrl) {
            processedThumbnailUrl = getYouTubeThumbnail(videoUrl) || undefined;
          }
        }
      }

      const { data, error } = await supabase
        .from('faq_videos')
        .insert({
          faq_question_id: faqQuestionId,
          title: faqQuestionId, // Usaremos o ID para buscar a pergunta depois
          description,
          video_url: processedVideoUrl || null,
          video_file_path: videoFilePath,
          thumbnail_url: processedThumbnailUrl || null,
          order_index: orderIndex || videos.length + 1,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar vídeo FAQ:', error);
        return false;
      }

      // Atualiza a lista local
      setVideos(prev => [...prev, data].sort((a, b) => a.order_index - b.order_index));
      return true;
    } catch (error) {
      console.error('Erro ao adicionar vídeo FAQ:', error);
      return false;
    }
  };

  const updateVideo = async (
    id: string,
    updates: Partial<Omit<FaqVideo, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    try {
      const { data, error } = await supabase
        .from('faq_videos')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar vídeo FAQ:', error);
        return false;
      }

      // Atualiza a lista local
      setVideos(prev => 
        prev.map(video => video.id === id ? data : video)
           .sort((a, b) => a.order_index - b.order_index)
      );
      return true;
    } catch (error) {
      console.error('Erro ao atualizar vídeo FAQ:', error);
      return false;
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('faq_videos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar vídeo FAQ:', error);
        return false;
      }

      // Remove da lista local
      setVideos(prev => prev.filter(video => video.id !== id));
      return true;
    } catch (error) {
      console.error('Erro ao deletar vídeo FAQ:', error);
      return false;
    }
  };

  const toggleVideoStatus = async (id: string) => {
    const video = videos.find(v => v.id === id);
    if (!video) return false;

    return await updateVideo(id, { is_active: !video.is_active });
  };

  const reorderVideos = async (videoIds: string[]) => {
    try {
      const updates = videoIds.map((id, index) => ({
        id,
        order_index: index + 1
      }));

      for (const update of updates) {
        await supabase
          .from('faq_videos')
          .update({ order_index: update.order_index })
          .eq('id', update.id);
      }

      // Recarregar lista
      await loadVideos();
      return true;
    } catch (error) {
      console.error('Erro ao reordenar vídeos FAQ:', error);
      return false;
    }
  };

  // Filtros úteis
  const activeVideos = videos.filter(video => video.is_active);
  const inactiveVideos = videos.filter(video => !video.is_active);

  return {
    videos,
    activeVideos,
    inactiveVideos,
    isLoading,
    addVideo,
    updateVideo,
    deleteVideo,
    toggleVideoStatus,
    reorderVideos,
    refreshVideos: loadVideos
  };
};
