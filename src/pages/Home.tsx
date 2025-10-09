import React, { useState } from 'react';
import { MapPin, Shield, Star, Users, ShoppingCart, Dumbbell, Briefcase, WashingMachine, ChevronDown, Play, X } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { useFaqVideos } from '../hooks/useFaqVideos';
import { faqs } from '../data/faq';

const Home: React.FC = () => {
  const { activeVideos } = useFaqVideos();
  
  const features = [
    {
      icon: MapPin,
      title: 'Localização Privilegiada',
      description: 'No coração de São Paulo, próximo aos principais pontos turísticos e comerciais.',
    },
    {
      icon: Star,
      title: 'Alto Padrão',
      description: 'Apartamentos com acabamentos premium e móveis de qualidade.',
    },
    {
      icon: Users,
      title: 'Atendimento Personalizado',
      description: 'Equipe dedicada para atender suas necessidades com excelência.',
    },
  ];

  const amenities = [
    { icon: ShoppingCart, name: 'Mercado PEG&PAG' },
    { icon: Shield, name: 'Segurança' },
    { icon: Dumbbell, name: 'Espaço Fitness' },
    { icon: Briefcase, name: 'Coworking' },
    { icon: WashingMachine, name: 'Lavanderia' },
  ];

  // Função para encontrar vídeo de uma pergunta específica
  const getVideoForQuestion = (questionId: string) => {
    return activeVideos.find(video => video.faq_question_id === questionId);
  };

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState<string | null>(null);
  const [selectedCondominium, setSelectedCondominium] = useState<'museu' | 'fico'>('museu');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const openVideoModal = (videoUrl: string) => {
    setVideoModalOpen(videoUrl);
  };

  const closeVideoModal = () => {
    setVideoModalOpen(null);
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: 'url(/background/Home.jpeg)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#FFFDFA'
      }}
    >
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Overlay para cor e opacidade */}
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: '#e6e5df', opacity: 0.65 }}
        />
        <div className="relative z-10 text-center text-gray-900 max-w-6xl mx-auto px-4 pt-32">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-10 leading-tight text-gray-900">
            O maior complexo residencial de studios e kitnets do brasil
          </h1>
          <button
            onClick={scrollToContent}
            className="inline-flex flex-col items-center bg-[#074024] hover:bg-[#176c3a] text-[#FFFDFA] px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="mb-2">Conheça mais sobre o condomínio</span>
            <ChevronDown className="h-6 w-6 animate-bounce" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white bg-opacity-85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                More com conforto e praticidade no coração do Ipiranga!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
              O Condominio Casarão Ipiranga oferece Kitnets e Studios para moradia fixa e temporada (estadias de período mais encurtado).
              Perfeitos para quem busca praticidade, segurança e uma localização privilegiada. 
              Situado a poucos minutos do Museu do Ipiranga, nosso condominio proporciona fácil acesso a pontos turísticos, parques, transporte público, restaurantes, teatros e toda infraestrutura que São Paulo tem de melhor.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity, index) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-gray-700">{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Nossos Condomínios
                </h3>
                <p className="text-gray-600 mt-2">
                  Conheça nossas instalações e áreas comuns
                </p>
              </div>
              
              {/* Botões de Seleção de Condomínio */}
              <div className="flex justify-center mb-6">
                <div className="bg-white rounded-full p-1 shadow-md relative overflow-hidden">
                  {/* Indicador deslizante */}
                  <div
                    className="absolute top-0 left-0 h-full bg-primary/10 rounded-full transition-all duration-300 ease-in-out"
                    style={{
                      width: '50%',
                      transform: `translateX(${selectedCondominium === 'museu' ? '0%' : '100%'})`,
                      zIndex: 1
                    }}
                  />
                  <div className="flex space-x-1 relative z-10">
                    <button
                      onClick={() => setSelectedCondominium('museu')}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 relative ${
                        selectedCondominium === 'museu'
                          ? 'text-primary'
                          : 'text-gray-600 hover:text-primary'
                      }`}
                      style={{ zIndex: 2 }}
                    >
                      <span>Casarão Museu</span>
                    </button>
                    <button
                      onClick={() => setSelectedCondominium('fico')}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 relative ${
                        selectedCondominium === 'fico'
                          ? 'text-primary'
                          : 'text-gray-600 hover:text-primary'
                      }`}
                      style={{ zIndex: 2 }}
                    >
                      <span>Casarão Fico</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Título e Descrição do Condomínio Selecionado */}
              <div className="text-center mb-4">
                <h4 className="text-xl font-semibold text-gray-900">
                  {selectedCondominium === 'museu' ? 'Casarão Museu' : 'Casarão Fico'}
                </h4>
                <p className="text-gray-600">
                  {selectedCondominium === 'museu' 
                    ? 'Localizado próximo ao Museu do Ipiranga'
                    : 'Nossa segunda unidade no bairro do Ipiranga'
                  }
                </p>
              </div>
              
              {/* Carrossel Único */}
              <ImageCarousel condominium={selectedCondominium} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 bg-opacity-85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o Casarão Ipiranga?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Oferecemos muito mais que apenas um lugar para ficar. 
              Descubra os diferenciais que fazem do nosso condomínio a escolha ideal.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white bg-opacity-85">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-gray-600">
              Tire suas dúvidas sobre nossos apartamentos e serviços
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center text-left mb-4"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {openFaqIndex === index && (
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                    
                    {/* Preview do Vídeo */}
                    {(() => {
                      const video = getVideoForQuestion(faq.id);
                      const videoSrc = video?.video_url || video?.video_file_path;
                      const isYouTube = video?.video_url && video.video_url.includes('youtube.com/embed/');
                      
                      return videoSrc ? (
                        <div className="bg-gray-100 rounded-lg overflow-hidden">
                          <div 
                            className="relative aspect-video bg-gray-200 cursor-pointer group hover:bg-gray-300 transition-colors"
                            onClick={() => openVideoModal(videoSrc)}
                          >
                            {isYouTube ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={video?.thumbnail_url || `https://img.youtube.com/vi/${videoSrc.split('/embed/')[1]}/maxresdefault.jpg`}
                                  alt="Video thumbnail"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="bg-black bg-opacity-60 rounded-full p-4 group-hover:bg-opacity-80 transition-all">
                                    <Play className="h-8 w-8 text-white" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <video
                                src={videoSrc}
                                className="w-full h-full object-cover"
                                poster={video?.thumbnail_url || undefined}
                                muted
                                preload="metadata"
                              />
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                              <p className="text-white text-sm font-medium">
                                Clique para assistir a explicação em vídeo
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Modal de Vídeo */}
      {videoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            {videoModalOpen.includes('youtube.com/embed/') ? (
              <iframe
                src={videoModalOpen}
                className="w-full h-auto max-h-[80vh] aspect-video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={videoModalOpen}
                controls
                autoPlay
                className="w-full h-auto max-h-[80vh]"
                onError={() => {
                  console.error('Erro ao carregar vídeo:', videoModalOpen);
                }}
              >
                Seu navegador não suporta a reprodução de vídeos.
              </video>
            )}
          </div>
        </div>
      )}
      
      <ScrollToTopButton />
    </div>
  );
};

export default Home;
