import { useState, useEffect } from 'react';

export const useVideoThumbnail = (videoSrc: string) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!videoSrc) {
      setLoading(false);
      return;
    }

    const generateThumbnail = () => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      video.muted = true;

      video.onloadedmetadata = () => {
        // Buscar frame aos 2 segundos ou 10% do vídeo, o que for menor
        const seekTime = Math.min(2, video.duration * 0.1);
        video.currentTime = seekTime;
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            setLoading(false);
            return;
          }

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setThumbnail(thumbnailDataUrl);
          setLoading(false);
        } catch (error) {
          console.warn('Erro ao gerar thumbnail do vídeo:', error);
          setLoading(false);
        }
      };

      video.onerror = () => {
        console.warn('Erro ao carregar vídeo para thumbnail');
        setLoading(false);
      };

      video.src = videoSrc;
    };

    generateThumbnail();
  }, [videoSrc]);

  return { thumbnail, loading };
};
