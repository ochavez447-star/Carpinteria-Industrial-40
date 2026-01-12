import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Search, 
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Truck,
  CreditCard,
  Package,
  Shield,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink
} from "lucide-react";

const faqData = [
  {
    id: 1,
    category: "Envíos y Entregas",
    icon: <Truck className="h-5 w-5" />,
    questions: [
      {
        q: "¿Cuánto tiempo tarda la entrega?",
        a: "Los tiempos de entrega varían según tu ubicación: Ciudad de México y área metropolitana (2-3 días hábiles), Interior de la República (3-5 días hábiles). Para pedidos especiales, el tiempo puede ser de 15-30 días dependiendo de la complejidad."
      },
      {
        q: "¿El envío tiene costo?",
        a: "Ofrecemos envío GRATIS en pedidos mayores a $5,000 MXN. Para pedidos menores, el costo de envío es de $500 MXN dentro de la república mexicana."
      },
      {
        q: "¿Cómo puedo rastrear mi pedido?",
        a: "Una vez que tu pedido sea enviado, recibirás un email con el número de rastreo. También puedes consultar el estado en la sección 'Rastrear Pedido' de nuestra página usando tu número de orden."
      },
      {
        q: "¿Entregan hasta la puerta de mi casa?",
        a: "Sí, entregamos hasta la puerta de tu domicilio. Sin embargo, el servicio de subida a pisos superiores y ensamble tiene costo adicional que se cotiza según el caso."
      }
    ]
  },
  {
    id: 2,
    category: "Pagos y Facturación",
    icon: <CreditCard className="h-5 w-5" />,
    questions: [
      {
        q: "¿Qué métodos de pago aceptan?",
        a: "Aceptamos todas las tarjetas de crédito y débito principales (Visa, Mastercard, American Express), transferencias bancarias y pagos en OXXO. Procesamos los pagos de forma segura a través de Stripe."
      },
      {
        q: "¿Puedo pagar en efectivo?",
        a: "Sí, puedes generar un comprobante de pago para OXXO durante el proceso de checkout. El pedido se procesa una vez que confirmemos el pago."
      },
      {
        q: "¿Emiten facturas?",
        a: "Sí, emitimos facturas fiscales. Solo necesitas proporcionarnos tus datos fiscales durante la compra o contactarnos después con tu número de pedido."
      },
      {
        q: "¿Es seguro comprar en línea?",
        a: "Completamente seguro. Utilizamos certificados SSL y procesamos los pagos a través de Stripe, que cumple con los más altos estándares de seguridad PCI DSS."
      }
    ]
  },
  {
    id: 3,
    category: "Productos y Garantías",
    icon: <Package className="h-5 w-5" />,
    questions: [
      {
        q: "¿Los muebles vienen ensamblados?",
        a: "La mayoría de nuestros muebles vienen semi-ensamblados para facilitar el transporte. Incluimos instrucciones claras y todas las herramientas necesarias. También ofrecemos servicio de ensamble a domicilio."
      },
      {
        q: "¿Qué garantía tienen los productos?",
        a: "Todos nuestros muebles incluyen garantía de 2 años contra defectos de fabricación. La garantía cubre estructura, herrajes y acabados, pero no incluye desgaste normal por uso."
      },
      {
        q: "¿Puedo ver los muebles antes de comprar?",
        a: "Actualmente somos una tienda en línea, pero puedes agendar una cita para ver algunos productos en nuestro showroom. También ofrecemos devoluciones si el producto no cumple tus expectativas."
      },
      {
        q: "¿Qué materiales utilizan?",
        a: "Utilizamos madera maciza, MDF de alta calidad, tableros melamínicos y herrajes de marcas reconocidas. Cada producto especifica los materiales en su descripción."
      }
    ]
  },
  {
    id: 4,
    category: "Devoluciones y Cambios",
    icon: <Shield className="h-5 w-5" />,
    questions: [
      {
        q: "¿Puedo devolver un producto?",
        a: "Sí, tienes 15 días calendario desde la entrega para devolver productos en perfecto estado. El producto debe estar sin usar, con embalaje original y etiquetas."
      },
      {
        q: "¿Quién paga el envío de devolución?",
        a: "Si la devolución es por defecto del producto, nosotros cubrimos el costo. Si es por cambio de opinión, el costo corre por cuenta del cliente."
      },
      {
        q: "¿Cuándo recibo mi reembolso?",
        a: "Una vez que recibamos y revisemos el producto devuelto, procesamos el reembolso en 5-7 días hábiles al método de pago original."
      },
      {
        q: "¿Puedo cambiar un producto por otro?",
        a: "Sí, puedes cambiar productos por otros de igual o mayor valor. Si es de mayor valor, pagas la diferencia. Si es menor, reembolsamos la diferencia."
      }
    ]
  }
];

