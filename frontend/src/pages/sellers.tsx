import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

export default function SellersPortal() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-md mx-auto">
          <Card className="border-secondary">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="text-primary-foreground" size={24} />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Portal de Vendedores</CardTitle>
              <p className="text-muted-foreground text-sm">Acceso exclusivo para personal autorizado</p>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Usuario</label>
                  <Input type="text" placeholder="ID de Vendedor" className="border-secondary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Contraseña</label>
                  <Input type="password" placeholder="••••••••" className="border-secondary" />
                </div>
                <Button className="w-full bg-primary hover:bg-secondary text-primary-foreground font-medium py-6">
                  Iniciar Sesión
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Si olvidaste tus credenciales, contacta al administrador del sistema.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
