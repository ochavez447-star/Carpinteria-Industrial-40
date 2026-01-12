import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Send,
  MapPin,
  Phone,
  Mail,
  Clock
} from "lucide-react";

export default function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email requerido",
        description: "Por favor ingresa tu email",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send to your newsletter API
    toast({
      title: "¡Suscripción exitosa!",
      description: "Te has suscrito al newsletter correctamente",
    });
    setEmail("");
  };

  const productLinks = [
    { name: "Vestidor", href: "/catalog?category=dressing" },
    { name: "Utensilios de cocina", href: "/catalog?category=kitchen-tools" },
    { name: "Closet", href: "/catalog?category=closet" },
    { name: "Cocinas", href: "/catalog?category=kitchen" },
    { name: "Oficinas", href: "/catalog?category=office" },
    { name: "Ofertas", href: "/catalog?featured=true" },
  ];

  const customerServiceLinks = [
    { name: "Centro de Ayuda", href: "/help" },
    { name: "Rastrea tu Pedido", href: "/tracking" },
    { name: "Devoluciones", href: "/help#devoluciones" },
    { name: "Garantías", href: "/help#garantias" },
    { name: "Contacto", href: "/contact" },
  ];

  const socialLinks = [
    { 
      name: "Facebook", 
      icon: <Facebook size={20} />, 
      href: "https://facebook.com/maderaprecisa" 
    },
    { 
      name: "Instagram", 
      icon: <Instagram size={20} />, 
      href: "https://instagram.com/maderaprecisa" 
    },
    { 
      name: "Twitter", 
      icon: <Twitter size={20} />, 
      href: "https://twitter.com/maderaprecisa" 
    },
    { 
      name: "YouTube", 
      icon: <Youtube size={20} />, 
      href: "https://youtube.com/maderaprecisa" 
    },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-secondary mb-4">Madera Precisa</h3>
            <p className="text-background opacity-80 text-sm mb-6">
              Muebles CNC a medida con precisión milimétrica. Transformamos tus ideas en piezas únicas de madera.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-background opacity-70">
                <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>Av. Reforma 123, Col. Centro, CDMX 06000</span>
              </div>
              <div className="flex items-center text-sm text-background opacity-70">
                <Phone className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>55 1234 5678</span>
              </div>
              <div className="flex items-center text-sm text-background opacity-70">
                <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>contacto@maderaprecisa.com</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>Lun-Vie: 9:00-19:00, Sáb: 9:00-15:00</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-white mb-4">Productos</h4>
            <ul className="space-y-2 text-sm">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition duration-200">
                      {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-white mb-4">Atención al Cliente</h4>
            <ul className="space-y-2 text-sm">
              {customerServiceLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition duration-200">
                      {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/sellers" className="text-gray-400 hover:text-white transition duration-200">
                    Acceso Vendedores
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-secondary mb-4">Newsletter</h4>
            <p className="text-background opacity-70 text-sm mb-4">
              Recibe ofertas exclusivas y novedades directamente en tu email
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-foreground border-background/20 text-background placeholder-background/40 focus:ring-primary focus:border-primary"
              />
              <Button 
                type="submit"
                className="w-full bg-primary hover:bg-secondary text-primary-foreground transition duration-200"
              >
                <Send className="mr-2 h-4 w-4" />
                Suscribirse
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Madera Precisa. Todos los derechos reservados.
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition duration-200">
                Términos y Condiciones
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition duration-200">
                Política de Privacidad
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition duration-200">
                Cookies
            </Link>
          </div>
        </div>

        {/* Security Badges */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <div className="flex flex-wrap justify-center items-center space-x-6 text-gray-400 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                🔒
              </div>
              <span>SSL Seguro</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                💳
              </div>
              <span>Pagos Protegidos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                🚚
              </div>
              <span>Envío Asegurado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                🛡️
              </div>
              <span>Garantía Incluida</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
