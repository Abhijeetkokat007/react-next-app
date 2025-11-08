INSERT INTO personDB (name, city) VALUES
('AB', 'Nashik'),
('MK', 'Nagpur')
ON CONFLICT DO NOTHING;
