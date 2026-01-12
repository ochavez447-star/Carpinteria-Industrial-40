import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Truck, Shield, CheckCircle } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";

export default function Checkout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number>();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Acceso Requerido",
        description: "Debes iniciar sesión para realizar una compra",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 2000);
      return;
    }

    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
      }));
    }
  }, [user, isAuthenticated, isLoading, toast]);

  const handleCreateOrder = async () => {
    if (items.length === 0) {
      toast({
        title: "Carrito Vacío",
        description: "Agrega productos al carrito antes de proceder al pago",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingOrder(true);

    try {
      // Create order
      const orderData = {
        subtotal: total.toString(),
        tax: (total * 0.16).toString(), // 16% IVA
        shipping: (total > 5000 ? 0 : 500).toString(), // Free shipping over $5000
        total: (total + (total * 0.16) + (total > 5000 ? 0 : 500)).toString(),
        shippingAddress: shippingInfo,
        billingAddress: shippingInfo,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price.toString(),
        })),
      };

      const orderResponse = await apiRequest("POST", "/api/orders", orderData);
      const order = await orderResponse.json();
      setOrderId(order.id);
      setIsSuccess(true);
      clearCart();
      
      toast({
        title: "¡Pedido Realizado!",
        description: "Tu pedido ha sido procesado correctamente",
      });

    } catch (error: any) {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sesión Expirada",
          description: "Redirigiendo al login...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1500);
        return;
      }

      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el pedido. Intenta de nuevo.",
        variant: "destructive",
      });
    }

    setIsCreatingOrder(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brown-primary" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-12 pb-8 px-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Gracias por tu compra!</h1>
            <p className="text-gray-600 mb-8">
              Tu pedido ha sido recibido con éxito. Puedes rastrear el estado de tu entrega con tu número de pedido.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => setLocation(`/tracking?order=${orderId}`)}
                className="bg-brown-primary hover:bg-brown-secondary"
              >
                Rastrear mi Pedido
              </Button>
              <Button 
                variant="outline"
                onClick={() => setLocation("/")}
              >
                Volver a la Tienda
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Acceso Requerido</h2>
            <p className="text-gray-600 mb-4">Debes iniciar sesión para realizar una compra</p>
            <Button 
              onClick={() => window.location.href = "/api/login"}
              className="bg-brown-primary hover:bg-brown-secondary"
            >
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <Card>
            <CardContent className="p-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tu carrito está vacío</h2>
              <p className="text-gray-600 mb-6">Agrega algunos productos para proceder al checkout</p>
              <Button 
                onClick={() => setLocation("/catalog")}
                className="bg-brown-primary hover:bg-brown-secondary"
              >
                Explorar Productos
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = total;
  const tax = subtotal * 0.16; // 16% IVA
  const shipping = subtotal > 5000 ? 0 : 500;
  const finalTotal = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(item.price * item.quantity).toLocaleString('es-MX')}</p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toLocaleString('es-MX')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (16%):</span>
                    <span>${tax.toLocaleString('es-MX')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío:</span>
                    <span>
                      {shipping === 0 ? (
                        <Badge variant="secondary">GRATIS</Badge>
                      ) : (
                        `$${shipping.toLocaleString('es-MX')}`
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-brown-primary">${finalTotal.toLocaleString('es-MX')}</span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-beige-light p-4 rounded-lg space-y-2">
                  <div className="flex items-center text-sm">
                    <Truck className="mr-2 h-4 w-4 text-brown-primary" />
                    <span>Entrega en 3-5 días hábiles</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="mr-2 h-4 w-4 text-brown-primary" />
                    <span>Garantía de 2 años incluida</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Nombre completo"
                    value={shippingInfo.fullName}
                    onChange={(e) => setShippingInfo(prev => ({...prev, fullName: e.target.value}))}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo(prev => ({...prev, email: e.target.value}))}
                  />
                </div>
                
                <Input
                  placeholder="Teléfono"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo(prev => ({...prev, phone: e.target.value}))}
                />
                
                <Input
                  placeholder="Dirección completa"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo(prev => ({...prev, address: e.target.value}))}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Ciudad"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo(prev => ({...prev, city: e.target.value}))}
                  />
                  <Input
                    placeholder="Estado"
                    value={shippingInfo.state}
                    onChange={(e) => setShippingInfo(prev => ({...prev, state: e.target.value}))}
                  />
                  <Input
                    placeholder="Código Postal"
                    value={shippingInfo.postalCode}
                    onChange={(e) => setShippingInfo(prev => ({...prev, postalCode: e.target.value}))}
                  />
                </div>

                <Button 
                  onClick={handleCreateOrder}
                  disabled={isCreatingOrder || !shippingInfo.fullName || !shippingInfo.email || !shippingInfo.address}
                  className="w-full bg-brown-primary hover:bg-brown-secondary py-3 text-lg"
                >
                  {isCreatingOrder ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando Pedido...
                    </>
                  ) : (
                    'Finalizar Pedido'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
