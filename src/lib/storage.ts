import { supabase } from './supabase';

export class StorageService {
  private bucketName = 'apartments-media';

  /**
   * Upload de arquivo para o Supabase Storage
   */
  async uploadFile(file: File, folder: 'images' | 'videos'): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erro no upload:', error);
        return null;
      }

      // Retorna a URL pública do arquivo
      const { data: publicUrl } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(data.path);

      return publicUrl.publicUrl;
    } catch (error) {
      console.error('Erro no upload do arquivo:', error);
      return null;
    }
  }

  /**
   * Upload múltiplo de imagens
   */
  async uploadImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, 'images'));
    const results = await Promise.all(uploadPromises);
    return results.filter(url => url !== null) as string[];
  }

  /**
   * Upload de vídeo
   */
  async uploadVideo(file: File): Promise<string | null> {
    return this.uploadFile(file, 'videos');
  }

  /**
   * Remove arquivo do storage
   */
  async deleteFile(url: string): Promise<boolean> {
    try {
      // Extrai o path do arquivo da URL
      const urlParts = url.split('/');
      const bucketIndex = urlParts.findIndex(part => part === this.bucketName);
      if (bucketIndex === -1) return false;

      const filePath = urlParts.slice(bucketIndex + 1).join('/');

      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Erro ao deletar arquivo:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      return false;
    }
  }

  /**
   * Converte base64 para File object
   */
  base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  }

  /**
   * Converte blob URL para File object
   */
  async blobUrlToFile(blobUrl: string, filename: string): Promise<File | null> {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error('Erro ao converter blob URL:', error);
      return null;
    }
  }

  /**
   * Verifica se uma URL é do Supabase Storage
   */
  isSupabaseStorageUrl(url: string): boolean {
    return url.includes('supabase.co/storage/v1/object/public/');
  }

  /**
   * Verifica se uma URL é base64
   */
  isBase64Url(url: string): boolean {
    return url.startsWith('data:');
  }

  /**
   * Verifica se uma URL é blob
   */
  isBlobUrl(url: string): boolean {
    return url.startsWith('blob:');
  }
}

export const storageService = new StorageService();
