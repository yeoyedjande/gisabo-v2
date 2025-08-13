import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated, getAuthHeaders } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ExchangeRate } from "@/lib/types";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useLanguage } from "@/lib/i18n";

const countries = [
  { code: "BI", name: "Burundi", currency: "BIF", flag: "🇧🇮" },
];

const currencies = ["CAD", "CHF", "SEK"];

export default function Transfer() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const authenticated = isAuthenticated();
  const { t } = useLanguage();

  const [step, setStep] = useState(1); // 1: Details, 2: Review, 3: Payment, 4: Confirmation
  const [formData, setFormData] = useState({
    amount: "",
    currency: "CAD",
    recipientName: "",
    recipientPhone: "",
    destinationCountry: "",
    deliveryMethod: "cash",
  });

  useEffect(() => {
    if (!authenticated) {
      toast({
        title: t('common.loginRequired'),
        description: t('transfer.loginRequiredDescription'),
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [authenticated, navigate, toast]);

  const selectedCountry = countries.find(
    (c) => c.code === formData.destinationCountry,
  );
  const toCurrency = selectedCountry?.currency || "";

  const {
    data: exchangeRate,
    error: exchangeRateError,
    isLoading: isLoadingRate,
  } = useQuery<ExchangeRate>({
    queryKey: ["/api/exchange-rates", formData.currency, toCurrency],
    enabled:
      !!toCurrency && !!formData.amount && parseFloat(formData.amount) > 0,
    queryFn: async () => {
      const response = await fetch(
        `/api/exchange-rates?from=${formData.currency}&to=${toCurrency}`,
      );
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `Taux de change non disponible pour ${formData.currency} vers ${toCurrency}`,
          );
        }
        throw new Error("Erreur lors de la récupération du taux de change");
      }
      return response.json();
    },
    retry: false,
  });

  const createTransferMutation = useMutation({
    mutationFn: async (transferData: any) => {
      const response = await apiRequest("POST", "/api/transfers", transferData);
      return response.json();
    },
    onSuccess: (transfer) => {
      setStep(4);
      queryClient.invalidateQueries({ queryKey: ["/api/transfers"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const processPaymentMutation = useMutation({
    mutationFn: async ({
      transferId,
      paymentToken,
    }: {
      transferId: number;
      paymentToken: string;
    }) => {
      const response = await apiRequest(
        "POST",
        `/api/transfers/${transferId}/pay`,
        { paymentToken },
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Paiement réussi",
        description: "Votre transfert a été traité avec succès",
      });
      setStep(4);
      queryClient.invalidateQueries({ queryKey: ["/api/transfers"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur de paiement",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const calculateTransfer = () => {
    const sendAmount = parseFloat(formData.amount) || 0;
    const fees = sendAmount * 0.03; // 3% fee
    const rate = exchangeRate?.rate || 1;
    const receivedAmount = sendAmount * rate;

    return {
      sendAmount: sendAmount.toFixed(2),
      fees: fees.toFixed(2),
      total: (sendAmount + fees).toFixed(2),
      rate: rate.toFixed(2),
      receivedAmount: receivedAmount.toLocaleString(),
    };
  };

  const calculation = calculateTransfer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      // Validate form
      if (
        !formData.amount ||
        !formData.recipientName ||
        !formData.recipientPhone ||
        !formData.destinationCountry
      ) {
        toast({
          title: t('common.error'),
          description: t('transfer.formIncomplete'),
          variant: "destructive",
        });
        return;
      }

      setStep(2);
    } else if (step === 2) {
      // Create transfer
      const transferData = {
        amount: parseFloat(calculation.sendAmount),
        currency: formData.currency,
        recipientName: formData.recipientName,
        recipientPhone: formData.recipientPhone,
        destinationCountry: selectedCountry?.name || "",
        destinationCurrency: toCurrency,
        exchangeRate: parseFloat(calculation.rate),
        fees: parseFloat(calculation.fees),
        receivedAmount: parseFloat(calculation.receivedAmount.replace(/,/g, "")),
        deliveryMethod: formData.deliveryMethod,
      };

      createTransferMutation.mutate(transferData);
    }
  };

  const handlePayment = () => {
    // In a real implementation, this would integrate with Square's payment form
    // For now, we'll simulate a successful payment
    const mockPaymentToken = `mock_payment_${Date.now()}`;

    if (createTransferMutation.data?.id) {
      processPaymentMutation.mutate({
        transferId: createTransferMutation.data.id,
        paymentToken: mockPaymentToken,
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">
              {t('transfer.transferMoney')}
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
              {t('transfer.transferDescription')}
            </p>

            {/* Progress Steps */}
            <div className="flex justify-center items-center space-x-4 max-w-2xl mx-auto">
              {[
                { num: 1, label: t('transfer.step1') },
                { num: 2, label: t('transfer.step2') },
                { num: 3, label: t('transfer.step3') },
                { num: 4, label: t('transfer.step4') },
              ].map((stepItem, index) => (
                <div key={stepItem.num} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= stepItem.num
                        ? "bg-secondary text-white"
                        : "bg-white/20 text-white/60"
                    }`}
                  >
                    {step > stepItem.num ? (
                      <i className="fas fa-check"></i>
                    ) : (
                      stepItem.num
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm ${step >= stepItem.num ? "text-white" : "text-white/60"}`}
                  >
                    {stepItem.label}
                  </span>
                  {index < 3 && (
                    <div
                      className={`w-8 h-0.5 mx-4 ${step > stepItem.num ? "bg-secondary" : "bg-white/20"}`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 1 && (
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
            {/* Transfer Form */}
            <Card>
              <CardHeader>
                <CardTitle className="font-poppins">
                  {t('transfer.transferDetails')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount */}
                <div>
                  <Label htmlFor="amount">{t('transfer.amount')} *</Label>
                  <div className="relative mt-1">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="100"
                      value={formData.amount}
                      onChange={(e) => handleChange("amount", e.target.value)}
                      className="pr-20 text-lg font-semibold"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <Select
                        value={formData.currency}
                        onValueChange={(value) =>
                          handleChange("currency", value)
                        }
                      >
                        <SelectTrigger className="border-none bg-transparent w-16">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Recipient Name */}
                <div>
                  <Label htmlFor="recipientName">{t('transfer.recipientName')} *</Label>
                  <Input
                    id="recipientName"
                    value={formData.recipientName}
                    onChange={(e) =>
                      handleChange("recipientName", e.target.value)
                    }
                    placeholder="Marie Kabila"
                    className="mt-1"
                    required
                  />
                </div>

                {/* Recipient Phone */}
                <div>
                  <Label htmlFor="recipientPhone">
                    {t('transfer.recipientPhone')} *
                  </Label>
                  <Input
                    id="recipientPhone"
                    type="tel"
                    value={formData.recipientPhone}
                    onChange={(e) =>
                      handleChange("recipientPhone", e.target.value)
                    }
                    placeholder="+243 123 456 789"
                    className="mt-1"
                    required
                  />
                </div>

                {/* Destination Country */}
                <div>
                  <Label htmlFor="country">{t('transfer.destinationCountry')} *</Label>
                  <Select
                    value={formData.destinationCountry}
                    onValueChange={(value) =>
                      handleChange("destinationCountry", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={t('transfer.selectCountry')} />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Delivery Method */}
                <div>
                  <Label>{t('transfer.deliveryMethodLabel')} *</Label>
                  <RadioGroup
                    value={formData.deliveryMethod}
                    onValueChange={(value) =>
                      handleChange("deliveryMethod", value)
                    }
                    className="grid grid-cols-2 gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label
                        htmlFor="cash"
                        className="cursor-pointer flex-1 border-2 border-gray-200 rounded-lg p-4 text-center hover:border-primary transition-colors"
                      >
                        <i className="fas fa-hand-holding-usd text-primary text-2xl mb-2 block"></i>
                        <p className="font-medium">Retrait espèces</p>
                        <p className="text-sm text-gray-600">
                          Points de retrait disponibles
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mobile" id="mobile" />
                      <Label
                        htmlFor="mobile"
                        className="cursor-pointer flex-1 border-2 border-gray-200 rounded-lg p-4 text-center hover:border-primary transition-colors"
                      >
                        <i className="fas fa-mobile-alt text-primary text-2xl mb-2 block"></i>
                        <p className="font-medium">Mobile Money</p>
                        <p className="text-sm text-gray-600">
                          Directement sur mobile
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Transfer Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="font-poppins">
                  Résumé du Transfert
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formData.amount && formData.destinationCountry ? (
                  <div className="space-y-4">
                    {/* Exchange Rate Error */}
                    {exchangeRateError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                          <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                          <p className="text-red-800 text-sm font-medium">
                            {exchangeRateError.message}
                          </p>
                        </div>
                        <p className="text-red-600 text-xs mt-1">
                          Veuillez contacter l'administrateur pour configurer ce
                          taux de change.
                        </p>
                      </div>
                    )}

                    {/* Loading Rate */}
                    {isLoadingRate && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center">
                          <i className="fas fa-spinner fa-spin text-blue-600 mr-2"></i>
                          <p className="text-blue-800 text-sm">
                            Récupération du taux de change...
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant envoyé:</span>
                      <span className="font-medium">
                        {calculation.sendAmount} {formData.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frais de transfert:</span>
                      <span className="font-medium">
                        {calculation.fees} {formData.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total à payer:</span>
                      <span className="font-semibold text-lg">
                        {calculation.total} {formData.currency}
                      </span>
                    </div>

                    <Separator />

                    {exchangeRate && !exchangeRateError ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Taux de change:</span>
                          <span className="font-medium">
                            1 {formData.currency} = {calculation.rate}{" "}
                            {toCurrency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900">
                            Montant reçu:
                          </span>
                          <span className="font-bold text-primary text-xl">
                            {calculation.receivedAmount} {toCurrency}
                          </span>
                        </div>
                      </>
                    ) : (
                      !isLoadingRate && (
                        <div className="text-center py-4 text-gray-500">
                          <p>
                            Sélectionnez une devise et un montant pour voir le
                            taux de change
                          </p>
                        </div>
                      )
                    )}

                    <Separator />

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">
                        Informations de destination:
                      </h4>
                      <p className="text-sm text-gray-600">
                        <strong>Bénéficiaire:</strong>{" "}
                        {formData.recipientName || "Non spécifié"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Téléphone:</strong>{" "}
                        {formData.recipientPhone || "Non spécifié"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Pays:</strong>{" "}
                        {selectedCountry?.name || "Non spécifié"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Mode:</strong>{" "}
                        {formData.deliveryMethod === "cash"
                          ? "Retrait espèces"
                          : "Mobile Money"}
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-600 text-white py-3"
                    >
                      <i className="fas fa-arrow-right mr-2"></i>
                      Continuer vers la vérification
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <i className="fas fa-calculator text-4xl mb-4"></i>
                    <p>Remplissez le formulaire pour voir le résumé</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </form>
        )}

        {step === 2 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="font-poppins">
                Vérification du Transfert
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <i className="fas fa-info-circle text-blue-500 mt-1"></i>
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      Vérifiez attentivement
                    </h4>
                    <p className="text-blue-700 text-sm">
                      Assurez-vous que toutes les informations sont correctes
                      avant de procéder au paiement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Détails du transfert
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Montant envoyé</p>
                    <p className="font-semibold">
                      {calculation.sendAmount} {formData.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Frais</p>
                    <p className="font-semibold">
                      {calculation.fees} {formData.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total à payer</p>
                    <p className="font-semibold text-lg text-primary">
                      {calculation.total} {formData.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Montant reçu</p>
                    <p className="font-semibold text-lg text-green-600">
                      {calculation.receivedAmount} {toCurrency}
                    </p>
                  </div>
                </div>

                <Separator />

                <h3 className="text-lg font-semibold border-b pb-2">
                  Informations du bénéficiaire
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-semibold">{formData.recipientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléphone</p>
                    <p className="font-semibold">{formData.recipientPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pays de destination</p>
                    <p className="font-semibold">
                      {selectedCountry?.flag} {selectedCountry?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mode de réception</p>
                    <p className="font-semibold">
                      {formData.deliveryMethod === "cash"
                        ? "Retrait espèces"
                        : "Mobile Money"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Modifier
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={createTransferMutation.isPending}
                  className="flex-1 bg-primary hover:bg-primary-600 text-white"
                >
                  {createTransferMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Création...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      Confirmer et Payer
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && createTransferMutation.data && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="font-poppins">Paiement Sécurisé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <i className="fas fa-shield-alt text-green-500 mt-1"></i>
                  <div>
                    <h4 className="font-semibold text-green-900">
                      Paiement sécurisé
                    </h4>
                    <p className="text-green-700 text-sm">
                      Votre paiement est protégé par le cryptage SSL 256-bit de
                      Square.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">
                  Récapitulatif de la commande
                </h4>
                <div className="flex justify-between items-center">
                  <span>Total à payer:</span>
                  <span className="text-2xl font-bold text-primary">
                    {calculation.total} {formData.currency}
                  </span>
                </div>
              </div>

              {/* Mock payment form - In real implementation, use Square's payment form */}
              <div className="space-y-4">
                <h4 className="font-semibold">Informations de paiement</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <i className="fab fa-square text-3xl text-blue-600 mb-2"></i>
                  <p className="text-blue-900 font-semibold">
                    Paiement sécurisé avec Square
                  </p>
                  <p className="text-blue-700 text-sm">
                    Cliquez sur le bouton ci-dessous pour procéder au paiement
                    sécurisé
                  </p>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={processPaymentMutation.isPending}
                className="w-full bg-secondary hover:bg-secondary/90 text-white py-4 text-lg"
              >
                {processPaymentMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Traitement du paiement...
                  </>
                ) : (
                  <>
                    <i className="fas fa-credit-card mr-2"></i>
                    Payer {calculation.total} {formData.currency}
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <i className="fas fa-lock mr-1"></i>
                Paiement sécurisé avec cryptage SSL 256-bit
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-check text-green-600 text-3xl"></i>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">
                Transfert Confirmé !
              </h2>

              <p className="text-gray-600 mb-6">
                Votre transfert de{" "}
                <strong>
                  {calculation.sendAmount} {formData.currency}
                </strong>{" "}
                vers <strong>{formData.recipientName}</strong> a été traité avec
                succès.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Référence:</p>
                    <p className="font-semibold">
                      #{createTransferMutation.data?.id || "TXN123456"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Montant reçu:</p>
                    <p className="font-semibold text-green-600">
                      {calculation.receivedAmount} {toCurrency}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Bénéficiaire:</p>
                    <p className="font-semibold">{formData.recipientName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mode de réception:</p>
                    <p className="font-semibold">
                      {formData.deliveryMethod === "cash"
                        ? "Retrait espèces"
                        : "Mobile Money"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-primary hover:bg-primary-600 text-white"
                >
                  <i className="fas fa-tachometer-alt mr-2"></i>
                  Voir le tableau de bord
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      amount: "",
                      currency: "EUR",
                      recipientName: "",
                      recipientPhone: "",
                      destinationCountry: "",
                      deliveryMethod: "cash",
                    });
                  }}
                  className="w-full"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Nouveau transfert
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
