import React, { useState } from 'react';
import { useApartments } from '../hooks/useApartments';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useUserInterests } from '../hooks/useUserInterests';
import { useFileUpload } from '../hooks/useFileUpload';
import { useFaqVideos } from '../hooks/useFaqVideos';
import { faqs } from '../data/faq';
import { Plus, Trash2, X, Home, Calendar, Edit, ToggleLeft, ToggleRight, BarChart3, List, MessageCircle, Eye, Star, LogOut } from 'lucide-react';

const Admin: React.FC = () => {
  const { apartments, addApartment, updateApartment, deleteApartment, clearAllApartments, isLoading } = useApartments();
  const { stats: dashboardStats, apartmentAnalytics, refreshStats } = useDashboardStats();
  const { getInterestsCount, getApartmentsWithInterests } = useUserInterests();
  const { uploadImages, uploadVideo } = useFileUpload();
  const { videos: faqVideos, addVideo: addFaqVideo, updateVideo: updateFaqVideo, deleteVideo: deleteFaqVideo, toggleVideoStatus } = useFaqVideos();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'edit' | 'faq'>('dashboard');
  const [apartmentSubTab, setApartmentSubTab] = useState<'fixed' | 'temporary' | 'experience'>('fixed');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingApartment, setEditingApartment] = useState<string | null>(null);
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
  
  const [interestModal, setInterestModal] = useState<{
    isOpen: boolean;
    apartmentTitle: string;
    interests: any[];
  }>({
    isOpen: false,
    apartmentTitle: '',
    interests: []
  });

  const [addApartmentModal, setAddApartmentModal] = useState(false);
  
  // Estados para o formulário de adicionar apartamento
  const [apartmentForm, setApartmentForm] = useState({
    title: '',
    type: 'fixed' as 'fixed' | 'temporary' | 'both' | 'experience',
    description: '',
    size: '',
    bedrooms: '',
    bathrooms: '',
    condominium: '' as 'casarao-museu' | 'casarao-fico' | '',
    amenities: [] as string[],
    nearbyAttractions: '',
    monthlyPrice: ''
  });
  
  const [apartmentImages, setApartmentImages] = useState<File[]>([]);
  const [apartmentVideo, setApartmentVideo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para popup personalizado
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Estados para o formulário de editar apartamento
  const [editForm, setEditForm] = useState({
    title: '',
    type: 'fixed' as 'fixed' | 'temporary' | 'both' | 'experience',
    description: '',
    size: '',
    bedrooms: '',
    bathrooms: '',
    condominium: '' as 'casarao-museu' | 'casarao-fico' | '',
    amenities: [] as string[],
    nearbyAttractions: '',
    available: true,
    monthlyPrice: ''
  });
  
  const [editImages, setEditImages] = useState<File[]>([]);
  const [editVideo, setEditVideo] = useState<File | null>(null);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  // Estados para FAQ Videos
  const [faqVideoModal, setFaqVideoModal] = useState(false);
  const [editingFaqVideo, setEditingFaqVideo] = useState<string | null>(null);
  const [videoPreviewLoading, setVideoPreviewLoading] = useState(false);
  const [videoPreviewError, setVideoPreviewError] = useState<string | null>(null);
  const [faqVideoForm, setFaqVideoForm] = useState({
    faqQuestionId: '',
    description: '',
    videoFile: null as File | null,
    videoUrl: '',
    orderIndex: 0
  });

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

  const isValidYouTubeUrl = (url: string): boolean => {
    return extractYouTubeVideoId(url) !== null;
  };

  const getYouTubeEmbedUrl = (url: string): string | null => {
    const videoId = extractYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };


  // Função para mostrar popup personalizado
  const showPopup = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setPopup({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const closePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  const startEditing = (apartmentId: string) => {
    const apartment = apartments.find(apt => apt.id === apartmentId);
    if (apartment) {
      // Carregar dados do apartamento no formulário de edição
      setEditForm({
        title: apartment.title,
        type: apartment.type,
        description: apartment.description,
        size: apartment.size.toString(),
        bedrooms: apartment.bedrooms.toString(),
        bathrooms: apartment.bathrooms.toString(),
        condominium: apartment.location.condominium,
        amenities: apartment.amenities,
        nearbyAttractions: '',
        available: apartment.available,
        monthlyPrice: apartment.price.monthly > 0 ? apartment.price.monthly.toString() : ''
      });
      
      // Carregar imagens e vídeo atuais
      setCurrentImages(apartment.images || []);
      setCurrentVideo(apartment.video || null);
      
      // Limpar novos uploads
      setEditImages([]);
      setEditVideo(null);
      
      setEditingApartment(apartmentId);
      setActiveTab('edit');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingApartment) return;

    setIsSubmitting(true);
    try {
      let finalImages = [...currentImages];
      let finalVideo = currentVideo;

      // Upload novas imagens se houver
      if (editImages.length > 0) {
        const uploadedImages = await uploadImages(editImages);
        finalImages = [...finalImages, ...uploadedImages];
      }

      // Upload novo vídeo se houver
      if (editVideo) {
        finalVideo = await uploadVideo(editVideo);
      }

      // Criar objeto do apartamento atualizado
      const updatedApartment = {
        id: editingApartment,
        title: editForm.title,
        slug: editForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: editForm.description,
        price: { 
          monthly: editForm.type === 'fixed' ? (parseFloat(editForm.monthlyPrice) || 0) : 0, 
          daily: 0 
        },
        images: finalImages,
        video: finalVideo || undefined,
        amenities: editForm.amenities,
        size: parseInt(editForm.size),
        bedrooms: parseInt(editForm.bedrooms),
        bathrooms: parseInt(editForm.bathrooms),
        type: editForm.type,
        available: editForm.available,
        location: {
          lat: 0, // Manter coordenadas existentes
          lng: 0,
          address: '', // Manter endereço existente
          condominium: editForm.condominium as 'casarao-museu' | 'casarao-fico'
        }
      };

      await updateApartment(editingApartment, updatedApartment);
      
      showPopup('success', 'Sucesso!', 'Apartamento atualizado com sucesso!');
      
      // Voltar para a lista
      setActiveTab('list');
      setEditingApartment(null);
      
    } catch (error) {
      console.error('Erro ao atualizar apartamento:', error);
      showPopup('error', 'Erro!', 'Erro ao atualizar apartamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setActiveTab('list');
    setEditingApartment(null);
    // Limpar formulário
    setEditForm({
      title: '',
      type: 'fixed',
      description: '',
      size: '',
      bedrooms: '',
      bathrooms: '',
      condominium: '',
      amenities: [],
      nearbyAttractions: '',
      available: true,
      monthlyPrice: ''
    });
    setEditImages([]);
    setEditVideo(null);
    setCurrentImages([]);
    setCurrentVideo(null);
  };

  const handleDeleteApartment = (apartmentId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir este apartamento? Esta ação não pode ser desfeita.',
      onConfirm: () => {
        deleteApartment(apartmentId);
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  const handleClearAllApartments = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Limpar Todos os Apartamentos',
      message: 'Tem certeza que deseja excluir TODOS os apartamentos? Esta ação não pode ser desfeita.',
      onConfirm: () => {
        clearAllApartments();
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  const openInterestModal = (apartmentTitle: string, interests: any[]) => {
    setInterestModal({
      isOpen: true,
      apartmentTitle,
      interests
    });
  };

  // Funções para gerenciar FAQ Videos
  const handleAddFaqVideo = async () => {
    if (!faqVideoForm.faqQuestionId) {
      showPopup('error', 'Erro!', 'Pergunta FAQ é obrigatória.');
      return;
    }

    if (!faqVideoForm.videoFile && !faqVideoForm.videoUrl) {
      showPopup('error', 'Erro!', 'É necessário fornecer um arquivo de vídeo ou uma URL.');
      return;
    }

    // Validar URL do YouTube se fornecida
    if (faqVideoForm.videoUrl && !isValidYouTubeUrl(faqVideoForm.videoUrl)) {
      showPopup('error', 'Erro!', 'Apenas URLs do YouTube são aceitas. Use links como: https://www.youtube.com/watch?v=...');
      return;
    }

    const success = await addFaqVideo(
      faqVideoForm.faqQuestionId,
      faqVideoForm.description,
      faqVideoForm.videoFile || undefined,
      faqVideoForm.videoUrl || undefined,
      undefined, // thumbnailUrl será gerada automaticamente
      faqVideoForm.orderIndex || undefined
    );

    if (success) {
      showPopup('success', 'Sucesso!', 'Vídeo FAQ adicionado com sucesso!');
      setFaqVideoModal(false);
      setFaqVideoForm({
        faqQuestionId: '',
        description: '',
        videoFile: null,
        videoUrl: '',
        orderIndex: 0
      });
      setVideoPreviewLoading(false);
      setVideoPreviewError(null);
    } else {
      showPopup('error', 'Erro!', 'Erro ao adicionar vídeo FAQ. Tente novamente.');
    }
  };

  const handleEditFaqVideo = async () => {
    if (!editingFaqVideo) return;

    const success = await updateFaqVideo(editingFaqVideo, {
      faq_question_id: faqVideoForm.faqQuestionId,
      description: faqVideoForm.description,
      video_url: faqVideoForm.videoUrl || null,
      thumbnail_url: null, // Será gerada automaticamente
      order_index: faqVideoForm.orderIndex
    });

    if (success) {
      showPopup('success', 'Sucesso!', 'Vídeo FAQ atualizado com sucesso!');
      setFaqVideoModal(false);
      setEditingFaqVideo(null);
      setFaqVideoForm({
        faqQuestionId: '',
        description: '',
        videoFile: null,
        videoUrl: '',
        orderIndex: 0
      });
      setVideoPreviewLoading(false);
      setVideoPreviewError(null);
    } else {
      showPopup('error', 'Erro!', 'Erro ao atualizar vídeo FAQ. Tente novamente.');
    }
  };

  const startEditingFaqVideo = (video: any) => {
    setEditingFaqVideo(video.id);
    setFaqVideoForm({
      faqQuestionId: video.faq_question_id || '',
      description: video.description || '',
      videoFile: null,
      videoUrl: video.video_url || '',
      orderIndex: video.order_index
    });
    setFaqVideoModal(true);
  };

  const handleDeleteFaqVideo = (videoId: string, videoTitle: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o vídeo "${videoTitle}"? Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        const success = await deleteFaqVideo(videoId);
        if (success) {
          showPopup('success', 'Sucesso!', 'Vídeo FAQ excluído com sucesso!');
        } else {
          showPopup('error', 'Erro!', 'Erro ao excluir vídeo FAQ. Tente novamente.');
        }
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  // Funções para o formulário de adicionar apartamento
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApartmentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setApartmentForm(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('Arquivos selecionados para upload:', files);
    
    // Validar tamanho dos arquivos (máximo 10MB cada)
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        showPopup('error', 'Arquivo muito grande', `Arquivo ${file.name} é muito grande. Máximo 10MB por imagem.`);
        return false;
      }
      return true;
    });
    
    // Validar tipos de arquivo
    const imageFiles = validFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        showPopup('error', 'Tipo de arquivo inválido', `Arquivo ${file.name} não é uma imagem válida.`);
        return false;
      }
      return true;
    });
    
    console.log('Imagens válidas:', imageFiles);
    setApartmentImages(prev => {
      const newImages = [...prev, ...imageFiles];
      console.log('Total de imagens após adição:', newImages);
      return newImages;
    });
    
    // Limpar o input para permitir selecionar os mesmos arquivos novamente
    e.target.value = '';
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('Vídeo selecionado:', file);
    
    if (file) {
      // Validar tamanho do vídeo (máximo 50MB)
      if (file.size > 50 * 1024 * 1024) {
        showPopup('error', 'Vídeo muito grande', 'Vídeo muito grande. Máximo 50MB.');
        e.target.value = '';
        return;
      }
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('video/')) {
        showPopup('error', 'Tipo de arquivo inválido', 'Arquivo selecionado não é um vídeo válido.');
        e.target.value = '';
        return;
      }
      
      console.log('Vídeo válido, definindo no estado:', file);
      setApartmentVideo(file);
    }
    
    // Limpar o input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setApartmentImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setApartmentVideo(null);
  };


  const resetForm = () => {
    setApartmentForm({
      title: '',
      type: 'fixed',
      description: '',
      size: '',
      bedrooms: '',
      bathrooms: '',
      condominium: '',
      amenities: [],
      nearbyAttractions: '',
      monthlyPrice: ''
    });
    setApartmentImages([]);
    setApartmentVideo(null);
  };

  const handleSubmitApartment = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulário submetido!', apartmentForm);
    
    if (!apartmentForm.title || !apartmentForm.condominium || !apartmentForm.description) {
      showPopup('error', 'Campos Obrigatórios', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validar preço para moradia fixa
    if (apartmentForm.type === 'fixed' && (!apartmentForm.monthlyPrice || parseFloat(apartmentForm.monthlyPrice) <= 0)) {
      showPopup('error', 'Preço Obrigatório', 'Por favor, informe o valor mensal para apartamentos de moradia fixa.');
      return;
    }

    setIsSubmitting(true);
    console.log('Iniciando processo de criação do apartamento...');

    try {
      // Upload das imagens
      let imageUrls: string[] = [];
      console.log('Imagens para upload:', apartmentImages);
      if (apartmentImages.length > 0) {
        console.log('Iniciando upload de', apartmentImages.length, 'imagens...');
        imageUrls = await uploadImages(apartmentImages);
        console.log('URLs das imagens após upload:', imageUrls);
      } else {
        console.log('Nenhuma imagem para upload');
      }

      // Upload do vídeo
      let videoUrl: string | undefined;
      console.log('Vídeo para upload:', apartmentVideo);
      if (apartmentVideo) {
        console.log('Iniciando upload do vídeo...');
        const result = await uploadVideo(apartmentVideo);
        videoUrl = result || undefined;
        console.log('URL do vídeo após upload:', videoUrl);
      } else {
        console.log('Nenhum vídeo para upload');
      }

      // Definir endereço baseado no condomínio
      const addresses = {
        'casarao-museu': 'Rua Tabor, 255 - 04202-020 - Ipiranga, São Paulo',
        'casarao-fico': 'Rua do Fico, 70/76 - 04201-000 - Ipiranga, São Paulo'
      };

      // Processar atrações próximas
      const nearbyAttractions = apartmentForm.nearbyAttractions
        .split('\n')
        .filter(line => line.trim())
        .map(line => ({
          name: line.trim(),
          distance: '0.5 km',
          type: 'Local'
        }));

      // Definir preços baseado no tipo
      const monthlyPrice = apartmentForm.type === 'fixed' ? (parseFloat(apartmentForm.monthlyPrice) || 0) : 0;
      
      // Criar objeto do apartamento
      const newApartment = {
        title: apartmentForm.title,
        description: apartmentForm.description,
        price: { monthly: monthlyPrice, daily: 0 }, // Moradia fixa tem preço mensal, outros "a consultar"
        images: imageUrls,
        video: videoUrl,
        amenities: apartmentForm.amenities,
        size: parseInt(apartmentForm.size) || 0,
        bedrooms: parseInt(apartmentForm.bedrooms) || 0,
        bathrooms: parseInt(apartmentForm.bathrooms) || 0,
        type: apartmentForm.type,
        available: true, // Novo apartamento sempre disponível
        location: {
          lat: apartmentForm.condominium === 'casarao-museu' ? -23.5505 : -23.5510,
          lng: apartmentForm.condominium === 'casarao-museu' ? -46.6333 : -46.6340,
          address: addresses[apartmentForm.condominium],
          condominium: apartmentForm.condominium
        },
        nearbyAttractions
      };

      // Adicionar apartamento
      console.log('Objeto do apartamento criado:', newApartment);
      const result = await addApartment(newApartment);
      console.log('Resultado da criação:', result);
      
      // Resetar formulário e fechar modal
      resetForm();
      setAddApartmentModal(false);
      
      // Atualizar estatísticas
      await refreshStats();
      
      showPopup('success', 'Sucesso!', 'Apartamento adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar apartamento:', error);
      showPopup('error', 'Erro', 'Erro ao adicionar apartamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/background/Admin.png)',
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
      <div className="relative z-10">
        <div className="flex h-screen overflow-hidden">
          {/* Overlay para mobile quando sidebar está aberta */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'w-64' : 'w-16'} ${sidebarOpen ? 'fixed md:relative' : 'relative'} ${sidebarOpen ? 'z-50 md:z-auto' : ''} bg-white shadow-lg transition-all duration-300 flex-shrink-0 flex flex-col h-full`}>
            <div className="p-4 flex-1">
              {/* Header da Sidebar com Logo Interativa */}
              <div className={`flex items-center mb-6 ${sidebarOpen ? 'justify-start' : 'justify-center'}`}>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-300 group transform hover:scale-105"
                >
                  {/* Logo */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                    sidebarOpen ? 'opacity-0 scale-75 rotate-180' : 'opacity-100 scale-100 rotate-0'
                  }`}>
                    <img 
                      src="/logo/Arvore.jpg" 
                      alt="Logo Casarão" 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </div>
                  
                  {/* Ícone X */}
                  <div className={`flex items-center justify-center transition-all duration-300 ${
                    sidebarOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-180'
                  }`}>
                    <X className="h-6 w-6 text-gray-600" />
                  </div>
                </button>
                
                {/* Texto Admin quando sidebar aberta */}
                <div className={`ml-3 transition-all duration-300 ${
                  sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`}>
                  {sidebarOpen && (
                    <span className="text-sm font-semibold text-gray-800">Admin</span>
                  )}
                </div>
              </div>
              
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Dashboard</span>}
                </button>
                
                <button
                  onClick={() => setActiveTab('list')}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'list'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <List className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Apartamentos ({apartments.length})</span>}
                </button>

                <button
                  onClick={() => setActiveTab('faq')}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'faq'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MessageCircle className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">FAQ Vídeos ({faqVideos.length})</span>}
                </button>
                
                
                {editingApartment && (
                  <button
                    onClick={() => setActiveTab('edit')}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'edit'
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Edit className="h-5 w-5" />
                    {sidebarOpen && <span className="ml-3">Editar Apartamento</span>}
                  </button>
                )}
              </nav>
            </div>
            
            {/* Botão de Sair */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full flex items-center px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Sair</span>}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-6">
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            {activeTab === 'dashboard' && (
              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h2>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Tempo Real
                  </div>
                </div>
                
                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 sm:p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-xs sm:text-sm">Total de Apartamentos</p>
                        <p className="text-xl sm:text-2xl font-bold">{dashboardStats.totalApartments}</p>
                      </div>
                      <Home className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 sm:p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-xs sm:text-sm">Apartamentos Disponíveis</p>
                        <p className="text-xl sm:text-2xl font-bold">{dashboardStats.availableApartments}</p>
                      </div>
                      <ToggleRight className="h-6 w-6 sm:h-8 sm:w-8 text-green-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 sm:p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-xs sm:text-sm">Apartamentos Alugados</p>
                        <p className="text-xl sm:text-2xl font-bold">{dashboardStats.rentedApartments}</p>
                      </div>
                      <ToggleLeft className="h-6 w-6 sm:h-8 sm:w-8 text-red-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-xs sm:text-sm">Total de Visualizações</p>
                        <p className="text-xl sm:text-2xl font-bold">{dashboardStats.totalViews}</p>
                      </div>
                      <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-purple-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 sm:p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-xs sm:text-sm">Interesse em Disponíveis</p>
                        <p className="text-xl sm:text-2xl font-bold">{getInterestsCount().available}</p>
                      </div>
                      <Star className="h-6 w-6 sm:h-8 sm:w-8 text-orange-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 sm:p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100 text-xs sm:text-sm">Total de Mensagens</p>
                        <p className="text-xl sm:text-2xl font-bold">{dashboardStats.totalMessages}</p>
                      </div>
                      <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-200" />
                    </div>
                  </div>
                </div>
                
                {/* Estatísticas por Apartamento */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Visualizações por Apartamento
                    </h3>
                    <div className="space-y-3">
                      {apartmentAnalytics.map((analytic) => (
                        <div key={analytic.apartmentId} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 truncate flex-1 mr-2">
                            {analytic.apartmentTitle}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {analytic.views} visualizações
                          </span>
                        </div>
                      ))}
                      {apartmentAnalytics.length === 0 && (
                        <p className="text-gray-500 text-sm">Nenhuma visualização registrada</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Mensagens por Apartamento
                    </h3>
                    <div className="space-y-3">
                      {apartmentAnalytics.map((analytic) => (
                        <div key={analytic.apartmentId} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 truncate flex-1 mr-2">
                            {analytic.apartmentTitle}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {analytic.messages} mensagens
                          </span>
                        </div>
                      ))}
                      {apartmentAnalytics.length === 0 && (
                        <p className="text-gray-500 text-sm">Nenhuma mensagem registrada</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Seção de Apartamentos com Interesse */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Apartamentos com Interesse dos Usuários</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {getApartmentsWithInterests().map((apartment) => (
                        <div key={apartment.apartment_id} className={`bg-white p-4 rounded-lg border flex items-center justify-between ${
                          !apartment.apartment_exists ? 'border-gray-300 bg-gray-50' :
                          !apartment.apartment_available ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
                        }`}>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-gray-900">{apartment.apartment_title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                !apartment.apartment_exists
                                  ? 'bg-gray-100 text-gray-800'
                                  : apartment.apartment_available 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {!apartment.apartment_exists ? 'Excluído' : 
                                 apartment.apartment_available ? 'Disponível' : 'Alugado'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">{apartment.interests.length}</span> pessoa(s) interessada(s)
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Último interesse: {new Date(apartment.interests[0]?.created_at || '').toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => openInterestModal(apartment.apartment_title, apartment.interests)}
                            className="ml-4 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            title="Ver detalhes dos interessados"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      
                      {getApartmentsWithInterests().length === 0 && (
                        <div className="text-center py-8">
                          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Nenhum interesse registrado ainda</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'list' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Apartamentos</h2>
                    <button
                      onClick={() => setAddApartmentModal(true)}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Adicionar Apartamento</span>
                      <span className="sm:hidden">Adicionar</span>
                    </button>
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

                {/* Sub-abas para tipos de apartamento */}
                <div className="flex justify-center mb-6 sm:mb-8 px-2 sm:px-0">
                  <div className="bg-white rounded-full p-1 shadow-md relative overflow-hidden w-full sm:w-auto">
                    {/* Indicador deslizante */}
                    <div
                      className="absolute top-0 left-0 h-full bg-primary/10 rounded-full transition-all duration-300 ease-in-out"
                      style={{
                        width: '33.333%',
                        transform: `translateX(${
                          apartmentSubTab === 'fixed' ? '0%' : 
                          apartmentSubTab === 'temporary' ? '100%' : '200%'
                        })`,
                        zIndex: 1
                      }}
                    />
                    <div className="flex space-x-1 relative z-10">
                      <button
                        onClick={() => setApartmentSubTab('fixed')}
                        className={`flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 relative text-xs sm:text-sm flex-1 sm:flex-none ${
                          apartmentSubTab === 'fixed'
                            ? 'text-primary'
                            : 'text-gray-600 hover:text-primary'
                        }`}
                        style={{ zIndex: 2 }}
                      >
                        <Home className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden xs:inline sm:inline">Moradia Fixa</span>
                        <span className="xs:hidden sm:hidden">Fixa</span>
                      </button>
                      <button
                        onClick={() => setApartmentSubTab('temporary')}
                        className={`flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 relative text-xs sm:text-sm flex-1 sm:flex-none ${
                          apartmentSubTab === 'temporary'
                            ? 'text-primary'
                            : 'text-gray-600 hover:text-primary'
                        }`}
                        style={{ zIndex: 2 }}
                      >
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Temporada</span>
                      </button>
                      <button
                        onClick={() => setApartmentSubTab('experience')}
                        className={`flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 relative text-xs sm:text-sm flex-1 sm:flex-none ${
                          apartmentSubTab === 'experience'
                            ? 'text-primary'
                            : 'text-gray-600 hover:text-primary'
                        }`}
                        style={{ zIndex: 2 }}
                      >
                        <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden xs:inline sm:inline">Experiências</span>
                        <span className="xs:hidden sm:hidden">Exp</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando apartamentos...</p>
                  </div>
                ) : apartments.filter(apt => 
                  apartmentSubTab === 'experience' ? apt.type === 'experience' :
                  apartmentSubTab === 'fixed' ? (apt.type === 'fixed' || apt.type === 'both') :
                  apartmentSubTab === 'temporary' ? (apt.type === 'temporary' || apt.type === 'both') : false
                ).length === 0 ? (
                  <div className="text-center py-12">
                    {apartmentSubTab === 'experience' ? (
                      <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                    ) : (
                      <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    )}
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum{apartmentSubTab === 'experience' ? 'a experiência' : ' apartamento'} cadastrado
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Adicione {apartmentSubTab === 'experience' ? 'sua primeira experiência' : 'seu primeiro apartamento'} para começar.
                    </p>
                    <button
                      onClick={() => setAddApartmentModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar {apartmentSubTab === 'experience' ? 'Experiência' : 'Apartamento'}
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* Seção atual baseada na sub-aba */}
                    <div>
                      <div className="flex items-center mb-4">
                        {apartmentSubTab === 'fixed' ? (
                          <Home className="h-5 w-5 text-primary mr-2" />
                        ) : apartmentSubTab === 'temporary' ? (
                          <Calendar className="h-5 w-5 text-primary mr-2" />
                        ) : (
                          <Star className="h-5 w-5 text-yellow-600 mr-2" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {apartmentSubTab === 'fixed' ? 'Moradia Fixa' :
                           apartmentSubTab === 'temporary' ? 'Temporada' : 'Experiências Únicas'} 
                          ({apartments.filter(apt => 
                            apartmentSubTab === 'experience' ? apt.type === 'experience' :
                            apartmentSubTab === 'fixed' ? (apt.type === 'fixed' || apt.type === 'both') :
                            apartmentSubTab === 'temporary' ? (apt.type === 'temporary' || apt.type === 'both') : false
                          ).length})
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {apartments
                          .filter(apt => 
                            apartmentSubTab === 'experience' ? apt.type === 'experience' :
                            apartmentSubTab === 'fixed' ? (apt.type === 'fixed' || apt.type === 'both') :
                            apartmentSubTab === 'temporary' ? (apt.type === 'temporary' || apt.type === 'both') : false
                          )
                          .map((apartment) => (
                            <div key={apartment.id} className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                              apartment.type === 'experience' ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'
                            }`}>
                              <div className="aspect-video bg-gray-200 relative">
                                {apartment.images && apartment.images.length > 0 ? (
                                  <img
                                    src={apartment.images[0]}
                                    alt={apartment.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    {apartment.type === 'experience' ? (
                                      <Star className="h-12 w-12 text-yellow-400" />
                                    ) : (
                                      <Home className="h-12 w-12 text-gray-400" />
                                    )}
                                  </div>
                                )}
                                <div className="absolute top-2 right-2">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    apartment.available 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {apartment.available ? 'Disponível' : 'Alugado'}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-2">{apartment.title}</h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{apartment.description}</p>
                                
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                  <span className="capitalize">
                                    {apartment.type === 'fixed' ? 'Moradia Fixa' : 
                                     apartment.type === 'temporary' ? 'Temporada' : 
                                     apartment.type === 'experience' ? 'Experiência Única' : 'Ambos'}
                                  </span>
                                  <span>{apartment.size}m² • {apartment.bedrooms} quartos</span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="text-sm">
                                    <div className="text-gray-600 mb-1">
                                      {apartment.type === 'fixed' && apartment.price.monthly > 0 
                                        ? `R$ ${apartment.price.monthly.toLocaleString('pt-BR')}/mês`
                                        : 'Valores a consultar'
                                      }
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => updateApartment(apartment.id, { available: !apartment.available })}
                                      className={`p-2 rounded-lg transition-colors ${
                                        apartment.available 
                                          ? 'text-green-600 hover:bg-green-50' 
                                          : 'text-red-600 hover:bg-red-50'
                                      }`}
                                      title={apartment.available ? 'Marcar como alugado' : 'Marcar como disponível'}
                                    >
                                      {apartment.available ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                                    </button>
                                    <button
                                      onClick={() => startEditing(apartment.id)}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Editar apartamento"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
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
                  </div>
                )}
              </div>
            )}


            {activeTab === 'edit' && editingApartment && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Editar Apartamento</h2>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    ← Voltar à Lista
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-6">
                  {/* Título */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título do Apartamento
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Tipo e Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Locação
                      </label>
                      <select
                        value={editForm.type}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="fixed">Fixa</option>
                        <option value="temporary">Temporada</option>
                        <option value="both">Ambos</option>
                        <option value="experience">Experiência</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={editForm.available ? 'available' : 'rented'}
                        onChange={(e) => setEditForm({ ...editForm, available: e.target.value === 'available' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="available">Disponível</option>
                        <option value="rented">Alugado</option>
                      </select>
                    </div>
                  </div>

                  {/* Campo de Preço Mensal - só para Moradia Fixa */}
                  {editForm.type === 'fixed' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valor Mensal (R$) *
                      </label>
                      <input
                        type="number"
                        value={editForm.monthlyPrice}
                        onChange={(e) => setEditForm({ ...editForm, monthlyPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Ex: 2500"
                        min="0"
                        step="0.01"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Valor do aluguel mensal para moradia fixa
                      </p>
                    </div>
                  )}

                  {/* Descrição */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Detalhes do Apartamento */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamanho (m²)
                      </label>
                      <input
                        type="number"
                        value={editForm.size}
                        onChange={(e) => setEditForm({ ...editForm, size: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quartos
                      </label>
                      <input
                        type="number"
                        value={editForm.bedrooms}
                        onChange={(e) => setEditForm({ ...editForm, bedrooms: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Banheiros
                      </label>
                      <input
                        type="number"
                        value={editForm.bathrooms}
                        onChange={(e) => setEditForm({ ...editForm, bathrooms: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Condomínio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condomínio
                    </label>
                    <select
                      value={editForm.condominium}
                      onChange={(e) => setEditForm({ ...editForm, condominium: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">Selecione um condomínio</option>
                      <option value="casarao-museu">Casarão Museu</option>
                      <option value="casarao-fico">Casarão Fico</option>
                    </select>
                  </div>

                  {/* Comodidades */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comodidades
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {['Wi-Fi', 'Ar Condicionado', 'TV', 'Cozinha', 'Geladeira', 'Micro-ondas', 'Máquina de Lavar', 'Estacionamento', 'Piscina', 'Academia'].map((amenity) => (
                        <label key={amenity} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editForm.amenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditForm({ ...editForm, amenities: [...editForm.amenities, amenity] });
                              } else {
                                setEditForm({ ...editForm, amenities: editForm.amenities.filter(a => a !== amenity) });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Imagens Atuais */}
                  {currentImages.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imagens Atuais
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {currentImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Imagem ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => setCurrentImages(currentImages.filter((_, i) => i !== index))}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Novas Imagens */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adicionar Novas Imagens
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setEditImages(Array.from(e.target.files || []))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Vídeo Atual */}
                  {currentVideo && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vídeo Atual
                      </label>
                      <div className="relative">
                        <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden">
                          <video
                            src={currentVideo}
                            controls
                            className="absolute inset-0 w-full h-full object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setCurrentVideo(null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Novo Vídeo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentVideo ? 'Substituir Vídeo' : 'Adicionar Vídeo'}
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setEditVideo(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'faq' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">FAQ Vídeos</h2>
                  <button
                    onClick={() => {
                      setEditingFaqVideo(null);
                      setFaqVideoForm({
                        faqQuestionId: '',
                        description: '',
                        videoFile: null,
                        videoUrl: '',
                        orderIndex: faqVideos.length + 1
                      });
                      setFaqVideoModal(true);
                    }}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Vídeo
                  </button>
                </div>

                <div className="grid gap-4">
                  {faqVideos.map((video) => (
                    <div key={video.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-primary text-white text-sm font-medium px-2 py-1 rounded-full">
                              #{video.order_index}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {faqs.find(f => f.id === video.faq_question_id)?.question || video.title}
                            </h3>
                            <button
                              onClick={() => toggleVideoStatus(video.id)}
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                                video.is_active
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {video.is_active ? (
                                <>
                                  <ToggleRight className="h-3 w-3" />
                                  Ativo
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="h-3 w-3" />
                                  Inativo
                                </>
                              )}
                            </button>
                          </div>
                          
                          {video.description && (
                            <p className="text-gray-600 mb-3">{video.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {video.video_file_path && (
                              <span>📁 Arquivo: {video.video_file_path.split('/').pop()}</span>
                            )}
                            {video.video_url && (
                              <span>🔗 URL: {video.video_url}</span>
                            )}
                            {video.thumbnail_url && (
                              <span>🖼️ Thumbnail: {video.thumbnail_url}</span>
                            )}
                          </div>
                          
                          <div className="mt-3">
                            {video.video_url && video.video_url.includes('youtube.com/embed/') ? (
                              <iframe
                                src={video.video_url}
                                className="w-full max-w-md h-48 rounded-lg"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden">
                                <video
                                  src={video.video_url ?? video.video_file_path ?? undefined}
                                  controls
                                  className="absolute inset-0 w-full h-full object-contain"
                                  poster={video.thumbnail_url ?? undefined}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => startEditingFaqVideo(video)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar vídeo"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFaqVideo(video.id, video.title)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir vídeo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {faqVideos.length === 0 && (
                    <div className="text-center py-12">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum vídeo FAQ</h3>
                      <p className="text-gray-500 mb-4">Adicione vídeos para responder às perguntas frequentes dos usuários.</p>
                      <button
                        onClick={() => {
                          setEditingFaqVideo(null);
                          setFaqVideoForm({
                            faqQuestionId: '',
                            description: '',
                            videoFile: null,
                            videoUrl: '',
                            orderIndex: 1
                          });
                          setFaqVideoModal(true);
                        }}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Adicionar Primeiro Vídeo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>
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
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">{confirmModal.message}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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

      {/* Modal de Detalhes dos Interessados */}
      {interestModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Interessados em: {interestModal.apartmentTitle}
              </h3>
              <button
                onClick={() => setInterestModal({ ...interestModal, isOpen: false })}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-96">
              <div className="space-y-3">
                {interestModal.interests.map((interest, index) => (
                  <div key={interest.id} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-primary text-white text-sm font-medium px-2 py-1 rounded-full">
                          #{index + 1}
                        </span>
                        <div>
                          <span className="font-medium text-gray-900 block">{interest.user_name}</span>
                          <span className="text-sm text-gray-600">+55 {interest.user_whatsapp}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const whatsappNumber = `55${interest.user_whatsapp.replace(/\D/g, '')}`;
                            const message = `Olá ${interest.user_name}! O apartamento "${interest.apartment_title}" está disponível. Gostaria de conversar?`;
                            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, '_blank');
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                          title="Contatar via WhatsApp"
                        >
                          <MessageCircle className="h-3 w-3" />
                          WhatsApp
                        </button>
                        <span className="text-xs text-gray-500">
                          {new Date(interest.created_at || '').toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        interest.apartment_available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {interest.apartment_available ? 'Apartamento Disponível' : 'Apartamento Alugado'}
                      </span>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        interest.user_type === 'available' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {interest.user_type === 'available' ? 'Interesse em Disponível' : 'Interesse em Alugado'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {interestModal.interests.length === 0 && (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum interesse registrado</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Total de interessados: <strong>{interestModal.interests.length}</strong></span>
                <span>Ordenado por ordem de chegada (primeiro a chegar no topo)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Apartamento */}
      {addApartmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Adicionar Novo Apartamento
              </h3>
              <button
                onClick={() => {
                  resetForm();
                  setAddApartmentModal(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
              <form onSubmit={handleSubmitApartment} className="space-y-4 sm:space-y-6">
                {/* Informações Básicas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título do Apartamento
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={apartmentForm.title}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: Apartamento Aconchegante no Centro"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Apartamento
                    </label>
                    <select 
                      name="type"
                      value={apartmentForm.type}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="fixed">Moradia Fixa</option>
                      <option value="temporary">Temporada</option>
                      <option value="both">Ambos</option>
                      <option value="experience">Experiência</option>
                    </select>
                  </div>
                </div>

                {/* Campo de Preço Mensal - só para Moradia Fixa */}
                {apartmentForm.type === 'fixed' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor Mensal (R$) *
                    </label>
                    <input
                      type="number"
                      name="monthlyPrice"
                      value={apartmentForm.monthlyPrice}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: 2500"
                      min="0"
                      step="0.01"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Valor do aluguel mensal para moradia fixa
                    </p>
                  </div>
                )}

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    value={apartmentForm.description}
                    onChange={handleFormChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Descreva o apartamento, suas características e diferenciais..."
                    required
                  />
                </div>

                {/* Detalhes do Apartamento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tamanho (m²)
                    </label>
                    <input
                      type="number"
                      name="size"
                      value={apartmentForm.size}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: 45"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quartos
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={apartmentForm.bedrooms}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: 2"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banheiros
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={apartmentForm.bathrooms}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Ex: 1"
                      required
                    />
                  </div>
                </div>

                {/* Localização - Seleção de Condomínio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condomínio
                  </label>
                  <select 
                    name="condominium"
                    value={apartmentForm.condominium}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Selecione o condomínio</option>
                    <option value="casarao-museu">Casarão Museu - Rua Tabor, 255 - 04202-020 - Ipiranga, São Paulo</option>
                    <option value="casarao-fico">Casarão Fico - Rua do Fico, 70/76 - 04201-000 - Ipiranga, São Paulo</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    O endereço será automaticamente definido baseado no condomínio selecionado
                  </p>
                </div>

                {/* Comodidades */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comodidades
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                    {[
                      'Wi-Fi', 'Ar Condicionado', 'TV', 'Cozinha Equipada', 
                      'Máquina de Lavar', 'Estacionamento', 'Piscina', 'Academia',
                      'Portaria 24h', 'Elevador', 'Varanda', 'Pet Friendly'
                    ].map((amenity) => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={apartmentForm.amenities.includes(amenity)}
                          onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Atrações Próximas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Atrações Próximas
                  </label>
                  <textarea
                    name="nearbyAttractions"
                    value={apartmentForm.nearbyAttractions}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Liste as principais atrações próximas, uma por linha..."
                  />
                </div>

                {/* Upload de Imagens */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagens do Apartamento
                  </label>
                  <label 
                    htmlFor="image-upload"
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer block"
                  >
                    <div className="space-y-2">
                      <div className="text-gray-400">
                        <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-primary">Clique para fazer upload</span> ou arraste as imagens aqui
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG até 10MB cada</p>
                      {apartmentImages.length > 0 && (
                        <p className="text-sm text-green-600 font-medium">
                          {apartmentImages.length} imagem(ns) selecionada(s)
                        </p>
                      )}
                    </div>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*,image/jpeg,image/jpg,image/png,image/gif,image/webp" 
                      onChange={handleImageUpload}
                      className="hidden" 
                      id="image-upload"
                      capture="environment"
                    />
                  </label>
                  
                  {/* Preview das imagens selecionadas */}
                  {apartmentImages.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Imagens selecionadas:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {apartmentImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                              {Math.round(file.size / 1024)}KB
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload de Vídeo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vídeo do Apartamento (Opcional)
                  </label>
                  <label 
                    htmlFor="video-upload"
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer block"
                  >
                    <div className="space-y-2">
                      <div className="text-gray-400">
                        <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium text-primary">Clique para fazer upload do vídeo</span>
                      </div>
                      <p className="text-xs text-gray-500">MP4 até 50MB</p>
                      {apartmentVideo && (
                        <p className="text-sm text-green-600 font-medium">
                          Vídeo selecionado: {apartmentVideo.name}
                        </p>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="video/*,video/mp4,video/mov,video/avi,video/wmv" 
                      onChange={handleVideoUpload}
                      className="hidden" 
                      id="video-upload"
                      capture="environment"
                    />
                  </label>
                  
                  {/* Preview do vídeo selecionado */}
                  {apartmentVideo && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Vídeo selecionado:</h4>
                      <div className="relative inline-block">
                        <div className="bg-gray-100 rounded-lg p-4 border">
                          <div className="flex items-center gap-3">
                            <div className="text-gray-500">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{apartmentVideo.name}</p>
                              <p className="text-xs text-gray-500">{Math.round(apartmentVideo.size / (1024 * 1024))}MB</p>
                            </div>
                            <button
                              type="button"
                              onClick={removeVideo}
                              className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-6 border-t border-gray-200 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setAddApartmentModal(false);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors order-2 sm:order-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                  >
                    <span className="hidden sm:inline">{isSubmitting ? 'Adicionando...' : 'Adicionar Apartamento'}</span>
                    <span className="sm:hidden">{isSubmitting ? 'Adicionando...' : 'Adicionar'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Popup Personalizado */}
      {popup.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {popup.type === 'success' && (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
                {popup.type === 'error' && (
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                )}
                {popup.type === 'info' && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{popup.title}</h3>
              </div>
            </div>
            <p className="text-gray-600 mb-6">{popup.message}</p>
            <div className="flex justify-end">
              <button
                onClick={closePopup}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  popup.type === 'success' 
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : popup.type === 'error'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de FAQ Vídeo */}
      {faqVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingFaqVideo ? 'Editar Vídeo FAQ' : 'Adicionar Vídeo FAQ'}
              </h3>
              <button
                onClick={() => {
                  setFaqVideoModal(false);
                  setEditingFaqVideo(null);
                  setFaqVideoForm({
                    faqQuestionId: '',
                    description: '',
                    videoFile: null,
                    videoUrl: '',
                    orderIndex: 0
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={(e) => {
                e.preventDefault();
                editingFaqVideo ? handleEditFaqVideo() : handleAddFaqVideo();
              }} className="space-y-4">
                
                {/* Pergunta FAQ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pergunta Frequente *
                  </label>
                  <select
                    value={faqVideoForm.faqQuestionId}
                    onChange={(e) => setFaqVideoForm({ ...faqVideoForm, faqQuestionId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Selecione uma pergunta...</option>
                    {faqs.map((faq) => (
                      <option key={faq.id} value={faq.id}>
                        {faq.question}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={faqVideoForm.description}
                    onChange={(e) => setFaqVideoForm({ ...faqVideoForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Descrição opcional do vídeo..."
                  />
                </div>

                {/* Upload do Vídeo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arquivo de Vídeo {faqVideoForm.videoUrl ? '(Opcional)' : '*'}
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFaqVideoForm({ ...faqVideoForm, videoFile: e.target.files?.[0] || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required={!editingFaqVideo && !faqVideoForm.videoUrl}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {faqVideoForm.videoUrl 
                      ? 'Opcional se você já forneceu uma URL de vídeo' 
                      : 'Formatos aceitos: MP4, WebM, OGG, AVI, MOV, WMV (máx. 100MB)'
                    }
                  </p>
                </div>

                {/* URL do Vídeo (Opcional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL do Vídeo (Opcional)
                  </label>
                  <input
                    type="url"
                    value={faqVideoForm.videoUrl}
                    onChange={(e) => setFaqVideoForm({ ...faqVideoForm, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://exemplo.com/video.mp4"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {faqVideoForm.videoFile 
                      ? 'Opcional se você já fez upload de um arquivo' 
                      : 'Apenas URLs do YouTube são aceitas'}
                  </p>
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail (Opcional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Para vídeos do YouTube, a thumbnail será automática. Para arquivos, você pode adicionar uma capa personalizada.
                  </p>
                </div>

                {/* Ordem de Exibição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={faqVideoForm.orderIndex}
                    onChange={(e) => setFaqVideoForm({ ...faqVideoForm, orderIndex: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Números menores aparecem primeiro na lista
                  </p>
                </div>

                {/* Preview do Vídeo */}
                {(faqVideoForm.videoUrl || faqVideoForm.videoFile) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                      {videoPreviewLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Carregando vídeo...</p>
                          </div>
                        </div>
                      )}
                      
                      {videoPreviewError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
                          <div className="text-center p-4">
                            <p className="text-sm text-red-600 mb-2">Erro ao carregar vídeo</p>
                            <p className="text-xs text-red-500">{videoPreviewError}</p>
                          </div>
                        </div>
                      )}
                      
                      {faqVideoForm.videoUrl && isValidYouTubeUrl(faqVideoForm.videoUrl) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(faqVideoForm.videoUrl) || undefined}
                          className="w-full max-w-md h-48 rounded-lg"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          onLoad={() => {
                            setVideoPreviewLoading(false);
                            setVideoPreviewError(null);
                          }}
                          onError={() => {
                            setVideoPreviewLoading(false);
                            setVideoPreviewError('Erro ao carregar vídeo do YouTube.');
                          }}
                        />
                      ) : (
                        <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden">
                          <video
                            src={faqVideoForm.videoFile ? URL.createObjectURL(faqVideoForm.videoFile) : undefined}
                            controls
                            preload="metadata"
                            className="absolute inset-0 w-full h-full object-contain"
                          onLoadStart={() => {
                            console.log('Carregando preview do vídeo...');
                            setVideoPreviewLoading(true);
                            setVideoPreviewError(null);
                          }}
                          onLoadedMetadata={(e) => {
                            const video = e.target as HTMLVideoElement;
                            console.log(`Vídeo carregado: ${Math.round(video.duration)}s de duração`);
                            setVideoPreviewLoading(false);
                          }}
                          onCanPlay={() => {
                            setVideoPreviewLoading(false);
                          }}
                          onError={(e) => {
                            console.error('Erro ao carregar preview:', e);
                            setVideoPreviewLoading(false);
                            setVideoPreviewError('Não foi possível carregar o vídeo. Verifique o formato.');
                          }}
                        />
                        </div>
                      )}
                      
                      {!videoPreviewLoading && !videoPreviewError && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          Preview
                        </div>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500">
                        <strong>Fonte:</strong> {faqVideoForm.videoFile ? `Arquivo: ${faqVideoForm.videoFile.name}` : `URL: ${faqVideoForm.videoUrl}`}
                      </p>
                      {faqVideoForm.videoFile && (
                        <p className="text-xs text-gray-500">
                          <strong>Tamanho:</strong> {(faqVideoForm.videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {editingFaqVideo ? 'Atualizar Vídeo' : 'Adicionar Vídeo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFaqVideoModal(false);
                      setEditingFaqVideo(null);
                      setFaqVideoForm({
                        faqQuestionId: '',
                        description: '',
                        videoFile: null,
                        videoUrl: '',
                        orderIndex: 0
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
