-- create table personDB
CREATE TABLE IF NOT EXISTS personDB (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT now()
);
