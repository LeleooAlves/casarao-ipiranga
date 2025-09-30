import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  apartmentTitle?: string;
  apartmentType?: 'fixed' | 'temporary' | 'both' | 'experience';
  customerName?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  apartmentTitle, 
  apartmentType,
  customerName 
}) => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '5511912131333';
    let message = 'Olá! Gostaria de saber mais sobre os apartamentos do Casarão Ipiranga.';
    
    if (apartmentTitle && customerName) {
      const typeText = apartmentType === 'fixed' ? 'moradia fixa' : apartmentType === 'temporary' ? 'temporada' : 'ambos';
      message = `Olá! Meu nome é ${customerName} e gostaria de mais informações sobre o apartamento "${apartmentTitle}" para ${typeText}.`;
    }
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 z-50"
      aria-label="Conversar no WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
};

export default WhatsAppButton;