import React, { useState } from 'react';
import { useFaqVideos } from '../hooks/useFaqVideos';
import { faqs } from '../data/faq';
import { Play, ChevronDown, ChevronUp } from 'lucide-react';

const FAQ: React.FC = () => {
  const { activeVideos, isLoading } = useFaqVideos();
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const toggleVideo = (videoId: string) => {
    if (expandedVideo === videoId) {
      setExpandedVideo(null);
      setPlayingVideo(null);
    } else {
      setExpandedVideo(videoId);
    }
  };

  const handlePlayVideo = (videoId: string) => {
    setPlayingVideo(videoId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perguntas frequentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Perguntas Frequentes
          </h1>
          <p className="text-gray-600 text-center">
            Encontre respostas para as dúvidas mais comuns sobre nossos apartamentos
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {activeVideos.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Nenhum vídeo disponível
              </h3>
              <p className="text-gray-500">
                Os vídeos de perguntas frequentes estarão disponíveis em breve.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeVideos.map((video, index) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleVideo(video.id)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="bg-primary text-white text-sm font-medium px-3 py-1 rounded-full">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {faqs.find(f => f.id === video.faq_question_id)?.question || video.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Play className="h-5 w-5 text-primary" />
                      {expandedVideo === video.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                  {video.description && (
                    <p className="text-gray-600 mt-2 text-sm">
                      {video.description}
                    </p>
                  )}
                </button>

                {/* Video Content */}
                {expandedVideo === video.id && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-200 pt-4">
                      <div className="relative">
                        {playingVideo === video.id ? (
                          <video
                            src={video.video_url ?? video.video_file_path ?? undefined}
                            controls
                            autoPlay
                            className="w-full rounded-lg shadow-sm"
                            poster={video.thumbnail_url ?? undefined}
                            onLoadStart={() => console.log('Video loading started')}
                            onError={(e) => console.error('Video error:', e)}
                          >
                            Seu navegador não suporta o elemento de vídeo.
                          </video>
                        ) : (
                          <div className="relative">
                            <div
                              className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                              onClick={() => handlePlayVideo(video.id)}
                              style={{
                                backgroundImage: video.thumbnail_url ? `url(${video.thumbnail_url})` : undefined,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                              }}
                            >
                              <div className="bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-70 transition-all">
                                <Play className="h-12 w-12 text-white fill-current" />
                              </div>
                            </div>
                            <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
                              Clique para reproduzir
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ainda tem dúvidas?
            </h3>
            <p className="text-gray-600 mb-4">
              Entre em contato conosco através do WhatsApp para mais informações
            </p>
            <a
              href="https://wa.me/5511912131333?text=Olá! Tenho uma dúvida sobre os apartamentos."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
