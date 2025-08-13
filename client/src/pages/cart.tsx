import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/types";
import { isAuthenticated } from "@/lib/auth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/lib/i18n";

// Interface pour les éléments du panier avec prix personnalisé
interface CartItemWithCustomPrice {
  productId: number;
  quantity: number;
  product?: Product;
  customPrice?: number;
}

export default function Cart() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<CartItemWithCustomPrice[]>([]);
  const { t } = useLanguage();

  // Récupérer le panier depuis localStorage au chargement
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);



  const updateQuantity = (productId: number, customPrice: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, customPrice);
      return;
    }

    setCart(prev => 
      prev.map(item =>
        item.productId === productId && item.customPrice === customPrice
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: number, customPrice: number) => {
    setCart(prev => 
      prev.filter(item => 
        !(item.productId === productId && item.customPrice === customPrice)
      )
    );
    
    toast({
      title: t('cart.productRemoved'),
      description: t('cart.productRemovedDesc'),
    });
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.customPrice || parseFloat(item.product?.price || "0");
      return total + (price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      toast({
        title: t('cart.loginRequired'),
        description: t('cart.loginRequiredDesc'),
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    if (cart.length === 0) {
      toast({
        title: t('cart.emptyCartError'),
        description: t('cart.emptyCartErrorDesc'),
        variant: "destructive",
      });
      return;
    }

    // Sauvegarder le panier et rediriger vers checkout
    localStorage.setItem("cart", JSON.stringify(cart));
    setLocation("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('cart.emptyCart')}
            </h2>
            <p className="text-gray-600 mb-8">
              {t('cart.emptyCartDesc')}
            </p>
            <Link href="/marketplace">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                {t('cart.continueShopping')}
              </Button>
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/marketplace">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('cart.continueShopping')}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('cart.title')} ({getTotalItems()} {getTotalItems() > 1 ? t('cart.itemsPlural') : t('cart.items')})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des produits */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <Card key={`${item.productId}-${item.customPrice}-${index}`} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Image du produit */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.product?.imageUrl ? (
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-2xl">📦</div>
                      )}
                    </div>

                    {/* Détails du produit */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.product?.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {t('cart.unitPrice')} {(item.customPrice || parseFloat(item.product?.price || "0")).toFixed(2)} CAD
                      </p>
                      
                      {/* Contrôles de quantité */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.customPrice || 0, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, item.customPrice || 0, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                        />
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.customPrice || 0, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Prix total et suppression */}
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900 mb-2">
                        {((item.customPrice || parseFloat(item.product?.price || "0")) * item.quantity).toFixed(2)} CAD
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.productId, item.customPrice || 0)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>{t('cart.orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')} ({getTotalItems()} {getTotalItems() > 1 ? t('cart.itemsPlural') : t('cart.items')})</span>
                  <span className="font-semibold">{getTotalPrice().toFixed(2)} CAD</span>
                </div>
                
                <div className="flex justify-between">
                  <span>{t('cart.shipping')}</span>
                  <span className="text-green-600 font-semibold">{t('cart.free')}</span>
                </div>
                
                <hr />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('cart.total')}</span>
                  <span>{getTotalPrice().toFixed(2)} CAD</span>
                </div>
                
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  {t('cart.placeOrder')}
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  {t('cart.termsText')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}