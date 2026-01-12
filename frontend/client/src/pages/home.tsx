import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Clock, CreditCard } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user's recent orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
  });

  // Fetch featured products
  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", { featured: true, limit: 4 }],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Welcome Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Bienvenido de vuelta{user?.firstName ? `, ${user.firstName}` : ''}!
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre nuestras últimas ofertas y gestiona tus pedidos desde tu panel personal.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link href="/catalog">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Package className="w-12 h-12 text-brown-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Explorar Catálogo</h3>
                  <p className="text-gray-600 text-sm">Descubre todos nuestros productos</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/tracking">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Clock className="w-12 h-12 text-brown-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Rastrear Pedidos</h3>
                  <p className="text-gray-600 text-sm">Consulta el estado de tus envíos</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/contact">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <CreditCard className="w-12 h-12 text-brown-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Pedidos Especiales</h3>
                  <p className="text-gray-600 text-sm">Solicita muebles personalizados</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Mis Pedidos Recientes</h2>
            <Link href="/tracking">
              <Button variant="outline">Ver Todos</Button>
            </Link>
          </div>

          {ordersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="bg-gray-200 h-4 mb-4 rounded"></div>
                    <div className="bg-gray-200 h-3 mb-2 rounded"></div>
                    <div className="bg-gray-200 h-3 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes pedidos aún</h3>
                <p className="text-gray-600 mb-4">¡Empieza a explorar nuestro catálogo!</p>
                <Link href="/catalog">
                  <Button className="bg-brown-primary hover:bg-brown-secondary">
                    Ver Productos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.slice(0, 3).map((order: any) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Pedido #{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('es-MX')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status === 'delivered' ? 'Entregado' :
                         order.status === 'shipped' ? 'En Tránsito' :
                         order.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-brown-primary">
                        ${parseFloat(order.total).toLocaleString('es-MX')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items?.length || 0} artículo(s)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products for Logged-in Users */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recomendados para Ti</h2>
              <p className="text-gray-600">Productos que podrían interesarte</p>
            </div>
            <Link href="/catalog">
              <Button variant="outline">Ver Catálogo Completo</Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
