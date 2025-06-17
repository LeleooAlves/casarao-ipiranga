import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Wifi, 
  Car, 
  Shield, 
  Star,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { apartments } from '../data/apartments';
import { reviews } from '../data/reviews';
import WhatsAppButton from '../components/WhatsAppButton';

const ApartmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    message: '',
    type: 'temporary' as 'fixed' | 'temporary'
  });

  const apartment = apartments.find(apt => apt.id === id);
  const apartmentReviews = reviews.filter(review => review.apartmentId === id);

  if (!apartment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-32">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Apartamento não encontrado</h2>
          <Link to="/catalog" className="text-primary hover:text-primary/80">
            Voltar ao catálogo
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
    // Here you would typically send the form data to your backend
    alert('Solicitação enviada! Entraremos em contato em breve.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      checkIn: '',
      checkOut: '',
      message: '',
      type: 'temporary'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'amenities', label: 'Comodidades' },
    { id: 'location', label: 'Localização' },
    { id: 'reviews', label: 'Avaliações' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link 
          to="/catalog" 
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative">
                <img
                  src={apartment.images[selectedImage]}
                  alt={apartment.title}
                  className="w-full h-96 object-cover"
                />
                {apartment.video && selectedImage === apartment.images.length && (
                  <video
                    controls
                    className="w-full h-96 object-cover"
                    poster={apartment.images[0]}
                  >
                    <source src={apartment.video} type="video/mp4" />
                  </video>
                )}
              </div>
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
                      <span className="text-white text-xs">Video</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Apartment Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{apartment.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{apartment.location.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(apartment.price.monthly)}/mês
                  </div>
                  <div className="text-gray-600">
                    {formatPrice(apartment.price.daily)}/dia
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 mb-6">
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
                <nav className="flex space-x-8">
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

                {selectedTab === 'reviews' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Avaliações ({apartmentReviews.length})
                    </h3>
                    {apartmentReviews.length > 0 ? (
                      <div className="space-y-4">
                        {apartmentReviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{review.name}</span>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">Ainda não há avaliações para este apartamento.</p>
                    )}
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

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Interesse
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="temporary">Temporada</option>
                    <option value="fixed">Moradia Fixa</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {formData.type === 'temporary' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in
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
                  </div>
                )}

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem (opcional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Conte-nos mais sobre suas necessidades..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors duration-200 font-medium"
                >
                  Enviar Solicitação
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
    </div>
  );
};

export default ApartmentDetails;