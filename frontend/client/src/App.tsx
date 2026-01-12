import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Catalog from "@/pages/catalog";
import Checkout from "@/pages/checkout";
import OrderTracking from "@/pages/order-tracking";
import Contact from "@/pages/contact";
import Help from "@/pages/help";
import Sellers from "@/pages/sellers";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/catalog" component={Catalog} />
          <Route path="/tracking" component={OrderTracking} />
          <Route path="/contact" component={Contact} />
          <Route path="/help" component={Help} />
          <Route path="/sellers" component={Sellers} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/catalog" component={Catalog} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/tracking" component={OrderTracking} />
          <Route path="/contact" component={Contact} />
          <Route path="/help" component={Help} />
          <Route path="/sellers" component={Sellers} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
