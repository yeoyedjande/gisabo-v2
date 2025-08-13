import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CheckCircle, Package, User, FileText, ArrowLeft, Home } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Order, OrderItem } from "@/lib/types";

export default function OrderSuccess() {
  const [, setLocation] = useLocation();
  const [orderId, setOrderId] = useState<number | null>(null);

  // Récupérer l'ID de commande depuis localStorage ou URL
  useEffect(() => {
    const savedOrderId = localStorage.getItem("lastOrderId");
    if (savedOrderId) {
      setOrderId(parseInt(savedOrderId));
      localStorage.removeItem("lastOrderId"); // Nettoyer après utilisation
    } else {
      // Si pas d'ID de commande, rediriger vers marketplace
      setLocation("/marketplace");
    }
  }, [setLocation]);

  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!orderId,
  });

  const { data: orderItems, isLoading: itemsLoading } = useQuery<OrderItem[]>({
    queryKey: ["/api/orders", orderId, "items"],
    enabled: !!orderId,
  });

  const order = orders?.find(o => o.id === orderId);

  if (isLoading || itemsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des détails de votre commande...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Commande introuvable</h2>
            <p className="text-gray-600 mb-8">Nous n'avons pas pu trouver les détails de votre commande.</p>
            <Link href="/marketplace">
              <Button>Retourner au marketplace</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const customerInfo = order.shippingAddress as any;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de succès */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p className="text-lg text-gray-600">
            Votre paiement a été traité avec succès. Merci pour votre achat !
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Détails de la commande */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Détails de la commande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Numéro de commande :</span>
                <span className="text-blue-600 font-mono">#{order.id.toString().padStart(6, '0')}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Date :</span>
                <span>{new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Statut :</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  En traitement
                </span>
              </div>
              
              <div className="flex justify-between text-lg font-bold border-t pt-4">
                <span>Total payé :</span>
                <span className="text-blue-600">{parseFloat(order.total).toFixed(2)} {order.currency}</span>
              </div>
            </CardContent>
          </Card>

          {/* Informations du bénéficiaire */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Bénéficiaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Nom complet :</span>
                <p>{customerInfo?.firstName} {customerInfo?.lastName}</p>
              </div>
              
              <div>
                <span className="font-medium">Téléphone :</span>
                <p>{customerInfo?.phone || 'Non spécifié'}</p>
              </div>
              
              {customerInfo?.note && (
                <div>
                  <span className="font-medium">Note :</span>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-md mt-1">
                    {customerInfo.note}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Produits commandés */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Produits commandés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderItems?.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.product?.imageUrl ? (
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
                      <p className="text-sm text-gray-600">Quantité : {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{parseFloat(item.price).toFixed(2)} {order.currency}</p>
                    <p className="text-sm text-gray-600">par unité</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Link href="/marketplace">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Continuer mes achats
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Home className="h-4 w-4" />
              Voir mes commandes
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}