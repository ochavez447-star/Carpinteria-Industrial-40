import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Heart,
  Eye,
  Star,
  Package
} from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    originalPrice?: string;
    imageUrl?: string;
    images?: string[];
    inStock: boolean;
    featured?: boolean;
    category?: {
      name: string;
    };
    material?: string;
    color?: string;
  };
  viewMode?: "grid" | "list";
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!product.inStock) {
      toast({
        title: "Producto Agotado",
        description: "Este producto no está disponible en este momento",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
      quantity: 1,
    });

    toast({
      title: "Producto Agregado",
      description: `${product.name} se agregó al carrito`,
    });
  };

  const handleViewProduct = () => {
    // Here you would navigate to product detail page
    toast({
      title: "Detalle del Producto",
      description: "Función de detalle en desarrollo",
    });
  };

  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const defaultImage = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300';
  const productImage = product.imageUrl || defaultImage;

  if (viewMode === "list") {
    return (
      <Card 
        className="hover:shadow-lg transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleViewProduct}
      >
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative sm:w-48 h-48 overflow-hidden rounded-l-lg bg-gray-200">
              <img
                src={productImage}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isHovered ? 'scale-105' : 'scale-100'
                } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {hasDiscount && (
                  <Badge className="bg-orange-accent text-white font-bold">
                    -{discountPercentage}%
                  </Badge>
                )}
                {product.featured && (
                  <Badge variant="secondary">
                    Destacado
                  </Badge>
                )}
                {!product.inStock && (
                  <Badge variant="destructive">
                    Agotado
                  </Badge>
                )}
              </div>

              {/* Wishlist Button */}
              <button 
                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{product.name}</h3>
                  {product.category && (
                    <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
                  )}
                </div>
                
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">(4.5)</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

              {/* Product Details */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.material && (
                  <Badge variant="outline" className="text-xs">
                    {product.material}
                  </Badge>
                )}
                {product.color && (
                  <Badge variant="outline" className="text-xs">
                    {product.color}
                  </Badge>
                )}
              </div>

              {/* Price and Actions */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-brown-primary">
                    ${price.toLocaleString('es-MX')}
                  </span>
                  {hasDiscount && (
                    <span className="text-lg text-gray-500 line-through">
                      ${originalPrice!.toLocaleString('es-MX')}
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProduct();
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="bg-brown-primary hover:bg-brown-secondary"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    {product.inStock ? 'Agregar' : 'Agotado'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewProduct}
    >
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative overflow-hidden rounded-t-lg bg-gray-200 aspect-[4/3]">
          <img
            src={productImage}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-300 ${
              isHovered ? 'scale-105' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {hasDiscount && (
              <Badge className="bg-orange-accent text-white font-bold">
                -{discountPercentage}%
              </Badge>
            )}
            {product.featured && (
              <Badge variant="secondary">
                ⭐
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive">
                Agotado
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button 
            className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
          </button>

          {/* Quick View Button */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleViewProduct();
              }}
              className="transform translate-y-2 group-hover:translate-y-0 transition-transform"
            >
              <Eye className="w-4 h-4 mr-1" />
              Vista Rápida
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {product.category.name}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.5)</span>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-brown-primary">
                ${price.toLocaleString('es-MX')}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ${originalPrice!.toLocaleString('es-MX')}
                </span>
              )}
            </div>
            
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              size="sm"
              className="bg-brown-primary hover:bg-brown-secondary"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>

          {/* Product Details */}
          {(product.material || product.color) && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.material && (
                <Badge variant="outline" className="text-xs">
                  {product.material}
                </Badge>
              )}
              {product.color && (
                <Badge variant="outline" className="text-xs">
                  {product.color}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
