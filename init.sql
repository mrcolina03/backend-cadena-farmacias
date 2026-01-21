CREATE DATABASE IF NOT EXISTS catalogo_db;
CREATE DATABASE IF NOT EXISTS inventario_db;
CREATE DATABASE IF NOT EXISTS ventas_db;

create table if not exists users (
                                     username varchar(50) primary key,
    password varchar(100) not null,
    enabled boolean not null
    );

create table if not exists authorities (
                                           username varchar(50) not null,
    authority varchar(50) not null,
    constraint fk_authorities_users foreign key(username) references users(username),
    constraint ix_auth_username unique (username, authority)
    );

-- Ejemplo de usuario (password = "12345" en bcrypt)
-- Genera bcrypt con: https://bcrypt-generator.com/ (o con tu app)
insert into users(username,password,enabled)
values ('admin', '{bcrypt}$2a$10$wJQ0zqTg7oZ3wQWJm7mQ4e8m9yqYQeWw8nE2l8f2o0pG9yXqY0r7S', true)
    on conflict do nothing;

insert into authorities(username,authority)
values ('admin','ROLE_ADMIN'),
       ('admin','ROLE_INVENTORY'),
       ('admin','ROLE_ORDERS')
    on conflict do nothing;
