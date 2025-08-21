-- 🗄️ Script d'initialisation de la base de données pour GISABO
-- Ce script sera exécuté automatiquement lors du premier déploiement

-- Création des extensions PostgreSQL nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table pour les sessions (requis pour l'authentification)
CREATE TABLE IF NOT EXISTS "sessions" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
) WITH (OIDS=FALSE);

ALTER TABLE "sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "sessions" ("expire");

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS "users" (
    "id" serial PRIMARY KEY,
    "username" varchar(255) UNIQUE NOT NULL,
    "email" varchar(255) UNIQUE NOT NULL,
    "password" varchar(255) NOT NULL,
    "firstName" varchar(255),
    "lastName" varchar(255),
    "phone" varchar(50),
    "address" text,
    "isVerified" boolean DEFAULT false,
    "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Table des administrateurs
CREATE TABLE IF NOT EXISTS "admins" (
    "id" serial PRIMARY KEY,
    "username" varchar(255) UNIQUE NOT NULL,
    "email" varchar(255) UNIQUE NOT NULL,
    "password" varchar(255) NOT NULL,
    "firstName" varchar(255),
    "lastName" varchar(255),
    "role" varchar(50) DEFAULT 'admin',
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Table des catégories de produits
CREATE TABLE IF NOT EXISTS "categories" (
    "id" serial PRIMARY KEY,
    "name" varchar(255) NOT NULL,
    "description" text,
    "image" varchar(500),
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Table des produits
CREATE TABLE IF NOT EXISTS "products" (
    "id" serial PRIMARY KEY,
    "name" varchar(255) NOT NULL,
    "description" text,
    "price" decimal(10,2) NOT NULL,
    "currency" varchar(3) DEFAULT 'CAD',
    "images" text[],
    "category_id" integer REFERENCES "categories"("id"),
    "stock" integer DEFAULT 0,
    "isActive" boolean DEFAULT true,
    "featured" boolean DEFAULT false,
    "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Table des services
CREATE TABLE IF NOT EXISTS "services" (
    "id" serial PRIMARY KEY,
    "name" varchar(255) NOT NULL,
    "description" text,
    "price" decimal(10,2),
    "currency" varchar(3) DEFAULT 'CAD',
    "image" varchar(500),
    "category" varchar(255),
    "isActive" boolean DEFAULT true,
    "featured" boolean DEFAULT false,
    "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Table des transferts d'argent
CREATE TABLE IF NOT EXISTS "transfers" (
    "id" serial PRIMARY KEY,
    "userId" integer REFERENCES "users"("id"),
    "recipientName" varchar(255) NOT NULL,
    "recipientPhone" varchar(50) NOT NULL,
    "recipientCountry" varchar(255) NOT NULL,
    "amount" decimal(10,2) NOT NULL,
    "currency" varchar(3) NOT NULL,
    "exchangeRate" decimal(10,6),
    "finalAmount" decimal(10,2),
    "finalCurrency" varchar(3),
    "fees" decimal(10,2) DEFAULT 0,
    "paymentMethod" varchar(100),
    "paymentId" varchar(255),
    "status" varchar(50) DEFAULT 'pending',
    "transactionRef" varchar(255) UNIQUE,
    "notes" text,
    "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS "orders" (
    "id" serial PRIMARY KEY,
    "userId" integer REFERENCES "users"("id"),
    "orderNumber" varchar(255) UNIQUE NOT NULL,
    "status" varchar(50) DEFAULT 'pending',
    "total" decimal(10,2) NOT NULL,
    "currency" varchar(3) DEFAULT 'CAD',
    "paymentMethod" varchar(100),
    "paymentId" varchar(255),
    "shippingAddress" text,
    "billingAddress" text,
    "notes" text,
    "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Table des articles de commande
CREATE TABLE IF NOT EXISTS "order_items" (
    "id" serial PRIMARY KEY,
    "orderId" integer REFERENCES "orders"("id") ON DELETE CASCADE,
    "productId" integer REFERENCES "products"("id"),
    "quantity" integer NOT NULL DEFAULT 1,
    "price" decimal(10,2) NOT NULL,
    "total" decimal(10,2) NOT NULL,
    "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Table des taux de change
CREATE TABLE IF NOT EXISTS "exchange_rates" (
    "id" serial PRIMARY KEY,
    "fromCurrency" varchar(3) NOT NULL,
    "toCurrency" varchar(3) NOT NULL,
    "rate" decimal(10,6) NOT NULL,
    "lastUpdated" timestamp DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("fromCurrency", "toCurrency")
);

-- Insertion des données initiales

-- Catégories par défaut
INSERT INTO "categories" ("name", "description", "image") VALUES
('Alimentation', 'Produits alimentaires africains authentiques', '/images/categories/food.jpg'),
('Vêtements', 'Mode et textile africain traditionnel et moderne', '/images/categories/clothing.jpg'),
('Artisanat', 'Objets d\'art et artisanat africain', '/images/categories/crafts.jpg'),
('Cosmétiques', 'Produits de beauté et soins naturels africains', '/images/categories/cosmetics.jpg')
ON CONFLICT DO NOTHING;

-- Administrateur par défaut
INSERT INTO "admins" ("username", "email", "password", "firstName", "lastName", "role") VALUES
('admin', 'admin@gisabo.com', '$2b$10$hash_password_here', 'Admin', 'GISABO', 'super_admin')
ON CONFLICT DO NOTHING;

-- Taux de change par défaut
INSERT INTO "exchange_rates" ("fromCurrency", "toCurrency", "rate") VALUES
('CAD', 'XOF', 400.00),
('CAD', 'EUR', 0.68),
('CAD', 'USD', 0.74),
('USD', 'XOF', 540.00),
('EUR', 'XOF', 655.00)
ON CONFLICT ("fromCurrency", "toCurrency") DO NOTHING;

-- Services par défaut
INSERT INTO "services" ("name", "description", "price", "category") VALUES
('Transfert d''argent express', 'Envoi d''argent rapide vers l''Afrique', 5.99, 'Transfert'),
('Organisation d''événements', 'Services d''organisation d''événements culturels', 500.00, 'Événementiel'),
('Consultation business', 'Conseil en développement des affaires Afrique-Canada', 150.00, 'Consulting')
ON CONFLICT DO NOTHING;

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "idx_users_username" ON "users" ("username");
CREATE INDEX IF NOT EXISTS "idx_products_category" ON "products" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_products_active" ON "products" ("isActive");
CREATE INDEX IF NOT EXISTS "idx_transfers_user" ON "transfers" ("userId");
CREATE INDEX IF NOT EXISTS "idx_transfers_status" ON "transfers" ("status");
CREATE INDEX IF NOT EXISTS "idx_orders_user" ON "orders" ("userId");
CREATE INDEX IF NOT EXISTS "idx_orders_status" ON "orders" ("status");

-- Triggers pour mettre à jour automatiquement les timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer les triggers sur les tables appropriées
DROP TRIGGER IF EXISTS update_users_updated_at ON "users";
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admins_updated_at ON "admins";
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON "admins" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON "categories";
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON "categories" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON "products";
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON "products" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON "services";
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON "services" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transfers_updated_at ON "transfers";
CREATE TRIGGER update_transfers_updated_at BEFORE UPDATE ON "transfers" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON "orders";
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON "orders" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Commentaires pour documentation
COMMENT ON TABLE "users" IS 'Table des utilisateurs de la plateforme GISABO';
COMMENT ON TABLE "admins" IS 'Table des administrateurs avec différents niveaux d''accès';
COMMENT ON TABLE "products" IS 'Catalogue des produits africains disponibles';
COMMENT ON TABLE "services" IS 'Services offerts par GISABO';
COMMENT ON TABLE "transfers" IS 'Historique des transferts d''argent';
COMMENT ON TABLE "orders" IS 'Commandes de produits des utilisateurs';
COMMENT ON TABLE "exchange_rates" IS 'Taux de change pour les conversions monétaires';

-- Fin du script d'initialisation