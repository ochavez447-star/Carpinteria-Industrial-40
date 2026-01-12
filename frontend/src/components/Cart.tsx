import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2,
  CreditCard,
  Truck,
  Package
} from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const subtotal = total;
  const tax = subtotal * 0.16; // 16% IVA
  const shipping = subtotal > 5000 ? 0 : 500; // Free shipping over $5000
  const finalTotal = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
          <p className="text-gray-600 text-center mb-6">
            Agrega algunos productos increíbles para comenzar tu compra
          </p>
          <Button 
            onClick={() => window.location.href = "/catalog"}
            className="bg-brown-primary hover:bg-brown-secondary"
          >
            Explorar Productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:shadow-sm transition-shadow">
              <img 
                src={item.imageUrl} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg bg-gray-200"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                <p className="text-xs text-gray-600 mt-1">
                  ${item.price.toLocaleString('es-MX')} c/u
                </p>
                
                {/* Quantity Controls */}
                <div className="flex items-center space-x-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                    className="h-6 w-12 text-xs text-center border-gray-300"
                  />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-sm text-brown-primary">
                  ${(item.price * item.quantity).toLocaleString('es-MX')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <div className="border-t pt-4 space-y-4">
        {/* Shipping Info */}
        <div className="bg-beige-light p-3 rounded-lg">
          <div className="flex items-center text-sm">
            <Truck className="mr-2 h-4 w-4 text-brown-primary" />
            <span>
              {shipping === 0 ? (
                <>🎉 ¡Envío gratis! Tu pedido supera $5,000</>
              ) : (
                <>Envío: $500 | Gratis en compras +$5,000</>
              )}
            </span>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 text-sm">
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
                <Badge variant="secondary" className="text-xs">GRATIS</Badge>
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

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={() => window.location.href = "/checkout"}
            className="w-full bg-brown-primary hover:bg-brown-secondary py-3"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Proceder al Pago
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/catalog"}
            className="w-full"
          >
            <Package className="mr-2 h-4 w-4" />
            Continuar Comprando
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={clearCart}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            size="sm"
          >
            <Trash2 className="mr-2 h-3 w-3" />
            Vaciar Carrito
          </Button>
        </div>

        {/* Security Notice */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <div className="flex items-center justify-center space-x-4">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              SSL Seguro
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Pago Protegido
            </span>
          </div>
          <p>Tus datos están protegidos con encriptación SSL</p>
        </div>
      </div>
    </div>
  );
}
