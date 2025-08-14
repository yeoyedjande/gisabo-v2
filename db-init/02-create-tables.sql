-- Script d'initialisation des tables pour GISABO
-- Ce script est exécuté automatiquement lors de la première création de la base de données

-- Extensions PostgreSQL nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Création des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_transfers_user_id ON transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON transfers(status);
CREATE INDEX IF NOT EXISTS idx_transfers_created_at ON transfers(created_at);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);

CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_is_active ON admins(is_active);

-- Contraintes de vérification
ALTER TABLE transfers ADD CONSTRAINT check_transfer_amount_positive 
    CHECK (CAST(amount AS DECIMAL) > 0);

ALTER TABLE transfers ADD CONSTRAINT check_transfer_amount_received_positive 
    CHECK (CAST(amount_received AS DECIMAL) > 0);

ALTER TABLE orders ADD CONSTRAINT check_order_total_positive 
    CHECK (CAST(total AS DECIMAL) > 0);

ALTER TABLE order_items ADD CONSTRAINT check_order_item_quantity_positive 
    CHECK (quantity > 0);

ALTER TABLE order_items ADD CONSTRAINT check_order_item_price_positive 
    CHECK (CAST(price AS DECIMAL) > 0);

ALTER TABLE products ADD CONSTRAINT check_product_price_positive 
    CHECK (CAST(price AS DECIMAL) > 0);

-- Triggers pour la mise à jour automatique des timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Application des triggers sur les tables qui ont une colonne updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transfers_updated_at BEFORE UPDATE ON transfers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exchange_rates_updated_at BEFORE UPDATE ON exchange_rates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertion des données de base si elles n'existent pas déjà
INSERT INTO categories (id, name, name_fr, description, description_fr, icon) 
VALUES 
    (1, 'Electronics', 'Électronique', 'Electronic devices and accessories', 'Appareils électroniques et accessoires', '📱'),
    (2, 'Fashion', 'Mode', 'Clothing and fashion items', 'Vêtements et articles de mode', '👕'),
    (3, 'Home & Garden', 'Maison & Jardin', 'Home improvement and garden items', 'Articles pour la maison et le jardin', '🏠'),
    (4, 'Food', 'Alimentation', 'Food and beverages', 'Nourriture et boissons', '🍽️'),
    (5, 'Health & Beauty', 'Santé & Beauté', 'Health and beauty products', 'Produits de santé et de beauté', '💄')
ON CONFLICT (id) DO NOTHING;

-- Mise à jour de la séquence des catégories
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- Insertion des taux de change par défaut
INSERT INTO exchange_rates (from_currency, to_currency, rate) 
VALUES 
    ('CAD', 'BIF', '2650.00'),
    ('USD', 'BIF', '2850.00'),
    ('EUR', 'BIF', '3100.00')
ON CONFLICT (from_currency, to_currency) DO UPDATE SET
    rate = EXCLUDED.rate,
    updated_at = CURRENT_TIMESTAMP;

-- Fonction pour nettoyer les anciennes sessions (optionnel)
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM sessions WHERE expire < NOW();
END;
$$ LANGUAGE plpgsql;