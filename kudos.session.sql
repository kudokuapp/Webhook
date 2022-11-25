-- @block
ALTER TABLE users_final
ADD parentid INT;

-- @block
UPDATE users_final SET subscribe = false WHERE email = 'fathurrazanq@gmail.com'

-- @block
UPDATE users_final SET invited = false WHERE id = 11

-- @block
UPDATE users_final SET subscribe = true WHERE id = 45