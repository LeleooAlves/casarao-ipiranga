import React, { useState } from 'react';
import { useApartments } from '../hooks/useApartments';
import { useFileUpload } from '../hooks/useFileUpload';
import { Plus, Trash2, X, Home, Calendar, Upload, Save } from 'lucide-react';
import AdminHeader from '../components/AdminHeader';
import MigrationButton from '../components/MigrationButton';

const Admin: React.FC = () => {
  const { apartments, addApartment, deleteApartment, clearAllApartments, isLoading } = useApartments();
  const { uploadProgress, convertAndUploadImages, convertAndUploadVideo } = useFileUpload();
  const [activeTab, setActiveTab] = useState<'add' | 'list'>('list');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  const [newApartment, setNewApartment] = useState({
    title: '',
    description: '',
    type: 'temporary' as 'fixed' | 'temporary' | 'both',
    price: {
      monthly: '',
      daily: ''
    },
    size: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [] as string[],
    location: {
      address: 'casarao-museu' as 'casarao-museu' | 'casarao-fico',
      lat: 0,
      lng: 0
    },
    nearbyAttractions: [] as Array<{name: string, distance: string, type: string}>,
    images: [] as File[],
    video: null as File | null
  });

  const [amenityInput, setAmenityInput] = useState('');
  const [attractionInput, setAttractionInput] = useState({
    name: '',
    distance: '',
    type: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewApartment(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value
        }
      }));
    } else {
      setNewApartment(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewApartment(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewApartment(prev => ({
        ...prev,
        video: e.target.files![0]
      }));
    }
  };

  const removeImage = (index: number) => {
    setNewApartment(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setNewApartment(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const removeAmenity = (index: number) => {
    setNewApartment(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const addAttraction = () => {
    if (attractionInput.name && attractionInput.distance && attractionInput.type) {
      setNewApartment(prev => ({
        ...prev,
        nearbyAttractions: [...prev.nearbyAttractions, attractionInput]
      }));
      setAttractionInput({ name: '', distance: '', type: '' });
    }
  };

  const removeAttraction = (index: number) => {
    setNewApartment(prev => ({
      ...prev,
      nearbyAttractions: prev.nearbyAttractions.filter((_, i) => i !== index)
    }));
  };

  const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular dimensões mantendo proporção
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Desenhar imagem redimensionada
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Converter para base64 com compressão
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Upload das imagens para o Supabase Storage
      let imageUrls: string[] = [];
      if (newApartment.images.length > 0) {
        // Primeiro converte para base64 comprimido (fallback)
        const compressedImages = await Promise.all(
          newApartment.images.map((file) => compressImage(file, 800, 0.7))
        );
        
        // Tenta fazer upload para o Supabase Storage
        const uploadedUrls = await convertAndUploadImages(compressedImages);
        imageUrls = uploadedUrls.length > 0 ? uploadedUrls : compressedImages;
      }
      
      // Upload do vídeo para o Supabase Storage
      let videoUrl: string | undefined;
      if (newApartment.video) {
        const uploadedVideoUrl = await convertAndUploadVideo(URL.createObjectURL(newApartment.video));
        videoUrl = uploadedVideoUrl || URL.createObjectURL(newApartment.video);
      }
      
      const apartmentData = {
        title: newApartment.title,
        description: newApartment.description,
        type: newApartment.type,
        price: {
          monthly: parseFloat(newApartment.price.monthly) || 0,
          daily: newApartment.type !== 'fixed' ? (parseFloat(newApartment.price.daily) || 0) : 0
        },
        size: parseInt(newApartment.size) || 0,
        bedrooms: parseInt(newApartment.bedrooms) || 1,
        bathrooms: parseInt(newApartment.bathrooms) || 1,
        amenities: newApartment.amenities,
        nearbyAttractions: newApartment.nearbyAttractions,
        location: {
          address: newApartment.location.address === 'casarao-museu' ? 'Casarão Museu' : 'Casarão Fico',
          lat: newApartment.location.address === 'casarao-museu' ? -23.5505 : -23.5515,
          lng: newApartment.location.address === 'casarao-museu' ? -46.6333 : -46.6343
        },
        images: imageUrls,
        video: videoUrl,
        available: true
      };
      
      try {
        await addApartment(apartmentData);
        
        // Modal de sucesso melhorado
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
          <div class="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
            <div class="text-green-600 text-4xl mb-4">✓</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Sucesso!</h3>
            <p class="text-gray-600 mb-4">Apartamento adicionado com sucesso!</p>
            <button onclick="this.closest('.fixed').remove()" class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
              OK
            </button>
          </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => {
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
        }, 3000);
        
        setActiveTab('list');
        resetForm();
      } catch (storageError) {
        // Erro já tratado no useApartments
        return;
      }
    } catch (error) {
      console.error('Erro ao adicionar apartamento:', error);
      alert('Erro ao adicionar apartamento. Tente novamente.');
    }
  };

  const resetForm = () => {
    setNewApartment({
      title: '',
      description: '',
      type: 'temporary',
      price: { monthly: '', daily: '' },
      size: '',
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      location: { address: 'casarao-museu', lat: 0, lng: 0 },
      nearbyAttractions: [],
      images: [],
      video: null
    });
    setAmenityInput('');
    setAttractionInput({ name: '', distance: '', type: '' });
  };

  const handleDeleteApartment = (apartmentId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Excluir Apartamento',
      message: 'Tem certeza que deseja excluir este apartamento?',
      onConfirm: async () => {
        await deleteApartment(apartmentId);
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
        
        // Modal de sucesso
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
          <div class="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
            <div class="text-green-600 text-4xl mb-4">✓</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Sucesso!</h3>
            <p class="text-gray-600 mb-4">Apartamento excluído com sucesso!</p>
            <button onclick="this.closest('.fixed').remove()" class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
              OK
            </button>
          </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => {
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
        }, 3000);
      }
    });
  };

  const handleClearAllApartments = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Limpar Todos os Apartamentos',
      message: 'Tem certeza que deseja excluir TODOS os apartamentos? Esta ação não pode ser desfeita.',
      onConfirm: async () => {
        await clearAllApartments();
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {} });
        
        // Modal de sucesso
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
          <div class="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
            <div class="text-green-600 text-4xl mb-4">✓</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Sucesso!</h3>
            <p class="text-gray-600 mb-4">Todos os apartamentos foram removidos!</p>
            <button onclick="this.closest('.fixed').remove()" class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
              OK
            </button>
          </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => {
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
        }, 3000);
      }
    });
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/background/Home.jpeg)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#FFFDFA'
      }}
    >
      {/* Overlay para cor e opacidade */}
      <div 
        className="fixed inset-0 z-0"
        style={{ backgroundColor: '#e6e5df', opacity: 0.65 }}
      />
      <AdminHeader />
      <div className="relative z-10 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16"></div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('list')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'list'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Lista de Apartamentos ({apartments.length})
                </button>
                <button
                  onClick={() => setActiveTab('add')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'add'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Adicionar Apartamento
                </button>
              </nav>
            </div>

            <div className="bg-white rounded-b-lg shadow-xl p-8">
            {activeTab === 'list' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-900">Apartamentos Cadastrados</h2>
                    <MigrationButton />
                  </div>
                  {apartments.length > 0 && (
                    <button
                      onClick={handleClearAllApartments}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Limpar Todos
                    </button>
                  )}
                </div>
                
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando apartamentos...</p>
                  </div>
                ) : apartments.length === 0 ? (
                  <div className="text-center py-12">
                    <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum apartamento cadastrado</h3>
                    <p className="text-gray-500 mb-4">Comece adicionando seu primeiro apartamento.</p>
                    <button
                      onClick={() => setActiveTab('add')}
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Primeiro Apartamento
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Moradia Fixa */}
                    {apartments.filter(apt => apt.type === 'fixed' || apt.type === 'both').length > 0 && (
                      <div>
                        <div className="flex items-center mb-4">
                          <Home className="h-5 w-5 text-primary mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            Moradia Fixa ({apartments.filter(apt => apt.type === 'fixed' || apt.type === 'both').length})
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          {apartments
                            .filter(apt => apt.type === 'fixed' || apt.type === 'both')
                            .map((apartment) => (
                              <div key={apartment.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                <div className="aspect-video bg-gray-200 relative">
                                  {apartment.images && apartment.images.length > 0 ? (
                                    <img
                                      src={apartment.images[0]}
                                      alt={apartment.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Home className="h-12 w-12 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      apartment.available 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {apartment.available ? 'Disponível' : 'Indisponível'}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="p-4">
                                  <h3 className="font-semibold text-gray-900 mb-2">{apartment.title}</h3>
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{apartment.description}</p>
                                  
                                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                    <span className="capitalize">{apartment.type === 'fixed' ? 'Moradia Fixa' : apartment.type === 'temporary' ? 'Temporada' : 'Ambos'}</span>
                                    <span>{apartment.size}m² • {apartment.bedrooms} quartos</span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm">
                                      {apartment.type !== 'temporary' && (
                                        <div className="text-gray-900 font-medium">
                                          R$ {apartment.price.monthly.toLocaleString()}/mês
                                        </div>
                                      )}
                                      {apartment.type !== 'fixed' && (
                                        <div className="text-gray-600">
                                          R$ {apartment.price.daily}/dia
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => handleDeleteApartment(apartment.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Excluir apartamento"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Temporada */}
                    {apartments.filter(apt => apt.type === 'temporary' || apt.type === 'both').length > 0 && (
                      <div>
                        <div className="flex items-center mb-4">
                          <Calendar className="h-5 w-5 text-primary mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            Temporada ({apartments.filter(apt => apt.type === 'temporary' || apt.type === 'both').length})
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                          {apartments
                            .filter(apt => apt.type === 'temporary' || apt.type === 'both')
                            .map((apartment) => (
                              <div key={apartment.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                <div className="aspect-video bg-gray-200 relative">
                                  {apartment.images && apartment.images.length > 0 ? (
                                    <img
                                      src={apartment.images[0]}
                                      alt={apartment.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Home className="h-12 w-12 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                      apartment.available 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {apartment.available ? 'Disponível' : 'Indisponível'}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="p-4">
                                  <h3 className="font-semibold text-gray-900 mb-2">{apartment.title}</h3>
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{apartment.description}</p>
                                  
                                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                    <span className="capitalize">{apartment.type === 'fixed' ? 'Moradia Fixa' : apartment.type === 'temporary' ? 'Temporada' : 'Ambos'}</span>
                                    <span>{apartment.size}m² • {apartment.bedrooms} quartos</span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm">
                                      {apartment.type !== 'temporary' && (
                                        <div className="text-gray-900 font-medium">
                                          R$ {apartment.price.monthly.toLocaleString()}/mês
                                        </div>
                                      )}
                                      {apartment.type !== 'fixed' && (
                                        <div className="text-gray-600">
                                          R$ {apartment.price.daily}/dia
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => handleDeleteApartment(apartment.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Excluir apartamento"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'add' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Adicionar Novo Apartamento</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Informações Básicas */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título do Apartamento
                      </label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={newApartment.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                        placeholder="Ex: Apartamento Cozy no Centro"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Moradia
                        </label>
                        <select
                          name="type"
                          value={newApartment.type}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                        >
                          <option value="temporary">Temporada</option>
                          <option value="fixed">Moradia Fixa</option>
                          <option value="both">Ambos</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Localização
                        </label>
                        <select
                          name="location.address"
                          required
                          value={newApartment.location.address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                        >
                          <option value="casarao-museu">Casarão Museu</option>
                          <option value="casarao-fico">Casarão Fico</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                      </label>
                      <textarea
                        name="description"
                        required
                        rows={4}
                        value={newApartment.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base resize-none"
                        placeholder="Descreva o apartamento..."
                      />
                    </div>
                  </div>

                  {/* Preços */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Preços</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preço Mensal (R$)
                        </label>
                        <input
                          type="number"
                          name="price.monthly"
                          required
                          value={newApartment.price.monthly}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                          placeholder="0"
                        />
                      </div>

                      {newApartment.type !== 'fixed' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preço Diário (R$)
                          </label>
                          <input
                            type="number"
                            name="price.daily"
                            required
                            value={newApartment.price.daily}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                            placeholder="0"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Características */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Características</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tamanho (m²)
                        </label>
                        <input
                          type="number"
                          name="size"
                          required
                          value={newApartment.size}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quartos
                        </label>
                        <input
                          type="number"
                          name="bedrooms"
                          required
                          min="1"
                          value={newApartment.bedrooms}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                          placeholder="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Banheiros
                        </label>
                        <input
                          type="number"
                          name="bathrooms"
                          required
                          min="1"
                          value={newApartment.bathrooms}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                          placeholder="1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Comodidades */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Comodidades</h3>
                    <div className="flex flex-col sm:flex-row gap-2 mb-2">
                      <input
                        type="text"
                        value={amenityInput}
                        onChange={(e) => setAmenityInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                        placeholder="Ex: Wi-Fi, Ar condicionado..."
                      />
                      <button
                        type="button"
                        onClick={addAmenity}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 whitespace-nowrap"
                      >
                        Adicionar
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newApartment.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {amenity}
                          <button
                            type="button"
                            onClick={() => removeAmenity(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pontos de Interesse */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Pontos de Interesse Próximos</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={attractionInput.name}
                          onChange={(e) => setAttractionInput(prev => ({ ...prev, name: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                          placeholder="Nome do local"
                        />
                        <input
                          type="text"
                          value={attractionInput.distance}
                          onChange={(e) => setAttractionInput(prev => ({ ...prev, distance: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                          placeholder="Ex: 500m"
                        />
                        <input
                          type="text"
                          value={attractionInput.type}
                          onChange={(e) => setAttractionInput(prev => ({ ...prev, type: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                          placeholder="Ex: Mercado"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addAttraction}
                        className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                      >
                        Adicionar Ponto de Interesse
                      </button>
                    </div>
                    <div className="space-y-2">
                      {newApartment.nearbyAttractions.map((attraction, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-sm">
                            <strong>{attraction.name}</strong> - {attraction.distance} ({attraction.type})
                          </span>
                          <button
                            type="button"
                            onClick={() => removeAttraction(index)}
                            className="text-red-500 hover:text-red-700 self-end sm:self-center"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upload de Imagens */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Imagens do Apartamento</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="images"
                      />
                      <label
                        htmlFor="images"
                        className="cursor-pointer text-primary hover:text-primary/80 text-base"
                      >
                        Clique para selecionar imagens
                      </label>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG até 10MB cada</p>
                    </div>
                    
                    {newApartment.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {newApartment.images.map((file, index) => {
                          const imageUrl = URL.createObjectURL(file);
                          return (
                            <div key={index} className="relative">
                              <img
                                src={imageUrl}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-md"
                                onLoad={() => URL.revokeObjectURL(imageUrl)}
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Upload de Vídeo */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Vídeo do Apartamento (Opcional)</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                        id="video"
                      />
                      <label
                        htmlFor="video"
                        className="cursor-pointer text-primary hover:text-primary/80 text-base"
                      >
                        Clique para selecionar vídeo
                      </label>
                      <p className="text-sm text-gray-500 mt-1">MP4, MOV até 200MB</p>
                    </div>
                    
                    {newApartment.video && (
                      <div className="mt-4">
                        <div className="bg-gray-50 p-3 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-sm font-medium break-all">{newApartment.video.name}</span>
                          <button
                            type="button"
                            onClick={() => setNewApartment(prev => ({ ...prev, video: null }))}
                            className="text-red-500 hover:text-red-700 self-end sm:self-center"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botões */}
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('list');
                        resetForm();
                      }}
                      className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-base"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={uploadProgress.isUploading}
                      className="w-full sm:w-auto px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center justify-center text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadProgress.isUploading ? (
                        <>
                          <Upload className="h-4 w-4 mr-2 animate-spin" />
                          Fazendo upload...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Salvar Apartamento
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{confirmModal.title}</h3>
              <button
                onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">{confirmModal.message}</p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
