
CREATE TABLE businesses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner_user_id TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#FF6B35',
  secondary_color TEXT DEFAULT '#1A4D3E',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_owner ON businesses(owner_user_id);

ALTER TABLE orders ADD COLUMN business_id INTEGER;
CREATE INDEX idx_orders_business ON orders(business_id);
