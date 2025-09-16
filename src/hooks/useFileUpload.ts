import { useState } from 'react';
import { storageService } from '../lib/storage';

export interface UploadProgress {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
    error: null
  });

  const uploadImages = async (files: File[]): Promise<string[]> => {
    setUploadProgress({ isUploading: true, progress: 0, error: null });
    
    try {
      const urls = await storageService.uploadImages(files);
      setUploadProgress({ isUploading: false, progress: 100, error: null });
      return urls;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no upload das imagens';
      setUploadProgress({ isUploading: false, progress: 0, error: errorMessage });
      return [];
    }
  };

  const uploadVideo = async (file: File): Promise<string | null> => {
    setUploadProgress({ isUploading: true, progress: 0, error: null });
    
    try {
      const url = await storageService.uploadVideo(file);
      setUploadProgress({ isUploading: false, progress: 100, error: null });
      return url;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no upload do vídeo';
      setUploadProgress({ isUploading: false, progress: 0, error: errorMessage });
      return null;
    }
  };

  const convertAndUploadImages = async (base64Images: string[]): Promise<string[]> => {
    setUploadProgress({ isUploading: true, progress: 0, error: null });
    
    try {
      const files = base64Images.map((base64, index) => 
        storageService.base64ToFile(base64, `image-${index}.jpg`)
      );
      
      const urls = await storageService.uploadImages(files);
      setUploadProgress({ isUploading: false, progress: 100, error: null });
      return urls;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na conversão e upload das imagens';
      setUploadProgress({ isUploading: false, progress: 0, error: errorMessage });
      return [];
    }
  };

  const convertAndUploadVideo = async (blobUrl: string): Promise<string | null> => {
    setUploadProgress({ isUploading: true, progress: 0, error: null });
    
    try {
      const file = await storageService.blobUrlToFile(blobUrl, 'video.mp4');
      if (!file) {
        throw new Error('Falha ao converter vídeo');
      }
      
      const url = await storageService.uploadVideo(file);
      setUploadProgress({ isUploading: false, progress: 100, error: null });
      return url;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na conversão e upload do vídeo';
      setUploadProgress({ isUploading: false, progress: 0, error: errorMessage });
      return null;
    }
  };

  const resetProgress = () => {
    setUploadProgress({ isUploading: false, progress: 0, error: null });
  };

  return {
    uploadProgress,
    uploadImages,
    uploadVideo,
    convertAndUploadImages,
    convertAndUploadVideo,
    resetProgress
  };
};
