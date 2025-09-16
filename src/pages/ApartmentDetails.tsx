import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  X,
  Play
} from 'lucide-react';
import { useApartments } from '../hooks/useApartments';
import WhatsAppButton from '../components/WhatsAppButton';

const ApartmentDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getApartmentBySlug } = useApartments();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    checkIn: '',
    checkOut: '',
    type: 'temporary' as 'fixed' | 'temporary' | 'both'
  });

  const apartment = getApartmentBySlug(slug || '');

  useEffect(() => {
    if (apartment) {
      setFormData(prev => ({ ...prev, type: apartment.type }));
    }
  }, [apartment]);

  if (!apartment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-32">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Apartamento não encontrado</h2>
          <Link to="/catalog" className="text-primary hover:text-primary/80 border border-primary rounded-md px-3 py-2 hover:bg-primary/5 transition-colors duration-200 inline-block cursor-pointer select-none" style={{ minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="pointer-events-none">Voltar ao catálogo</span>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const whatsappNumber = "5511912131333"; // Número de WhatsApp

    let message = `Olá! Tenho interesse no apartamento "${apartment.title}".\n\n`;
    message += `*Nome Completo*: ${formData.name}\n`;

    if (apartment.type === 'temporary' || apartment.type === 'both') {
      message += `*Tipo de Interesse*: Temporada\n`;
      if (formData.checkIn) {
        message += `*Check-in*: ${formData.checkIn}\n`;
      }
      if (formData.checkOut) {
        message += `*Check-out*: ${formData.checkOut}\n`;
      }
    } else {
      message += `*Tipo de Interesse*: Moradia Fixa\n`;
    }

    message += `\nPor favor, me confirme a disponibilidade.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    // Opcional: Limpar o formulário após o envio
    setFormData({
      name: '',
      checkIn: '',
      checkOut: '',
      type: 'temporary'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'amenities', label: 'Comodidades' },
    { id: 'location', label: 'Localização' }
  ];

  // Combina imagens e vídeo para o carrossel
  const mediaItems = [
    ...apartment.images.map((img, index) => ({ type: 'image', src: img, index })),
    ...(apartment.video ? [{ type: 'video', src: apartment.video, index: apartment.images.length }] : [])
  ];

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
    <div className="min-h-screen bg-gray-50 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
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
            {/* Image Gallery with Carousel */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
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
                {mediaItems.length > 1 && (
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
                {mediaItems.length > 1 && (
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

              {/* Thumbnail Strip */}
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {apartment.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                        selectedImage === index ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${apartment.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {apartment.video && (
                    <button
                      onClick={() => setSelectedImage(apartment.images.length)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 bg-black flex items-center justify-center ${
                        selectedImage === apartment.images.length ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <Play className="h-6 w-6 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Apartment Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                <div className="w-full sm:w-auto mb-4 sm:mb-0">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{apartment.title}</h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{apartment.location.address}</span>
                  </div>
                </div>
                <div className="w-full sm:w-auto text-right">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(apartment.price.monthly)}/mês
                  </div>
                  {apartment.type !== 'fixed' && (
                    <div className="text-gray-600">
                      {formatPrice(apartment.price.daily)}/dia
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-4 mb-6 sm:space-x-6">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{apartment.bedrooms} quartos</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{apartment.bathrooms} banheiros</span>
                </div>
                <div className="flex items-center">
                  <Square className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{apartment.size}m²</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex flex-wrap gap-x-4 sm:space-x-8">
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
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {apartment.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTab === 'location' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Localização e Pontos de Interesse</h3>
                    <div className="space-y-3">
                      {apartment.nearbyAttractions.map((attraction, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-900">{attraction.name}</span>
                            <span className="text-sm text-gray-500 ml-2">({attraction.type})</span>
                          </div>
                          <span className="text-primary font-medium">{attraction.distance}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-semibold mb-4">Solicitar Informações</h3>
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

                {/* Check-in e Check-out condicional */}
                {(apartment.type === 'temporary' || apartment.type === 'both') && (
                  <>
                    <div className="mb-4">
                      <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in (opcional)
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
                    <div className="mb-4">
                      <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out (opcional)
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
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-primary/90 transition-colors duration-300"
                >
                  Enviar informações no WhatsApp
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
      {isModalOpen && (
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