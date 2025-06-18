import React, { ForwardedRef } from 'react';
import { Home, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

const Footer = React.forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <footer ref={ref} className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo/logo-rodapé.jpg" alt="Casarão Ipiranga" className="h-14 w-auto" />
            </div>
            <p className="text-white/80 mb-6">
              Oferecemos apartamentos de alta qualidade para moradia fixa e temporada 
              no coração de São Paulo. Conforto, segurança e localização privilegiada.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-white/80">(11) 91213-1333</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1" />
                <span className="text-white/80">
                  Rua Tabor, 255<br />
                  Ipiranga, São Paulo - SP
                </span>
                <span className="text-white/80">
                  Rua do Fico, 70/71<br />
                  Ipiranga, São Paulo - SP
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links (now Social Media) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Siga-nos</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1G13GpSPfU/?mibextid=wwXIfr" className="text-white/80 hover:text-white transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/casarao_ipiranga?igsh=MWx3ZDU5c29zNDB6dA==" className="text-white/80 hover:text-white transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/80">
            © 2025 Casarão Ipiranga. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
});

export default Footer;