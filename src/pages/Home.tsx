import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Shield, Star, Users, Wifi, Car } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Localização Privilegiada',
      description: 'No coração de São Paulo, próximo aos principais pontos turísticos e comerciais.',
    },
    {
      icon: Shield,
      title: 'Segurança 24h',
      description: 'Portaria 24 horas, sistema de monitoramento e controle de acesso.',
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
    
    { icon: Car, name: 'Estacionamento' },
    { icon: Shield, name: 'Segurança' },
    { icon: Star, name: 'Academia' },
    { icon: Star, name: 'Coworking' },
    { icon: Star, name: 'Lavanderia' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center" style={{ background: '#FFFDFA' }}>
        {/* Imagem de fundo dos móveis */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&h=1080&fit=crop)',
            opacity: 0.35,
            zIndex: 1
          }}
        />
        <div className="relative z-10 text-center text-gray-900 max-w-4xl mx-auto px-4 pt-32">
          <h1 className="text-4xl md:text-5xl font-bold mb-10 leading-tight text-gray-900">
            Apartamentos de luxo para moradia fixa e temporada no centro de São Paulo
          </h1>
          <Link
            to="/catalog"
            className="inline-flex items-center bg-[#074024] hover:bg-[#176c3a] text-[#FFFDFA] px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Explorar Apartamentos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Viva no coração de São Paulo
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                O Casarão Ipiranga oferece apartamentos completamente mobiliados e equipados, 
                ideais tanto para quem busca uma moradia fixa quanto para estadias temporárias. 
                Nossa localização privilegiada no centro da cidade garante fácil acesso a 
                restaurantes, teatros, museus e transporte público.
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
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560449752-0d8b825b101a?w=600&h=400&fit=crop"
                alt="Interior do apartamento"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o Casarão Ipiranga?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Oferecemos muito mais que apenas um lugar para ficar. 
              Proporcionamos uma experiência completa de moradia.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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
    </div>
  );
};

export default Home;