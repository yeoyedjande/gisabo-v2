import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { CheckCircle, ArrowLeft, Receipt, Clock, User, CreditCard, Download, Printer } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PaymentData {
  transfer: {
    id: number;
    amount: string;
    currency: string;
    recipientName: string;
    recipientPhone: string;
    destinationCountry: string;
    deliveryMethod: string;
  };
  paymentId: string;
  timestamp: string;
}

export default function PaymentSuccess() {
  const [location, setLocation] = useLocation();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  useEffect(() => {
    // Récupérer les données du paiement depuis localStorage
    const savedPaymentData = localStorage.getItem('lastPaymentSuccess');
    if (savedPaymentData) {
      setPaymentData(JSON.parse(savedPaymentData));
      localStorage.removeItem('lastPaymentSuccess');
    } else {
      setTimeout(() => setLocation('/dashboard'), 3000);
    }
  }, [setLocation]);

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Chargement des détails du paiement...</p>
        </div>
      </div>
    );
  }

  const { transfer, paymentId, timestamp } = paymentData;

  const generatePDF = async () => {
    const receiptElement = document.getElementById('receipt-content');
    if (!receiptElement) {
      console.error('Élément reçu non trouvé');
      return;
    }

    try {
      // Temporairement afficher l'élément pour la capture
      receiptElement.classList.remove('hidden');
      receiptElement.classList.add('block');
      
      // Attendre que le DOM se mette à jour
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: receiptElement.scrollWidth,
        height: receiptElement.scrollHeight
      });

      // Cacher à nouveau l'élément
      receiptElement.classList.add('hidden');
      receiptElement.classList.remove('block');

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Ajuster si le contenu dépasse une page
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        const ratio = pdf.internal.pageSize.getHeight() / pdfHeight;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth * ratio, pdf.internal.pageSize.getHeight());
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }
      
      pdf.save(`Recu-Transfert-${transfer.id}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      // Remettre l'élément en état caché en cas d'erreur
      receiptElement.classList.add('hidden');
      receiptElement.classList.remove('block');
    }
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Boutons d'action pour l'impression */}
          <div className="flex gap-4 justify-center mb-6 print:hidden">
            <Button onClick={printReceipt} variant="outline" className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Imprimer le reçu
            </Button>
            <Button onClick={generatePDF} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Télécharger PDF
            </Button>
          </div>

          {/* Page de succès complète - affichage à l'écran */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 print:hidden">
            {/* En-tête de succès */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
                  <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Paiement Réussi !
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Votre transfert d'argent a été traité avec succès
              </p>
            </div>

            {/* Détails du transfert */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Détails du Transfert
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Numéro de transfert</span>
                  <Badge variant="outline">#{transfer.id}</Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Montant envoyé</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {transfer.amount} {transfer.currency}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Bénéficiaire
                  </span>
                  <span className="font-medium">{transfer.recipientName}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Téléphone</span>
                  <span className="font-medium">{transfer.recipientPhone}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Destination</span>
                  <span className="font-medium">{transfer.destinationCountry}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Mode de livraison</span>
                  <Badge variant="secondary">{transfer.deliveryMethod}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Détails du paiement */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Détails du Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">ID de transaction</span>
                  <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {paymentId}
                  </code>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Date et heure
                  </span>
                  <span className="font-medium">
                    {new Date(timestamp).toLocaleString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Statut</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400">
                    Complété
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Informations importantes */}
            <Card className="mb-8 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
                  Informations importantes
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Votre transfert sera disponible sous 24-48 heures</li>
                  <li>• Un SMS de confirmation sera envoyé au bénéficiaire</li>
                  <li>• Conservez votre numéro de transfert pour le suivi</li>
                  <li>• En cas de problème, contactez notre service client</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Reçu compact pour impression - Format A4 optimisé */}
          <div id="receipt-content" className="hidden print:block bg-white max-w-[21cm] mx-auto p-6">
            {/* En-tête compact */}
            <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4 mb-4">
              <div>
                <h1 className="text-xl font-bold">GISABO GROUP</h1>
                <p className="text-xs text-gray-600">Services de transfert d'argent</p>
              </div>
              <div className="text-right text-xs">
                <p>REÇU OFFICIEL</p>
                <p>{new Date().toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            {/* Status en une ligne */}
            <div className="text-center bg-green-100 p-2 mb-4 rounded">
              <p className="font-bold text-green-800">✓ TRANSFERT EFFECTUÉ AVEC SUCCÈS</p>
            </div>

            {/* Informations en deux colonnes */}
            <div className="grid grid-cols-2 gap-6 mb-4">
              {/* Colonne 1: Détails du transfert */}
              <div>
                <h3 className="font-semibold border-b border-gray-200 pb-1 mb-2">DÉTAILS DU TRANSFERT</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>N° de transfert:</span>
                    <span className="font-semibold">#{transfer.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Montant:</span>
                    <span className="font-bold">{transfer.amount} {transfer.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bénéficiaire:</span>
                    <span className="font-semibold">{transfer.recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Téléphone:</span>
                    <span>{transfer.recipientPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Destination:</span>
                    <span>{transfer.destinationCountry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mode:</span>
                    <span>{transfer.deliveryMethod}</span>
                  </div>
                </div>
              </div>

              {/* Colonne 2: Détails du paiement */}
              <div>
                <h3 className="font-semibold border-b border-gray-200 pb-1 mb-2">DÉTAILS DU PAIEMENT</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>ID Transaction:</span>
                    <span className="font-mono text-xs">{paymentId.substring(0, 16)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date/Heure:</span>
                    <span>{new Date(timestamp).toLocaleString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statut:</span>
                    <span className="font-semibold text-green-600">COMPLÉTÉ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Méthode:</span>
                    <span>Carte bancaire</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations importantes compactes */}
            <div className="bg-blue-50 p-3 mb-4 rounded text-xs">
              <h4 className="font-semibold mb-1">INFORMATIONS IMPORTANTES:</h4>
              <p>• Transfert disponible sous 24-48h • SMS envoyé au bénéficiaire • Conservez ce reçu • Support: +1 (514) 123-4567</p>
            </div>

            {/* Pied de page compact */}
            <div className="border-t border-gray-300 pt-2 text-center text-xs text-gray-600">
              <p><strong>GISABO GROUP</strong> - Services financiers sécurisés | Licence: FIN-2024-GISABO-001</p>
              <p>Ce reçu constitue une preuve officielle de votre transaction</p>
            </div>
          </div>

          {/* Actions de navigation */}
          <div className="flex flex-col sm:flex-row gap-4 print:hidden">
            <Button 
              asChild 
              className="flex-1"
              variant="outline"
            >
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au tableau de bord
              </Link>
            </Button>
            
            <Button 
              asChild 
              className="flex-1"
            >
              <Link href="/gisabo">
                Nouveau transfert
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}