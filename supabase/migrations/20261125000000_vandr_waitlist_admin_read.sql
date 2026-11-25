-- Administrace webu (/admin) čte waiting list tajným klíčem (role service_role). Jen čtení.
grant select on vandr.waitlist to service_role;
