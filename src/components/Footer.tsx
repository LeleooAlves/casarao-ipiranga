import React, { ForwardedRef } from 'react';
import { Home, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <footer ref={ref} className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo/logo-casarao.png" alt="Casarão Ipiranga" className="h-14 w-auto" />
            </div>
            <p className="text-white/80 mb-6">
              Oferecemos apartamentos de alta qualidade para moradia fixa e temporada 
              no coração de São Paulo. Conforto, segurança e localização privilegiada.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-white/80">(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-white/80">contato@casaraoipiranga.com.br</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1" />
                <span className="text-white/80">
                  Rua Ipiranga, 344<br />
                  Centro, São Paulo - SP
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
            <div className="space-y-2">
              <a href="/catalog" className="block text-white/80 hover:text-white transition-colors duration-200">
                Catálogo
              </a>
              <a href="/reviews" className="block text-white/80 hover:text-white transition-colors duration-200">
                Avaliações
              </a>
              <a href="/support" className="block text-white/80 hover:text-white transition-colors duration-200">
                Suporte
              </a>
              <a href="#" className="block text-white/80 hover:text-white transition-colors duration-200">
                Termos de Uso
              </a>
              <a href="#" className="block text-white/80 hover:text-white transition-colors duration-200">
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/80">
            © 2024 Casarão Ipiranga. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;