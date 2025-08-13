import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

const countries = [
  { code: "CD", name: "République Démocratique du Congo", currency: "CDF", flag: "🇨🇩" },
  { code: "SN", name: "Sénégal", currency: "XOF", flag: "🇸🇳" },
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF", flag: "🇨🇮" },
  { code: "MA", name: "Maroc", currency: "MAD", flag: "🇲🇦" },
  { code: "TN", name: "Tunisie", currency: "TND", flag: "🇹🇳" },
  { code: "CM", name: "Cameroun", currency: "XAF", flag: "🇨🇲" },
];

export default function TransferCalculator() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("cash");

  const selectedCountry = countries.find(c => c.code === destinationCountry);
  const toCurrency = selectedCountry?.currency || "";

  const { data: exchangeRate } = useQuery({
    queryKey: ["/api/exchange-rates", fromCurrency, toCurrency],
    enabled: !!toCurrency && !!amount,
    queryFn: async () => {
      const response = await fetch(`/api/exchange-rates?from=${fromCurrency}&to=${toCurrency}`);
      if (!response.ok) throw new Error("Failed to fetch exchange rate");
      return response.json();
    },
  });

  const calculateTransfer = () => {
    const sendAmount = parseFloat(amount) || 0;
    const fees = sendAmount * 0.03; // 3% fee
    const rate = exchangeRate?.rate || 1;
    const receivedAmount = sendAmount * rate;

    return {
      sendAmount: sendAmount.toFixed(2),
      fees: fees.toFixed(2),
      rate: rate.toFixed(2),
      receivedAmount: receivedAmount.toLocaleString(),
    };
  };

  const calculation = calculateTransfer();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-6">
              Services Financiers <span className="text-primary">Rapides & Sécurisés</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Solutions financières vers l'Afrique en quelques clics. 
              Taux compétitifs et frais transparents.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                  <i className="fas fa-bolt text-primary"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Transaction Instantanée</h4>
                  <p className="text-gray-600">Vos proches reçoivent en quelques minutes</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                  <i className="fas fa-shield-alt text-primary"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">100% Sécurisé</h4>
                  <p className="text-gray-600">Cryptage bancaire et protection des données</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                  <i className="fas fa-chart-line text-primary"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Taux Compétitifs</h4>
                  <p className="text-gray-600">Meilleurs taux de change du marché</p>
                </div>
              </div>
            </div>

            {/* Countries Supported */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Pays Supportés :</h4>
              <div className="flex flex-wrap gap-2">
                {countries.map((country) => (
                  <span key={country.code} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {country.flag} {country.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Transfer Form */}
          <Card className="bg-gray-50">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 font-poppins">Calculer Votre Transfert</h3>
              
              <div className="space-y-6">
                {/* Amount Input */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Montant à envoyer</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="100"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pr-20 text-lg font-semibold"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger className="border-none bg-transparent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Country Selection */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Pays de destination</Label>
                  <Select value={destinationCountry} onValueChange={setDestinationCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un pays" />
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
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Mode de réception</Label>
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="cursor-pointer flex-1 border-2 border-gray-200 rounded-lg p-3 text-center hover:border-primary transition-colors">
                        <i className="fas fa-hand-holding-usd text-primary text-xl mb-1 block"></i>
                        <p className="text-sm font-medium">Retrait espèces</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mobile" id="mobile" />
                      <Label htmlFor="mobile" className="cursor-pointer flex-1 border-2 border-gray-200 rounded-lg p-3 text-center hover:border-primary transition-colors">
                        <i className="fas fa-mobile-alt text-primary text-xl mb-1 block"></i>
                        <p className="text-sm font-medium">Mobile Money</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Transfer Summary */}
                {amount && destinationCountry && (
                  <Card className="bg-white border border-gray-200">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Montant envoyé:</span>
                          <span className="font-medium">{calculation.sendAmount} {fromCurrency}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Frais de transfert:</span>
                          <span className="font-medium">{calculation.fees} {fromCurrency}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Taux de change:</span>
                          <span className="font-medium">1 {fromCurrency} = {calculation.rate} {toCurrency}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between">
                          <span className="font-semibold text-gray-900">Montant reçu:</span>
                          <span className="font-bold text-primary text-lg">{calculation.receivedAmount} {toCurrency}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Submit Button */}
                <Link href="/transfer">
                  <Button className="w-full bg-primary hover:bg-primary-600 text-white py-4 text-lg font-semibold">
                    <i className="fas fa-paper-plane mr-2"></i>
                    Envoyer Maintenant
                  </Button>
                </Link>
              </div>

              {/* Security Notice */}
              <div className="mt-6 flex items-center space-x-2 text-sm text-gray-600">
                <i className="fas fa-lock text-primary"></i>
                <span>Sécurisé par le cryptage SSL 256-bit</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
