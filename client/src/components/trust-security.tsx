import { useLanguage } from "@/lib/i18n";

export default function TrustSecurity() {
  const { language } = useLanguage();
  
  const translations = {
    fr: {
      title: "Sécurité & Confiance",
      subtitle: "Votre sécurité est notre priorité absolue. Nous utilisons les technologies les plus avancées pour protéger vos transactions.",
      ssl: { title: "Cryptage SSL 256-bit", description: "Même niveau de sécurité que les banques internationales" },
      licensed: { title: "Licencié & Régulé", description: "Autorisé par les autorités financières compétentes" },
      monitoring: { title: "Surveillance 24/7", description: "Monitoring continu des transactions pour détecter les fraudes" },
      support: { title: "Support 24/7", description: "Équipe d'assistance dédiée disponible à tout moment" },
      pciCompliant: "PCI DSS Compliant",
      squarePartner: "Square Partner",
      bankSecurity: "Bank-Level Security"
    },
    en: {
      title: "Security & Trust",
      subtitle: "Your security is our absolute priority. We use the most advanced technologies to protect your transactions.",
      ssl: { title: "256-bit SSL Encryption", description: "Same level of security as international banks" },
      licensed: { title: "Licensed & Regulated", description: "Authorized by competent financial authorities" },
      monitoring: { title: "24/7 Monitoring", description: "Continuous transaction monitoring to detect fraud" },
      support: { title: "24/7 Support", description: "Dedicated assistance team available at all times" },
      pciCompliant: "PCI DSS Compliant",
      squarePartner: "Square Partner",
      bankSecurity: "Bank-Level Security"
    }
  } as const;

  const t = translations[language as keyof typeof translations];
  
  const features = [
    {
      icon: "fas fa-shield-alt",
      title: t.ssl.title,
      description: t.ssl.description,
      color: "primary",
    },
    {
      icon: "fas fa-certificate",
      title: t.licensed.title,
      description: t.licensed.description,
      color: "secondary",
    },
    {
      icon: "fas fa-eye",
      title: t.monitoring.title,
      description: t.monitoring.description,
      color: "accent",
    },
    {
      icon: "fas fa-headset",
      title: t.support.title,
      description: t.support.description,
      color: "green",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      primary: "bg-primary/10 text-primary",
      secondary: "bg-secondary/10 text-secondary",
      accent: "bg-accent/10 text-accent",
      green: "bg-green-100 text-green-500",
    };
    return colorMap[color] || "bg-gray-100 text-gray-500";
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-4">
            {t.title.split(' & ')[0]} & <span className="text-primary">{t.title.split(' & ')[1]}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${getColorClasses(feature.color)} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <i className={`${feature.icon} text-2xl`}></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-poppins">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Security Badges */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-70">
          <div className="flex items-center space-x-2">
            <i className="fas fa-shield-check text-2xl text-primary"></i>
            <span className="font-semibold text-gray-700">{t.pciCompliant}</span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fab fa-square text-2xl text-primary"></i>
            <span className="font-semibold text-gray-700">{t.squarePartner}</span>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-lock text-2xl text-primary"></i>
            <span className="font-semibold text-gray-700">{t.bankSecurity}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
