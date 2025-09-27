import React, { useState } from 'react';
import { MapPin, Shield, Star, Users, ShoppingCart, Dumbbell, Briefcase, WashingMachine, ChevronDown } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';
import ScrollToTopButton from '../components/ScrollToTopButton';

const Home: React.FC = () => {
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

  const faqs = [
    {
      question: 'Qual a diferença entre moradia fixa e temporada?',
      answer: 'Moradia fixa refere-se a aluguéis de longo prazo, geralmente com contratos anuais, para quem busca residência permanente. Moradia por temporada é para estadias curtas, como viagens a trabalho ou lazer, com contratos flexíveis e duração predeterminada.'
    },
    {
      question: 'Quais documentos preciso para alugar um apartamento para moradia fixa?',
      answer: 'São solicitados RG, CPF, comprovante de renda (holerite ou declaração de IR), comprovante de residência. Para autônomos ou profissionais liberais, podem ser solicitados extratos bancários e declaração de imposto de renda.'
    },
    {
      question: 'Como funciona o pagamento do aluguel?',
      answer: 'Para moradia fixa, o pagamento é mensal, geralmente por boleto ou transferência bancária. Para temporada, o pagamento pode ser feito integralmente no ato da reserva ou em parcelas, dependendo do período e do acordo, com um sinal no momento da reserva e o restante antes do check-in.'
    },
    {
      question: 'Os apartamentos são mobiliados?',
      answer: 'Não, os apartamentos para moradia fixa não são mobiliados. Os apartamentos de temporada sim, todos mobiliados.'
    },
    {
      question: 'Posso visitar os apartamentos antes de alugar?',
      answer: 'Sim, é possível agendar uma visita para conhecer os apartamentos de seu interesse. Entre em contato conosco pelo WhatsApp ou telefone para verificar a disponibilidade e marcar um horário.'
    }
  ];

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
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
        <div className="relative z-10 text-center text-gray-900 max-w-6xl mx-auto px-4 pt-32 overflow-x-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-10 leading-tight text-gray-900 whitespace-nowrap">
          Studios e Kitnets no bairro do Ipiranga - São Paulo
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
                  Condomínio Casarão Ipiranga
                </h3>
                <p className="text-gray-600 mt-2">
                  Conheça nossas instalações e áreas comuns
                </p>
              </div>
              <ImageCarousel condominium="museu" />
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
                  className="w-full flex justify-between items-center text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaqIndex === index && (
                  <p className="text-gray-700 leading-relaxed mt-2">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <ScrollToTopButton />
    </div>
  );
};

export default Home;
