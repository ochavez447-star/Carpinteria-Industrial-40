import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderStatus from "@/components/OrderStatus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Package,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  MapPin
} from "lucide-react";

export default function OrderTracking() {
  const { isAuthenticated, isLoading } = useAuth();
  const [orderNumber, setOrderNumber] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Fetch user's orders if authenticated
  const { data: userOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated && !isLoading,
  });

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setIsSearching(true);
    setSearchError("");
    setSearchedOrder(null);

    try {
      const response = await fetch(`/api/orders/track/${orderNumber.trim()}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setSearchError("Pedido no encontrado. Verifica el número de pedido.");
        } else {
          setSearchError("Error al buscar el pedido. Intenta de nuevo.");
        }
        return;
      }

      const order = await response.json();
      setSearchedOrder(order);
    } catch (error) {
      setSearchError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Entregado';
      case 'shipped': return 'En Tránsito';
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'confirmed': return <Package className="h-4 w-4" />;
      case 'preparing': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Seguimiento de Pedidos</h1>
          <p className="text-gray-600">Rastrea el estado de tus pedidos y envíos</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Order Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Buscar Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Ingresa tu número de pedido para consultar su estado
            </p>
            
            <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Número de pedido (ej: MP-2024-001)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isSearching}
                className="bg-brown-primary hover:bg-brown-secondary px-8"
              >
                {isSearching ? "Buscando..." : "Buscar"}
              </Button>
            </form>

            {searchError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{searchError}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchedOrder && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Pedido #{searchedOrder.orderNumber}</span>
                <Badge className={getStatusColor(searchedOrder.status)}>
                  {getStatusIcon(searchedOrder.status)}
                  <span className="ml-1">{getStatusText(searchedOrder.status)}</span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fecha de Pedido</p>
                  <p className="font-medium flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {new Date(searchedOrder.createdAt).toLocaleDateString('es-MX')}
                  </p>
                </div>
                
                {searchedOrder.estimatedDelivery && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Entrega Estimada</p>
                    <p className="font-medium flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {new Date(searchedOrder.estimatedDelivery).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                )}
                
                {searchedOrder.carrier && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Transportista</p>
                    <p className="font-medium flex items-center">
                      <Truck className="mr-2 h-4 w-4" />
                      {searchedOrder.carrier}
                    </p>
                  </div>
                )}
              </div>

              <OrderStatus order={searchedOrder} />

              {/* Order Items */}
              <div className="mt-6">
                <h4 className="font-semibold mb-4">Artículos del Pedido</h4>
                <div className="space-y-3">
                  {searchedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <img 
                        src={item.product?.imageUrl || '/placeholder-product.jpg'} 
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium">{item.product?.name}</h5>
                        <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${parseFloat(item.price).toLocaleString('es-MX')}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="text-right">
                  <p className="text-lg font-bold text-brown-primary">
                    Total: ${parseFloat(searchedOrder.total).toLocaleString('es-MX')}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              {searchedOrder.shippingAddress && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Dirección de Envío
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p>{searchedOrder.shippingAddress.fullName}</p>
                    <p>{searchedOrder.shippingAddress.address}</p>
                    <p>{searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.state}</p>
                    <p>{searchedOrder.shippingAddress.postalCode}</p>
                    {searchedOrder.shippingAddress.phone && (
                      <p>Tel: {searchedOrder.shippingAddress.phone}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* User Orders (if authenticated) */}
        {isAuthenticated && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Mis Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4 animate-pulse">
                      <div className="bg-gray-200 h-4 mb-2 rounded"></div>
                      <div className="bg-gray-200 h-3 mb-2 rounded"></div>
                      <div className="bg-gray-200 h-3 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : userOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes pedidos aún</h3>
                  <p className="text-gray-600 mb-4">¡Empieza a explorar nuestro catálogo!</p>
                  <Button 
                    onClick={() => window.location.href = "/catalog"}
                    className="bg-brown-primary hover:bg-brown-secondary"
                  >
                    Ver Productos
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order: any) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">Pedido #{order.orderNumber}</h4>
                          <p className="text-sm text-gray-600 flex items-center">
                            <CalendarDays className="mr-1 h-3 w-3" />
                            {new Date(order.createdAt).toLocaleDateString('es-MX')}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{getStatusText(order.status)}</span>
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold text-brown-primary">
                            ${parseFloat(order.total).toLocaleString('es-MX')}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.items?.length || 0} artículo(s)
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOrderNumber(order.orderNumber)}
                          className="border-brown-primary text-brown-primary hover:bg-brown-primary hover:text-white"
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Order Status Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Estados del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Pendiente</p>
                  <p className="text-sm text-gray-600">Esperando confirmación de pago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Confirmado</p>
                  <p className="text-sm text-gray-600">Pago recibido, preparando envío</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">En Tránsito</p>
                  <p className="text-sm text-gray-600">Enviado, en camino a destino</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Entregado</p>
                  <p className="text-sm text-gray-600">Pedido entregado exitosamente</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
