import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Edit3,
  Trash2,
  Settings,
  Package,
  BarChart3,
  TrendingUp,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface ExchangeRate {
  id: number;
  fromCurrency: string;
  toCurrency: string;
  rate: string;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: number;
  nameFr: string;
  nameEn: string;
  slug: string;
  shortDescriptionFr: string;
  shortDescriptionEn: string;
  fullDescriptionFr: string;
  fullDescriptionEn: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: number;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  price: string;
  currency: string;
  categoryId: number;
  imageUrl?: string;
  inStock: boolean;
}

function isAdminAuthenticated(): boolean {
  const token = localStorage.getItem("adminToken");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

function makeAuthenticatedRequest(url: string, options: any = {}) {
  const token = localStorage.getItem("adminToken");
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

export default function AdminSidebar() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State for Services
  const [newService, setNewService] = useState({
    nameFr: "",
    nameEn: "",
    slug: "",
    shortDescriptionFr: "",
    shortDescriptionEn: "",
    fullDescriptionFr: "",
    fullDescriptionEn: "",
    imageUrl: "",
    isActive: true,
  });
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // State for Products
  const [newProduct, setNewProduct] = useState({
    nameFr: "",
    nameEn: "",
    descriptionFr: "",
    descriptionEn: "",
    price: "",
    currency: "CAD",
    categoryId: 1,
    imageUrl: "",
    inStock: true,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductImageFile, setSelectedProductImageFile] =
    useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string>("");

  // Fetch data
  const { data: exchangeRates } = useQuery({
    queryKey: ["/api/admin/exchange-rates"],
    enabled: isAdminAuthenticated(),
    queryFn: async () => {
      const response = await makeAuthenticatedRequest(
        "/api/admin/exchange-rates",
      );
      if (!response.ok) throw new Error("Failed to fetch exchange rates");
      return response.json();
    },
  });

  // Dashboard statistics query
  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/admin/dashboard-stats"],
    enabled: isAdminAuthenticated(),
    queryFn: async () => {
      const response = await makeAuthenticatedRequest(
        "/api/admin/dashboard-stats",
      );
      if (!response.ok) throw new Error("Failed to fetch dashboard stats");
      return response.json();
    },
  });

  const { data: services } = useQuery({
    queryKey: ["/api/admin/services"],
    enabled: isAdminAuthenticated(),
    queryFn: async () => {
      const response = await makeAuthenticatedRequest("/api/admin/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      return response.json();
    },
  });

  const { data: products } = useQuery({
    queryKey: ["/api/admin/products"],
    enabled: isAdminAuthenticated(),
    queryFn: async () => {
      const response = await makeAuthenticatedRequest("/api/admin/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  // Upload image function
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await makeAuthenticatedRequest("/api/admin/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload image");
    const result = await response.json();
    return result.imageUrl;
  };

  // Service mutations
  const createServiceMutation = useMutation({
    mutationFn: async (service: typeof newService) => {
      let finalService = { ...service };

      if (selectedImageFile) {
        const imageUrl = await uploadImage(selectedImageFile);
        finalService.imageUrl = imageUrl;
      }

      const response = await makeAuthenticatedRequest("/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalService),
      });

      if (!response.ok) throw new Error("Failed to create service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      setNewService({
        nameFr: "",
        nameEn: "",
        slug: "",
        shortDescriptionFr: "",
        shortDescriptionEn: "",
        fullDescriptionFr: "",
        fullDescriptionEn: "",
        imageUrl: "",
        isActive: true,
      });
      setSelectedImageFile(null);
      setImagePreview("");
      toast({ title: "Service créé" });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, ...service }: Service) => {
      let finalService = { ...service };

      if (selectedImageFile) {
        const imageUrl = await uploadImage(selectedImageFile);
        finalService.imageUrl = imageUrl;
      }

      const response = await makeAuthenticatedRequest(
        `/api/admin/services/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalService),
        },
      );

      if (!response.ok) throw new Error("Failed to update service");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      setEditingService(null);
      setSelectedImageFile(null);
      setImagePreview("");
      toast({ title: "Service mis à jour" });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await makeAuthenticatedRequest(
        `/api/admin/services/${id}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete service");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      toast({ title: "Service supprimé" });
    },
  });

  // Product mutations
  const createProductMutation = useMutation({
    mutationFn: async (product: typeof newProduct) => {
      let finalProduct = { ...product, currency: "CAD" };

      if (selectedProductImageFile) {
        const imageUrl = await uploadImage(selectedProductImageFile);
        finalProduct.imageUrl = imageUrl;
      }

      const response = await makeAuthenticatedRequest("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalProduct),
      });

      if (!response.ok) throw new Error("Failed to create product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      setNewProduct({
        nameFr: "",
        nameEn: "",
        descriptionFr: "",
        descriptionEn: "",
        price: "",
        currency: "CAD",
        categoryId: 1,
        imageUrl: "",
        inStock: true,
      });
      setSelectedProductImageFile(null);
      setProductImagePreview("");
      toast({ title: "Produit créé" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...product }: Product) => {
      let finalProduct = { ...product, currency: "CAD" };

      if (selectedProductImageFile) {
        const imageUrl = await uploadImage(selectedProductImageFile);
        finalProduct.imageUrl = imageUrl;
      }

      const response = await makeAuthenticatedRequest(
        `/api/admin/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalProduct),
        },
      );

      if (!response.ok) throw new Error("Failed to update product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      setEditingProduct(null);
      setSelectedProductImageFile(null);
      setProductImagePreview("");
      toast({ title: "Produit mis à jour" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await makeAuthenticatedRequest(
        `/api/admin/products/${id}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete product");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({ title: "Produit supprimé" });
    },
  });

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedProductImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Exchange Rate Mutations
  const createExchangeRateMutation = useMutation({
    mutationFn: async (exchangeRateData: any) => {
      const response = await makeAuthenticatedRequest(
        "/api/admin/exchange-rates",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(exchangeRateData),
        },
      );

      if (!response.ok) throw new Error("Failed to create exchange rate");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/exchange-rates"],
      });
      toast({ title: "Taux de change ajouté avec succès" });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le taux de change",
        variant: "destructive",
      });
    },
  });

  const updateExchangeRateMutation = useMutation({
    mutationFn: async ({ id, ...exchangeRateData }: any) => {
      const response = await makeAuthenticatedRequest(
        `/api/admin/exchange-rates/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(exchangeRateData),
        },
      );

      if (!response.ok) throw new Error("Failed to update exchange rate");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/exchange-rates"],
      });
      toast({ title: "Taux de change modifié avec succès" });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le taux de change",
        variant: "destructive",
      });
    },
  });

  const deleteExchangeRateMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await makeAuthenticatedRequest(
        `/api/admin/exchange-rates/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete exchange rate");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/exchange-rates"],
      });
      toast({ title: "Taux de change supprimé avec succès" });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le taux de change",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/admin-login");
  };

  if (!isAdminAuthenticated()) {
    setLocation("/admin-login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Gisabo Admin</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        w-64 bg-white shadow-lg flex flex-col
        lg:relative lg:translate-x-0 lg:h-screen
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-lg lg:text-xl font-bold text-gray-900">Gisabo Admin</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <nav className="px-3 py-2 space-y-1 flex-1 overflow-y-auto">
          <button
            onClick={() => {
              setActiveSection("dashboard");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-sm ${
              activeSection === "dashboard"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <BarChart3 className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Tableau de Bord</span>
          </button>

          <button
            onClick={() => {
              setActiveSection("services");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-sm ${
              activeSection === "services"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Services</span>
          </button>

          <button
            onClick={() => {
              setActiveSection("products");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-sm ${
              activeSection === "products"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Package className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Produits</span>
          </button>

          <button
            onClick={() => {
              setActiveSection("rates");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors text-sm ${
              activeSection === "rates"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <TrendingUp className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Taux de Change</span>
          </button>
        </nav>

        <div className="p-3 border-t border-gray-200 flex-shrink-0">
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full flex items-center gap-2 text-sm"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full lg:w-auto overflow-y-auto pt-16 lg:pt-0">
        <div className="p-3 sm:p-4 lg:p-8">
          <div className="max-w-full lg:max-w-6xl mx-auto">
            {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Tableau de Bord
                </h2>
                <p className="text-gray-600">
                  Vue d'ensemble des activités et statistiques
                </p>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Transferts
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {dashboardStats?.totalTransfers || 0}
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Montant Total
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {dashboardStats?.totalAmount
                            ? `${parseFloat(dashboardStats.totalAmount).toLocaleString("fr-CA")} CAD`
                            : "0 CAD"}
                        </p>
                      </div>
                      <div className="p-2 bg-green-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Services Actifs
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {services?.filter((s: any) => s.isActive).length || 0}
                        </p>
                      </div>
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Settings className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Produits
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {products?.length || 0}
                        </p>
                      </div>
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Package className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transferts Récents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dashboardStats?.recentTransfers &&
                    dashboardStats.recentTransfers.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardStats.recentTransfers.map((transfer: any) => (
                          <div
                            key={transfer.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                {transfer.recipientName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {transfer.amount} {transfer.currency} →{" "}
                                {transfer.destinationCountry}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(
                                  transfer.createdAt,
                                ).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                            <Badge
                              variant={
                                transfer.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {transfer.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Aucun transfert récent</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Taux de Change Actifs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {exchangeRates && exchangeRates.length > 0 ? (
                      <div className="space-y-3">
                        {exchangeRates.map((rate: any) => (
                          <div
                            key={rate.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                {rate.fromCurrency} → {rate.toCurrency}
                              </p>
                              <p className="text-sm text-gray-600">
                                Taux: {rate.rate}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(rate.updatedAt).toLocaleDateString(
                                "fr-FR",
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Aucun taux de change configuré</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => setActiveSection("services")}
                      variant="outline"
                      className="h-12"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Gérer les Services
                    </Button>
                    <Button
                      onClick={() => setActiveSection("products")}
                      variant="outline"
                      className="h-12"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Gérer les Produits
                    </Button>
                    <Button
                      onClick={() => setActiveSection("rates")}
                      variant="outline"
                      className="h-12"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Taux de Change
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Services Section */}
          {activeSection === "services" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Services
                </h2>
                <p className="text-gray-600">
                  Gérez les services offerts par Gisabo
                </p>
              </div>

              {/* Add New Service */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    {editingService
                      ? "Modifier le Service"
                      : "Ajouter un Nouveau Service"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Section Français */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        🇫🇷 Version Française
                      </h3>
                      
                      <div>
                        <Label htmlFor="serviceNameFr">Nom du Service (FR)</Label>
                        <Input
                          id="serviceNameFr"
                          placeholder="Ex: Transfert d'argent"
                          value={
                            editingService
                              ? editingService.nameFr
                              : newService.nameFr
                          }
                          onChange={(e) => {
                            const nameFr = e.target.value;
                            const slug = nameFr
                              .toLowerCase()
                              .normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "")
                              .replace(/[^a-z0-9\s-]/g, "")
                              .replace(/\s+/g, "-")
                              .replace(/-+/g, "-")
                              .trim();

                            if (editingService) {
                              setEditingService({
                                ...editingService,
                                nameFr,
                                slug,
                              });
                            } else {
                              setNewService({ ...newService, nameFr, slug });
                            }
                          }}
                        />
                      </div>

                      <div>
                        <Label htmlFor="serviceShortDescFr">
                          Description Courte (FR)
                        </Label>
                        <Textarea
                          id="serviceShortDescFr"
                          placeholder="Description courte du service en français..."
                          value={
                            editingService
                              ? editingService.shortDescriptionFr
                              : newService.shortDescriptionFr
                          }
                          onChange={(e) => {
                            if (editingService) {
                              setEditingService({
                                ...editingService,
                                shortDescriptionFr: e.target.value,
                              });
                            } else {
                              setNewService({
                                ...newService,
                                shortDescriptionFr: e.target.value,
                              });
                            }
                          }}
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label htmlFor="serviceFullDescFr">
                          Description Complète (FR)
                        </Label>
                        <Textarea
                          id="serviceFullDescFr"
                          placeholder="Description complète du service en français..."
                          value={
                            editingService
                              ? editingService.fullDescriptionFr
                              : newService.fullDescriptionFr
                          }
                          onChange={(e) => {
                            if (editingService) {
                              setEditingService({
                                ...editingService,
                                fullDescriptionFr: e.target.value,
                              });
                            } else {
                              setNewService({
                                ...newService,
                                fullDescriptionFr: e.target.value,
                              });
                            }
                          }}
                          rows={4}
                        />
                      </div>
                    </div>

                    {/* Section Anglais */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                        🇺🇸 English Version
                      </h3>
                      
                      <div>
                        <Label htmlFor="serviceNameEn">Service Name (EN)</Label>
                        <Input
                          id="serviceNameEn"
                          placeholder="Ex: Money Transfer"
                          value={
                            editingService
                              ? editingService.nameEn
                              : newService.nameEn
                          }
                          onChange={(e) => {
                            if (editingService) {
                              setEditingService({
                                ...editingService,
                                nameEn: e.target.value,
                              });
                            } else {
                              setNewService({
                                ...newService,
                                nameEn: e.target.value,
                              });
                            }
                          }}
                        />
                      </div>

                      <div>
                        <Label htmlFor="serviceShortDescEn">
                          Short Description (EN)
                        </Label>
                        <Textarea
                          id="serviceShortDescEn"
                          placeholder="Short service description in English..."
                          value={
                            editingService
                              ? editingService.shortDescriptionEn
                              : newService.shortDescriptionEn
                          }
                          onChange={(e) => {
                            if (editingService) {
                              setEditingService({
                                ...editingService,
                                shortDescriptionEn: e.target.value,
                              });
                            } else {
                              setNewService({
                                ...newService,
                                shortDescriptionEn: e.target.value,
                              });
                            }
                          }}
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label htmlFor="serviceFullDescEn">
                          Full Description (EN)
                        </Label>
                        <Textarea
                          id="serviceFullDescEn"
                          placeholder="Complete service description in English..."
                          value={
                            editingService
                              ? editingService.fullDescriptionEn
                              : newService.fullDescriptionEn
                          }
                          onChange={(e) => {
                            if (editingService) {
                              setEditingService({
                                ...editingService,
                                fullDescriptionEn: e.target.value,
                              });
                            } else {
                              setNewService({
                                ...newService,
                                fullDescriptionEn: e.target.value,
                              });
                            }
                          }}
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="serviceImage">Image du Service</Label>
                        <div className="mt-2 space-y-3">
                          <Input
                            id="serviceImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <p className="text-xs text-gray-500">
                            Max 5MB, formats: JPG, PNG, GIF
                          </p>

                          {imagePreview && (
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={imagePreview}
                                alt="Aperçu"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => {
                                  setSelectedImageFile(null);
                                  setImagePreview("");
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}

                          {editingService?.imageUrl && !imagePreview && (
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={editingService.imageUrl}
                                alt="Image actuelle"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {editingService ? (
                          <>
                            <Button
                              onClick={() =>
                                updateServiceMutation.mutate(editingService)
                              }
                              disabled={
                                updateServiceMutation.isPending ||
                                !editingService.nameFr
                              }
                              className="flex-1"
                            >
                              {updateServiceMutation.isPending
                                ? "Modification..."
                                : "Modifier"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingService(null);
                                setSelectedImageFile(null);
                                setImagePreview("");
                              }}
                            >
                              Annuler
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() =>
                              createServiceMutation.mutate(newService)
                            }
                            disabled={
                              createServiceMutation.isPending ||
                              !newService.nameFr
                            }
                            className="flex-1"
                          >
                            {createServiceMutation.isPending
                              ? "Création..."
                              : "Créer le Service"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services List */}
              <Card>
                <CardHeader>
                  <CardTitle>Services Existants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services?.map((service: Service) => (
                      <div
                        key={service.id}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                      >
                        {service.imageUrl && (
                          <img
                            src={service.imageUrl}
                            alt={service.nameFr}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">
                                  {service.nameFr}
                                </h3>
                                <Badge
                                  variant={
                                    service.isActive ? "default" : "secondary"
                                  }
                                >
                                  {service.isActive ? "Actif" : "Inactif"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {service.shortDescriptionFr}
                              </p>
                              <p className="text-xs text-gray-500">
                                Slug: {service.slug}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingService(service);
                                  setSelectedImageFile(null);
                                  setImagePreview("");
                                }}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  deleteServiceMutation.mutate(service.id)
                                }
                                disabled={deleteServiceMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Section */}
          {activeSection === "products" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Produits
                </h2>
                <p className="text-gray-600">
                  Gérez les produits du marketplace
                </p>
              </div>

              {/* Add New Product */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    {editingProduct
                      ? "Modifier le Produit"
                      : "Ajouter un Nouveau Produit"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {/* Section Française */}
                      <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                        <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                          🇫🇷 Section Française
                        </h3>
                        <div>
                          <Label htmlFor="productNameFr">Nom du Produit (Français)</Label>
                          <Input
                            id="productNameFr"
                            placeholder="Ex: Café Burundi Premium"
                            value={
                              editingProduct
                                ? editingProduct.nameFr
                                : newProduct.nameFr
                            }
                            onChange={(e) => {
                              if (editingProduct) {
                                setEditingProduct({ ...editingProduct, nameFr: e.target.value });
                              } else {
                                setNewProduct({ ...newProduct, nameFr: e.target.value });
                              }
                            }}
                          />
                        </div>

                      </div>

                      {/* Section Anglaise */}
                      <div className="space-y-4 p-4 border border-green-200 rounded-lg bg-green-50">
                        <h3 className="font-semibold text-green-800 flex items-center gap-2">
                          🇺🇸 Section Anglaise
                        </h3>
                        <div>
                          <Label htmlFor="productNameEn">Product Name (English)</Label>
                          <Input
                            id="productNameEn"
                            placeholder="Ex: Premium Burundi Coffee"
                            value={
                              editingProduct
                                ? editingProduct.nameEn
                                : newProduct.nameEn
                            }
                            onChange={(e) => {
                              if (editingProduct) {
                                setEditingProduct({ ...editingProduct, nameEn: e.target.value });
                              } else {
                                setNewProduct({ ...newProduct, nameEn: e.target.value });
                              }
                            }}
                          />
                        </div>

                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="productPrice">Prix</Label>
                          <Input
                            id="productPrice"
                            type="number"
                            step="0.01"
                            placeholder="29.99"
                            value={
                              editingProduct
                                ? editingProduct.price
                                : newProduct.price
                            }
                            onChange={(e) => {
                              if (editingProduct) {
                                setEditingProduct({
                                  ...editingProduct,
                                  price: e.target.value,
                                });
                              } else {
                                setNewProduct({
                                  ...newProduct,
                                  price: e.target.value,
                                });
                              }
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="productCurrency">Devise</Label>
                          <Input
                            id="productCurrency"
                            value="CAD"
                            readOnly
                            disabled
                            className="bg-gray-50 text-gray-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="productImage">Image du Produit</Label>
                        <div className="mt-2 space-y-3">
                          <Input
                            id="productImage"
                            type="file"
                            accept="image/*"
                            onChange={handleProductImageChange}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <p className="text-xs text-gray-500">
                            Max 5MB, formats: JPG, PNG, GIF
                          </p>

                          {productImagePreview && (
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={productImagePreview}
                                alt="Aperçu"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute top-1 right-1 h-6 w-6 p-0"
                                onClick={() => {
                                  setSelectedProductImageFile(null);
                                  setProductImagePreview("");
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}

                          {editingProduct?.imageUrl && !productImagePreview && (
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={editingProduct.imageUrl}
                                alt="Image actuelle"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {editingProduct ? (
                          <>
                            <Button
                              onClick={() =>
                                updateProductMutation.mutate(editingProduct)
                              }
                              disabled={
                                updateProductMutation.isPending ||
                                (!editingProduct.nameFr && !editingProduct.nameEn)
                              }
                              className="flex-1"
                            >
                              {updateProductMutation.isPending
                                ? "Modification..."
                                : "Modifier"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingProduct(null);
                                setSelectedProductImageFile(null);
                                setProductImagePreview("");
                              }}
                            >
                              Annuler
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={() =>
                              createProductMutation.mutate(newProduct)
                            }
                            disabled={
                              createProductMutation.isPending ||
                              (!newProduct.nameFr && !newProduct.nameEn)
                            }
                            className="flex-1"
                          >
                            {createProductMutation.isPending
                              ? "Création..."
                              : "Créer le Produit"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products List */}
              <Card>
                <CardHeader>
                  <CardTitle>Produits Existants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products?.map((product: Product) => (
                      <div
                        key={product.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.nameFr}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                        )}
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-gray-900">
                              {product.nameFr}
                            </h3>
                            <Badge
                              variant={
                                product.inStock ? "default" : "secondary"
                              }
                            >
                              {product.inStock ? "En stock" : "Rupture"}
                            </Badge>
                          </div>
                          <p className="font-semibold text-green-600">
                            {product.price} {product.currency}
                          </p>

                          <div className="flex gap-2 pt-2 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Debug pour voir les propriétés disponibles
                                console.log("Product data:", product);
                                
                                // Adapter les anciennes données au nouveau format multilingue
                                const adaptedProduct = {
                                  ...product,
                                  nameFr: (product as any).name_fr || (product as any).nameFr || (product as any).name || "",
                                  nameEn: (product as any).name_en || (product as any).nameEn || "",
                                  descriptionFr: (product as any).description_fr || (product as any).descriptionFr || (product as any).description || "",
                                  descriptionEn: (product as any).description_en || (product as any).descriptionEn || ""
                                };
                                
                                console.log("Adapted product:", adaptedProduct);
                                setEditingProduct(adaptedProduct);
                                setSelectedProductImageFile(null);
                                setProductImagePreview("");
                              }}
                              className="flex-1 min-w-0"
                            >
                              <Edit3 className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Modifier</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                deleteProductMutation.mutate(product.id)
                              }
                              disabled={deleteProductMutation.isPending}
                              className="flex-1 min-w-0"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              <span className="hidden sm:inline">Supprimer</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Exchange Rates Section */}
          {activeSection === "rates" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Taux de Change
                </h2>
                <p className="text-gray-600">
                  Gérez les taux de change pour les transferts
                </p>
              </div>

              {/* Add New Exchange Rate Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter un Nouveau Taux</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(
                        e.target as HTMLFormElement,
                      );
                      const exchangeRateData = {
                        fromCurrency: formData.get("fromCurrency") as string,
                        toCurrency: formData.get("toCurrency") as string,
                        rate: formData.get("rate") as string,
                      };

                      createExchangeRateMutation.mutate(exchangeRateData);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="fromCurrency">Devise Source</Label>
                        <select
                          name="fromCurrency"
                          required
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Sélectionner...</option>
                          <option value="CAD">CAD (Dollar Canadien)</option>
                          <option value="CHF">CHF (Franc Suisse)</option>
                          <option value="SEK">SEK (Couronne Suédoise)</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="toCurrency">Devise Destination</Label>
                        <select
                          name="toCurrency"
                          required
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Sélectionner...</option>
                          <option value="BIF">BIF (Franc Burundais)</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="rate">Taux de Change</Label>
                        <Input
                          name="rate"
                          type="number"
                          step="0.01"
                          placeholder="Ex: 2850.50"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={createExchangeRateMutation.isPending}
                      className="w-full md:w-auto"
                    >
                      {createExchangeRateMutation.isPending
                        ? "Ajout en cours..."
                        : "Ajouter le Taux"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Current Exchange Rates List */}
              <Card>
                <CardHeader>
                  <CardTitle>Taux de Change Actuels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {exchangeRates && exchangeRates.length > 0 ? (
                      exchangeRates.map((rate: ExchangeRate) => (
                        <div
                          key={rate.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div>
                            <p className="font-semibold">
                              {rate.fromCurrency} → {rate.toCurrency}
                            </p>
                            <p className="text-sm text-gray-600">
                              Taux: {rate.rate}
                            </p>
                            <p className="text-xs text-gray-500">
                              Mis à jour:{" "}
                              {new Date(rate.updatedAt).toLocaleDateString(
                                "fr-FR",
                              )}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newRate = prompt(
                                  `Nouveau taux pour ${rate.fromCurrency} → ${rate.toCurrency}:`,
                                  rate.rate,
                                );
                                if (newRate && newRate !== rate.rate) {
                                  updateExchangeRateMutation.mutate({
                                    id: rate.id,
                                    fromCurrency: rate.fromCurrency,
                                    toCurrency: rate.toCurrency,
                                    rate: newRate,
                                  });
                                }
                              }}
                              disabled={updateExchangeRateMutation.isPending}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                if (
                                  confirm(
                                    `Êtes-vous sûr de vouloir supprimer le taux ${rate.fromCurrency} → ${rate.toCurrency} ?`,
                                  )
                                ) {
                                  deleteExchangeRateMutation.mutate(rate.id);
                                }
                              }}
                              disabled={deleteExchangeRateMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Aucun taux de change configuré</p>
                        <p className="text-sm">
                          Ajoutez un premier taux de change ci-dessus
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
