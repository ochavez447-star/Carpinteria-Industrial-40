import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Cart from "@/components/Cart";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu,
  Package,
  LogOut,
  HelpCircle
} from "lucide-react";
import type { User as UserType } from "@shared/schema";

import logoUrl from "@assets/IMG-20251221-WA0086_1766942011914.jpg";

export default function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth() as { user: UserType | null, isAuthenticated: boolean, isLoading: boolean };
  const { items } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/catalog?search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  const navigation = [
    { name: 'Catálogo', href: '/catalog' },
    { name: 'Ofertas', href: '/catalog?featured=true' },
    { name: 'Contacto', href: '/contact' },
    { name: 'Ayuda', href: '/help' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/' && location === '/') return true;
    if (href !== '/' && location?.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 cursor-pointer flex items-center gap-3">
                <img src={logoUrl} alt="Madera Precisa" className="h-12 w-auto object-contain" />
                <span className="text-xl font-bold text-gray-900 hidden sm:block">Madera Precisa</span>
              </div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Buscar muebles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-primary focus:border-transparent"
              />
              <button type="submit" className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="text-gray-400" size={20} />
              </button>
            </form>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className={`transition duration-200 ${
                  isActiveLink(item.href)
                    ? 'text-primary font-medium'
                    : 'text-foreground hover:text-primary'
                }`}>
                  {item.name}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl || undefined} />
                      <AvatarFallback>
                        {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.firstName && (
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                        </p>
                      )}
                      {user?.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/tracking">
                      <Package className="mr-2 h-4 w-4" />
                      Mis Pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/help">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Ayuda
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/api/logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                onClick={() => window.location.href = "/api/login"}
                className="text-gray-700 hover:text-brown-primary transition duration-200"
              >
                <User size={20} />
              </Button>
            )}

            {/* Shopping Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative text-gray-700 hover:text-brown-primary transition duration-200"
                >
                  <ShoppingCart size={20} />
                  {cartItemsCount > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 bg-orange-accent text-white text-xs h-5 w-5 flex items-center justify-center p-0"
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-96">
                <SheetHeader>
                  <SheetTitle>Carrito de Compras</SheetTitle>
                </SheetHeader>
                <Cart />
              </SheetContent>
            </Sheet>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="md:hidden text-gray-700 hover:text-brown-primary transition duration-200"
                >
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menú</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="text"
                      placeholder="Buscar muebles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2"
                    />
                    <button type="submit" className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Search className="text-gray-400" size={20} />
                    </button>
                  </form>

                  {/* Mobile Navigation */}
                  <nav className="space-y-2">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href}
                          className={`block px-3 py-2 rounded-md text-base font-medium transition duration-200 ${
                            isActiveLink(item.href)
                              ? 'text-brown-primary bg-beige-light'
                              : 'text-gray-700 hover:text-brown-primary hover:bg-gray-50'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile User Actions */}
                  {isAuthenticated ? (
                    <div className="pt-4 border-t space-y-2">
                      <Link href="/tracking"
                          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brown-primary hover:bg-gray-50"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Package className="mr-3 h-5 w-5" />
                          Mis Pedidos
                      </Link>
                      <a 
                        href="/api/logout"
                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brown-primary hover:bg-gray-50"
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Cerrar Sesión
                      </a>
                    </div>
                  ) : (
                    <div className="pt-4 border-t">
                      <Button
                        onClick={() => {
                          window.location.href = "/api/login";
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-brown-primary hover:bg-brown-secondary"
                      >
                        Iniciar Sesión
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