export default function Help() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openSections, setOpenSections] = useState<number[]>([]);

  const toggleSection = (sectionId: number) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      qa => 
        qa.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qa.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-16 h-16 text-brown-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Centro de Ayuda</h1>
          <p className="text-xl text-gray-600 mb-8">
            Encuentra respuestas a las preguntas más frecuentes
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Buscar en preguntas frecuentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Help Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Truck className="w-8 h-8 text-brown-primary mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Rastrear Pedido</h3>
              <p className="text-sm text-gray-600">Consulta el estado de tu envío</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-brown-primary mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Garantías</h3>
              <p className="text-sm text-gray-600">Información sobre garantías</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <CreditCard className="w-8 h-8 text-brown-primary mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Pagos</h3>
              <p className="text-sm text-gray-600">Métodos y opciones de pago</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-brown-primary mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Devoluciones</h3>
              <p className="text-sm text-gray-600">Política de devoluciones</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h2>
          
          {filteredFAQ.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
                <p className="text-gray-600">Intenta con otros términos de búsqueda</p>
              </CardContent>
            </Card>
          ) : (
            filteredFAQ.map((category) => (
              <Card key={category.id}>
                <Collapsible
                  open={openSections.includes(category.id)}
                  onOpenChange={() => toggleSection(category.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-brown-primary rounded-full flex items-center justify-center mr-3">
                            <div className="text-white">
                              {category.icon}
                            </div>
                          </div>
                          <span>{category.category}</span>
                          <Badge variant="secondary" className="ml-3">
                            {category.questions.length}
                          </Badge>
                        </div>
                        {openSections.includes(category.id) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {category.questions.map((qa, index) => (
                          <div key={index} className="border-l-4 border-brown-primary pl-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{qa.q}</h4>
                            <p className="text-gray-600 leading-relaxed">{qa.a}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))
          )}
        </div>

        {/* Contact Support */}
        <Card className="mt-12 bg-beige-light">
          <CardHeader>
            <CardTitle className="text-center">¿No encontraste lo que buscabas?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Nuestro equipo de soporte está listo para ayudarte con cualquier pregunta específica.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Button 
                variant="outline" 
                className="flex items-center justify-center space-x-2"
                onClick={() => window.location.href = "tel:5512345678"}
              >
                <Phone size={16} />
                <span>Llamar</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center justify-center space-x-2"
                onClick={() => window.location.href = "mailto:contacto@mueblescasa.com"}
              >
                <Mail size={16} />
                <span>Email</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center justify-center space-x-2"
                onClick={() => window.open("https://wa.me/5599765432", "_blank")}
              >
                <MessageCircle size={16} />
                <span>WhatsApp</span>
              </Button>
            </div>
            
            <Button 
              className="bg-brown-primary hover:bg-brown-secondary"
              onClick={() => window.location.href = "/contact"}
            >
              Contactar Soporte
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Guías de Ensamble
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Descarga manuales de ensamble para todos nuestros productos.
              </p>
              <Button variant="outline" className="w-full">
                Ver Guías
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Términos y Condiciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Consulta nuestros términos de servicio y políticas de privacidad.
              </p>
              <Button variant="outline" className="w-full">
                Leer Términos
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
