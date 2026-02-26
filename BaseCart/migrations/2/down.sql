
DROP INDEX idx_orders_business;
ALTER TABLE orders DROP COLUMN business_id;
DROP INDEX idx_businesses_owner;
DROP INDEX idx_businesses_slug;
DROP TABLE businesses;
