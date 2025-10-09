import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight, X, Phone, Mail } from 'lucide-react';
import { useApartments } from '../hooks/useApartments';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useUserInterests } from '../hooks/useUserInterests';
import WhatsAppButton from '../components/WhatsAppButton';

const ApartmentDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getApartmentBySlug } = useApartments();
  const { recordView, recordMessage } = useDashboardStats();
  const { addInterest } = useUserInterests();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [formData, setFormData] = useState<{
    name: string;
    whatsapp: string;
    checkIn: string;
    checkOut: string;
    type: 'fixed' | 'temporary' | 'both' | 'experience';
  }>({
    name: '',
    whatsapp: '',
    checkIn: '',
    checkOut: '',
    type: 'temporary'
  });

  const apartment = getApartmentBySlug(slug || '');

  // Função para formatar WhatsApp
  const formatWhatsApp = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    const limited = numbers.slice(0, 11);
    
    // Aplica a formatação: DDD 00000.0000
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 7) {
      return `${limited.slice(0, 2)} ${limited.slice(2)}`;
    } else {
      return `${limited.slice(0, 2)} ${limited.slice(2, 7)}.${limited.slice(7)}`;
    }
  };

  // Função para validar WhatsApp
  const isValidWhatsApp = (whatsapp: string) => {
    const numbers = whatsapp.replace(/\D/g, '');
    return numbers.length === 11; // DDD (2) + número (9)
  };

  useEffect(() => {
    if (apartment) {
      setFormData(prev => ({ ...prev, type: apartment.type }));
    }
  }, [apartment]);

  useEffect(() => {
    if (apartment) {
      recordView(apartment.id, apartment.title, apartment.slug);
    }
  }, [apartment?.id]); // Apenas quando o ID do apartamento muda

  if (!apartment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Apartamento não encontrado</h1>
          <Link to="/catalog" className="text-primary hover:underline">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar WhatsApp
    if (!isValidWhatsApp(formData.whatsapp)) {
      alert('Por favor, insira um número de WhatsApp válido no formato: DDD 00000.0000');
      return;
    }

    const whatsappNumber = "5511912131333"; // Número de WhatsApp

    let message = apartment.available 
      ? `Olá! Tenho interesse no apartamento "${apartment.title}".\n\n`
      : `Olá! Gostaria de demonstrar interesse no apartamento "${apartment.title}" que está atualmente alugado.\n\n`;
    
    message += `*Nome Completo*: ${formData.name}\n`;
    message += `*WhatsApp*: +55 ${formData.whatsapp}\n`;

    if (apartment.type === 'temporary' || apartment.type === 'both') {
      message += `*Tipo de Interesse*: Temporada\n`;
      if (formData.checkIn) {
        message += `*Check-in*: ${formData.checkIn}\n`;
      }
      if (formData.checkOut) {
        message += `*Check-out*: ${formData.checkOut}\n`;
      }
    } else if (apartment.type === 'experience') {
      message += `*Tipo de Interesse*: Experiência Única\n`;
      if (formData.checkIn) {
        message += `*Data da Experiência*: ${formData.checkIn}\n`;
      }
    } else {
      message += `*Tipo de Interesse*: Moradia Fixa\n`;
    }

    if (apartment.available) {
      message += `\nPor favor, me confirme a disponibilidade.`;
    } else {
      message += `\nGostaria de ser notificado quando este apartamento estiver disponível novamente ou se houver apartamentos similares disponíveis.`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Registrar mensagem enviada
    await recordMessage(
      apartment.id,
      apartment.title,
      apartment.slug,
      formData.name,
      message,
      undefined, // email
      undefined, // phone
      apartment.available ? 'inquiry' : 'interest'
    );

    // Registrar interesse do usuário
    await addInterest(
      apartment.id,
      formData.name,
      formData.whatsapp,
      apartment.title,
      apartment.available
    );

    window.open(whatsappUrl, '_blank');

    // Opcional: Limpar o formulário após o envio
    setFormData({
      name: '',
      whatsapp: '',
      checkIn: '',
      checkOut: '',
      type: 'temporary' as 'fixed' | 'temporary' | 'both' | 'experience'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'amenities', label: 'Comodidades' },
    { id: 'location', label: 'Localização' }
  ];

  // Combina imagens e vídeo para o carrossel (apenas se apartamento estiver disponível)
  const mediaItems = apartment.available ? [
    ...apartment.images.map((img, index) => ({ type: 'image', src: img, index })),
    ...(apartment.video ? [{ type: 'video', src: apartment.video, index: apartment.images.length }] : [])
  ] : [];

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextMedia = () => {
    setModalImageIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevMedia = () => {
    setModalImageIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const nextCarousel = () => {
    setSelectedImage((prev) => (prev + 1) % mediaItems.length);
  };

  const prevCarousel = () => {
    setSelectedImage((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/catalog"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6 border border-primary rounded-md px-3 py-2 hover:bg-primary/5 transition-colors duration-200 cursor-pointer select-none"
          style={{ minHeight: '40px', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft className="h-4 w-4 mr-2 pointer-events-none" />
          <span className="pointer-events-none">Voltar ao catálogo</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery with Carousel ou Informações do Apartamento Alugado */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              {apartment.available && mediaItems.length > 0 ? (
                <div className="relative h-96 group">
                  {/* Main Media Display */}
                  <div 
                    className="w-full h-full cursor-pointer"
                    onClick={() => openModal(selectedImage)}
                  >
                    {mediaItems[selectedImage]?.type === 'video' ? (
                      <video
                        controls
                        className="w-full h-full object-cover"
                        poster={apartment.images[0]}
                      >
                        <source src={mediaItems[selectedImage].src} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        src={mediaItems[selectedImage]?.src}
                        alt={apartment.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Navigation Arrows */}
                  {apartment.available && mediaItems.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevCarousel();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextCarousel();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}

                  {/* Indicators */}
                  {apartment.available && mediaItems.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {mediaItems.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(index);
                          }}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            selectedImage === index ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-6xl text-gray-400 mb-4">
                      {apartment.type === 'experience' ? '⭐' : '🏠'}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {apartment.title}
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-center justify-center">
                        <span className="font-medium">Localização:</span>
                        <span className="ml-2">{apartment.location.address}</span>
                      </p>
                      <p className="flex items-center justify-center">
                        <span className="font-medium">Tamanho:</span>
                        <span className="ml-2">{apartment.size}m²</span>
                      </p>
                      <p className="flex items-center justify-center">
                        <span className="font-medium">Quartos:</span>
                        <span className="ml-2">{apartment.bedrooms}</span>
                      </p>
                      <p className="flex items-center justify-center">
                        <span className="font-medium">Banheiros:</span>
                        <span className="ml-2">{apartment.bathrooms}</span>
                      </p>
                    </div>
                    {!apartment.available && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 font-medium">Apartamento Alugado</p>
                        <p className="text-red-600 text-sm">Imagens não disponíveis</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Apartment Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{apartment.title}</h1>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  apartment.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {apartment.available ? 'Disponível' : 'Alugado'}
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{apartment.location.address}</span>
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">{apartment.bedrooms} quartos</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">{apartment.bathrooms} banheiros</span>
                </div>
                <div className="flex items-center">
                  <Square className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-700">{apartment.size}m²</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-2xl font-bold text-primary mb-2">
                  Valores a consultar
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        selectedTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div>
                {selectedTab === 'overview' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Descrição</h3>
                    <p className="text-gray-700 leading-relaxed">{apartment.description}</p>
                  </div>
                )}

                {selectedTab === 'amenities' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Comodidades</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {apartment.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTab === 'location' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Localização e Atrações Próximas</h3>
                    <div className="mb-4">
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>{apartment.location.address}</span>
                      </div>
                    </div>
                    
                    {apartment.nearbyAttractions && apartment.nearbyAttractions.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Atrações Próximas</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {apartment.nearbyAttractions.map((attraction, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              <span className="text-gray-700">{attraction.name} - {attraction.distance}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              {!apartment.available && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-red-800">
                        Apartamento Alugado
                      </h4>
                      <p className="text-sm text-red-700 mt-1">
                        Este apartamento está atualmente alugado, mas você pode demonstrar interesse para futuras disponibilidades.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <h3 className="text-xl font-semibold mb-4">
                {apartment.available ? 'Solicitar Informações' : 'Demonstrar Interesse'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp (DDD 00000.0000)
                  </label>
                  <input
                    type="text"
                    id="whatsapp"
                    name="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => {
                      const formatted = formatWhatsApp(e.target.value);
                      setFormData({ ...formData, whatsapp: formatted });
                    }}
                    placeholder="11 99999.9999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {(apartment.type === 'temporary' || apartment.type === 'both' || apartment.type === 'experience') && (
                  <>
                    <div>
                      <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
                        {apartment.type === 'experience' ? 'Data da Experiência' : 'Check-in'}
                      </label>
                      <input
                        type="date"
                        id="checkIn"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    {apartment.type !== 'experience' && (
                      <div>
                        <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
                          Check-out
                        </label>
                        <input
                          type="date"
                          id="checkOut"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-md font-semibold transition-colors duration-300 ${
                    apartment.available 
                      ? 'bg-primary text-white hover:bg-primary/90' 
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {apartment.available 
                    ? 'Enviar informações no WhatsApp' 
                    : 'Demonstrar interesse no WhatsApp'
                  }
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-gray-700">(11) 91213-1333</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-gray-700">contato@casaraoipiranga.com.br</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* WhatsApp Button with apartment info */}
      <WhatsAppButton 
        apartmentTitle={apartment.title}
        apartmentType={formData.type}
        customerName={formData.name}
      />

      {/* Modal de Visualização em Tela Cheia */}
      {isModalOpen && apartment.available && mediaItems.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Botão Fechar */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Navegação Anterior */}
            {mediaItems.length > 1 && (
              <button
                onClick={prevMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
              >
                <ChevronLeft className="h-12 w-12" />
              </button>
            )}

            {/* Conteúdo do Modal */}
            <div className="max-w-7xl max-h-full flex items-center justify-center p-4">
              {mediaItems[modalImageIndex]?.type === 'video' ? (
                <video
                  controls
                  autoPlay
                  className="max-w-full max-h-full object-contain"
                  poster={apartment.images[0]}
                >
                  <source src={mediaItems[modalImageIndex].src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={mediaItems[modalImageIndex]?.src}
                  alt={apartment.title}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* Navegação Próxima */}
            {mediaItems.length > 1 && (
              <button
                onClick={nextMedia}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
              >
                <ChevronRight className="h-12 w-12" />
              </button>
            )}

            {/* Indicadores do Modal */}
            {mediaItems.length > 1 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
                {mediaItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setModalImageIndex(index)}
                    className={`w-4 h-4 rounded-full transition-colors ${
                      modalImageIndex === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Contador */}
            <div className="absolute bottom-4 right-4 text-white text-sm bg-black/50 px-3 py-1 rounded">
              {modalImageIndex + 1} / {mediaItems.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentDetails;
