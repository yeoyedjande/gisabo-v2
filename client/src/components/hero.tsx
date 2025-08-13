import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
      {/* African pattern background */}
      <div className="absolute inset-0 opacity-10 african-pattern"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins leading-tight mb-6">
              <span className="text-secondary"> Gisabo</span>
            </h1>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/fonctionnement">
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all shadow-lg"
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  {t("nav.howItWorks")}
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
                >
                  <i className="fas fa-shopping-cart mr-2"></i>
                  {t("hero.marketplaceButton")}
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm text-gray-200">
              <div className="flex items-center space-x-2">
                <i className="fas fa-shield-alt text-secondary"></i>
                <span>{t("hero.secured")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-clock text-secondary"></i>
                <span>{t("hero.instant")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-globe text-secondary"></i>
                <span>{t("hero.global")}</span>
              </div>
            </div>
          </div>

          <div className="animate-slide-up">
            {/* Financial dashboard preview */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800 font-semibold">
                  {t("hero.recentPayment")}
                </h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {t("hero.completed")}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>{t("hero.productName")}</span>
                  <span className="font-medium text-gray-800">
                    {t("hero.meatProduct")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t("hero.amount")}</span>
                  <span className="font-bold text-primary text-lg">50 CAD</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t("hero.fees")}</span>
                  <span className="font-medium text-gray-800">0 CAD</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-gray-800 font-medium">
                    {t("hero.received")}
                  </span>
                  <span className="font-bold text-accent text-lg">
                    150 000 BIF
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
