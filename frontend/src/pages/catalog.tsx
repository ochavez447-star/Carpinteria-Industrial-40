import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List } from "lucide-react";

export default function Catalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Fetch products with filters
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", { 
      categoryId: selectedCategory, 
      search: searchTerm,
    }],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The query will automatically refetch with the new searchTerm
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Catálogo de Productos</h1>
          <p className="text-gray-600">Explora nuestra colección completa de muebles para el hogar</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Filtros</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearFilters}
                    className="text-brown-primary hover:text-brown-secondary"
                  >
                    Limpiar
                  </Button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar
                  </label>
                  <form onSubmit={handleSearch} className="flex">
                    <Input
                      placeholder="Buscar muebles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button 
                      type="submit"
                      size="sm" 
                      className="bg-brown-primary hover:bg-brown-secondary rounded-l-none px-3"
                    >
                      <Search size={16} />
                    </Button>
                  </form>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas las categorías</SelectItem>
                      {categories.map((category: any) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordenar por
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Más recientes</SelectItem>
                      <SelectItem value="price_low">Precio: menor a mayor</SelectItem>
                      <SelectItem value="price_high">Precio: mayor a menor</SelectItem>
                      <SelectItem value="name">Nombre A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Filters */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filtros rápidos
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-brown-primary hover:text-white">
                      Nuevos
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-brown-primary hover:text-white">
                      Ofertas
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-brown-primary hover:text-white">
                      Destacados
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <p className="text-gray-600">
                  {productsLoading ? 'Cargando...' : `${products.length} productos encontrados`}
                </p>
                {searchTerm && (
                  <p className="text-sm text-gray-500">
                    Resultados para: "<span className="font-medium">{searchTerm}</span>"
                  </p>
                )}
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-brown-primary hover:bg-brown-secondary" : ""}
                >
                  <Grid size={16} />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-brown-primary hover:bg-brown-secondary" : ""}
                >
                  <List size={16} />
                </Button>
              </div>
            </div>

            {/* Products Grid/List */}
            {productsLoading ? (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
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
            ) : products.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedCategory 
                      ? "Intenta ajustar tus filtros de búsqueda"
                      : "No hay productos disponibles en este momento"
                    }
                  </p>
                  {(searchTerm || selectedCategory) && (
                    <Button 
                      onClick={clearFilters}
                      variant="outline"
                      className="border-brown-primary text-brown-primary hover:bg-brown-primary hover:text-white"
                    >
                      Limpiar Filtros
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {products.map((product: any) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {products.length > 0 && (
              <div className="text-center mt-12">
                <Button 
                  variant="outline"
                  className="border-brown-primary text-brown-primary hover:bg-brown-primary hover:text-white"
                >
                  Cargar Más Productos
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
