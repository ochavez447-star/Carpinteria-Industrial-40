import { useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Truck, 
  Shield, 
  Headphones, 
  Lock,
  ChevronDown,
  Phone,
  Mail,
  MessageCircle
} from "lucide-react";

export default function Landing() {
  const { toast } = useToast();

  // Fetch featured products
  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery<any[]>({
    queryKey: ["/api/products", { featured: true, limit: 8 }],
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-background">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')"
          }}
        >
          <div className="absolute inset-0 bg-foreground bg-opacity-40"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Madera Precisa<br />
              <span className="text-secondary">Muebles CNC a Medida</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Descubre nuestra colección de muebles de alta precisión. Calidad garantizada, diseño CNC a medida y acabados excepcionales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/catalog">
                <Button className="bg-primary text-primary-foreground px-8 py-3 text-lg hover:bg-secondary w-full sm:w-auto">
                  Ver Catálogo
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  variant="outline" 
                  className="bg-transparent border-2 border-white text-white px-8 py-3 text-lg hover:bg-white hover:text-foreground w-full sm:w-auto"
                >
                  Pedidos Especiales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Categorías Populares</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Encuentra exactamente lo que necesitas para tu hogar</p>
          </div>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg aspect-square animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((category: any) => (
                <div key={category.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg bg-gray-200 aspect-square">
                    <img 
                      src={category.imageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400'} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition duration-300"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                      <p className="text-gray-200 text-sm">{category.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
              <p className="text-gray-600">Los muebles más populares de nuestra colección</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <Button className="bg-primary text-primary-foreground hover:bg-secondary">Todos</Button>
              <Button variant="outline" className="border-primary text-primary">Nuevos</Button>
              <Button variant="outline" className="border-primary text-primary">Ofertas</Button>
            </div>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="bg-gray-200 h-48 animate-pulse"></div>
                  <CardContent className="p-4">
                    <div className="bg-gray-200 h-4 mb-2 animate-pulse rounded"></div>
                    <div className="bg-gray-200 h-3 mb-3 animate-pulse rounded"></div>
                    <div className="bg-gray-200 h-6 animate-pulse rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/catalog">
              <Button variant="outline" className="border-brown-primary text-brown-primary hover:bg-brown-primary hover:text-white">
                Ver Todos los Productos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegir Madera Precisa?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Tecnología CNC avanzada para muebles con precisión milimétrica</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-primary-foreground text-2xl" size={32} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Envío Rápido</h3>
              <p className="text-gray-600 text-sm">Entrega en 2-5 días hábiles a toda la república</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary-foreground text-2xl" size={32} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Garantía de Calidad</h3>
              <p className="text-gray-600 text-sm">Todos nuestros muebles incluyen garantía de 2 años</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="text-primary-foreground text-2xl" size={32} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Atención 24/7</h3>
              <p className="text-gray-600 text-sm">Soporte al cliente disponible todos los días</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="text-primary-foreground text-2xl" size={32} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Pago Seguro</h3>
              <p className="text-gray-600 text-sm">Transacciones protegidas con tecnología SSL</p>
            </div>
          </div>
        </div>
      </section>

      {/* Order Tracking Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Rastrea tu Pedido</h2>
              <p className="text-gray-600">Ingresa tu número de pedido para conocer el estado de tu envío</p>
            </div>

            <div className="max-w-md mx-auto mb-8">
              <div className="flex">
                <Input 
                  placeholder="Número de pedido (ej: MP-2024-001)" 
                  className="rounded-r-none border-primary"
                />
                <Button className="bg-primary hover:bg-secondary rounded-l-none text-primary-foreground">
                  Buscar
                </Button>
              </div>
            </div>

            <div className="text-center text-gray-500">
              <p>Ejemplo de seguimiento disponible después del registro</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-background rounded-lg p-8 border border-secondary">
              <h2 className="text-2xl font-bold text-foreground mb-6">Pedidos Especiales</h2>
              <p className="text-foreground opacity-80 mb-6">
                ¿No encuentras exactamente lo que buscas? Solicita un mueble personalizado y nuestro equipo te ayudará.
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Nombre Completo" className="border-secondary" />
                  <Input placeholder="Teléfono" className="border-secondary" />
                </div>
                <Input placeholder="Email" className="border-secondary" />
                <select className="w-full px-3 py-2 border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                  <option>Selecciona una categoría</option>
                  <option>Sala de Estar</option>
                  <option>Dormitorio</option>
                  <option>Cocina</option>
                  <option>Oficina</option>
                  <option>Otro</option>
                </select>
                <textarea 
                  rows={4} 
                  className="w-full px-3 py-2 border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white" 
                  placeholder="Describe tu proyecto, medidas, materiales preferidos, etc."
                ></textarea>
                
                <Button className="w-full bg-primary hover:bg-secondary text-primary-foreground">
                  Enviar Solicitud
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Centro de Ayuda</h2>
              
              <div className="space-y-4 mb-8">
                <Card>
                  <CardContent className="p-4">
                    <button className="w-full text-left flex justify-between items-center">
                      <span className="font-medium">¿Cuánto tiempo tarda la entrega?</span>
                      <ChevronDown className="text-gray-400" size={20} />
                    </button>
                    <div className="mt-3 text-gray-600 text-sm">
                      La entrega varía según tu ubicación: Ciudad de México (2-3 días), interior de la república (3-5 días hábiles).
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <button className="w-full text-left flex justify-between items-center">
                      <span className="font-medium">¿Ofrecen servicio de ensamble?</span>
                      <ChevronDown className="text-gray-400" size={20} />
                    </button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <button className="w-full text-left flex justify-between items-center">
                      <span className="font-medium">¿Cuál es la política de devoluciones?</span>
                      <ChevronDown className="text-gray-400" size={20} />
                    </button>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-foreground text-background p-6">
                <h3 className="font-semibold text-secondary mb-4">Otras formas de contacto</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                      <Phone className="text-primary-foreground" size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Teléfono</p>
                      <p className="text-background opacity-80 text-sm">55 1234 5678</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                      <Mail className="text-primary-foreground" size={16} />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-background opacity-80 text-sm">contacto@maderaprecisa.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                      <MessageCircle className="text-primary-foreground" size={16} />
                    </div>
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-background opacity-80 text-sm">55 9876 5432</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
