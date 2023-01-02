-- @block
ALTER TABLE users_final
ADD source VARCHAR(255);

-- @block
UPDATE users_final SET subscribe = false WHERE email = 'fathurrazanq@gmail.com'

-- @block
UPDATE users_final SET invited = false WHERE id = 11

-- @block
UPDATE users_final SET subscribe = true WHERE id = 50

-- @block
INSERT INTO users_final (id, firstname, lastname, email, whatsapp, registerdate, invited, parentid, subscribe)
VALUES (50, 'Fikri', 'Anray', 'fikri.anray@gmail.com', '+6281356749007', '2022-11-28', false, NULL, true);

-- @block
UPDATE users_final SET source='website'

-- @block
DELETE FROM users_final WHERE id=55;