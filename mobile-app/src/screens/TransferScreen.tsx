import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import apiService from "../services/api";

interface TransferFormData {
  recipientName: string;
  recipientPhone: string;
  amount: string;
  destinationCountry: string;
  deliveryMethod: string;
}

interface Country {
  code: string;
  name: string;
  currency: string;
}

export default function TransferScreen() {
  const [formData, setFormData] = useState<TransferFormData>({
    recipientName: "",
    recipientPhone: "",
    amount: "",
    destinationCountry: "",
    deliveryMethod: "mobile_money",
  });

  const [fees, setFees] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [destinationCurrency, setDestinationCurrency] = useState("XOF");

  const countries: Country[] = [
    { code: "BI", name: "Burundi", currency: "BIF" },
    { code: "CA", name: "Canada", currency: "CA" },
  ];

  const deliveryMethods = [
    { id: "mobile_money", label: "Mobile Money", icon: "📱" },
    { id: "bank_transfer", label: "Virement bancaire", icon: "🏦" },
  ];

  useEffect(() => {
    if (formData.destinationCountry && formData.amount) {
      fetchExchangeRate();
    }
  }, [formData.destinationCountry, formData.amount]);

  const fetchExchangeRate = async () => {
    try {
      const country = countries.find(
        (c) => c.code === formData.destinationCountry,
      );
      if (country) {
        const rateData = await apiService.getExchangeRate(
          "CAD",
          country.currency,
        );
        setExchangeRate(rateData.rate);
        setDestinationCurrency(country.currency);
        calculateTotal(formData.amount, rateData.rate);
      }
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error);
      Alert.alert("Erreur", "Impossible de récupérer le taux de change");
    }
  };

  const calculateTotal = (amount: string, rate: number = exchangeRate) => {
    const numAmount = parseFloat(amount) || 0;
    const calculatedFees = numAmount * 0.05; // 5% fees
    const received = numAmount * rate;

    setFees(calculatedFees);
    setReceivedAmount(received);
  };

  const handleAmountChange = (amount: string) => {
    setFormData({ ...formData, amount });
    calculateTotal(amount);
  };

  const handleCountryChange = (countryCode: string) => {
    setFormData({ ...formData, destinationCountry: countryCode });
    const country = countries.find((c) => c.code === countryCode);
    if (country) {
      setDestinationCurrency(country.currency);
    }
  };

  const handleSubmit = () => {
    if (
      !formData.recipientName ||
      !formData.recipientPhone ||
      !formData.amount ||
      !formData.destinationCountry
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    Alert.alert(
      "Confirmer le transfert",
      `Envoyer ${formData.amount} CAD à ${formData.recipientName} ?`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Confirmer", onPress: processTransfer },
      ],
    );
  };

  const processTransfer = () => {
    // Here you would integrate with your payment system
    Alert.alert("Succès", "Transfert initié avec succès !");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nouveau transfert</Text>
        <Text style={styles.subtitle}>Envoyez de l'argent en Afrique</Text>
      </View>

      <View style={styles.form}>
        {/* Recipient Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations du destinataire</Text>

          <TextInput
            style={styles.input}
            placeholder="Nom complet du destinataire"
            value={formData.recipientName}
            onChangeText={(text) =>
              setFormData({ ...formData, recipientName: text })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Numéro de téléphone"
            value={formData.recipientPhone}
            onChangeText={(text) =>
              setFormData({ ...formData, recipientPhone: text })
            }
            keyboardType="phone-pad"
          />
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Montant à envoyer</Text>
          <View style={styles.amountContainer}>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={formData.amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
            />
            <Text style={styles.currency}>CAD</Text>
          </View>
        </View>

        {/* Destination Country */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pays de destination</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.countryList}>
              {countries.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={[
                    styles.countryButton,
                    formData.destinationCountry === country.code &&
                      styles.countryButtonSelected,
                  ]}
                  onPress={() =>
                    setFormData({
                      ...formData,
                      destinationCountry: country.code,
                    })
                  }
                >
                  <Text style={styles.countryFlag}>{country.code}</Text>
                  <Text style={styles.countryName}>{country.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Delivery Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Méthode de réception</Text>
          {deliveryMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodButton,
                formData.deliveryMethod === method.id &&
                  styles.methodButtonSelected,
              ]}
              onPress={() =>
                setFormData({ ...formData, deliveryMethod: method.id })
              }
            >
              <Text style={styles.methodIcon}>{method.icon}</Text>
              <Text style={styles.methodLabel}>{method.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary */}
        {formData.amount && (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Résumé du transfert</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Montant envoyé:</Text>
              <Text style={styles.summaryValue}>{formData.amount} CAD</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Frais:</Text>
              <Text style={styles.summaryValue}>{fees.toFixed(2)} CAD</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total à payer:</Text>
              <Text style={styles.summaryValueTotal}>
                {(parseFloat(formData.amount) + fees).toFixed(2)} CAD
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Montant reçu:</Text>
              <Text style={styles.summaryValue}>
                {receivedAmount.toFixed(0)} XOF
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            Continuer vers le paiement
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#FF6B35",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  form: {
    padding: 20,
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  amountInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 20,
    fontWeight: "bold",
  },
  currency: {
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
  },
  countryList: {
    flexDirection: "row",
  },
  countryButton: {
    padding: 15,
    margin: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    minWidth: 100,
  },
  countryButtonSelected: {
    borderColor: "#FF6B35",
    backgroundColor: "#FFF5F1",
  },
  countryFlag: {
    fontSize: 20,
    marginBottom: 5,
  },
  countryName: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
  },
  methodButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  methodButtonSelected: {
    borderColor: "#FF6B35",
    backgroundColor: "#FFF5F1",
  },
  methodIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  methodLabel: {
    fontSize: 16,
    color: "#333",
  },
  summary: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  summaryValueTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  submitButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
