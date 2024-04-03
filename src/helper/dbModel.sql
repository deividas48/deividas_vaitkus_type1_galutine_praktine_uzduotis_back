-- Skelbimai lentlė
CREATE TABLE skelbimai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    main_image_url VARCHAR(1000),
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    type ENUM ('sell', 'buy', 'rent') NOT NULL,
    town_id INT NOT NULL,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN NOT NULL DEFAULT FALSE
);

-- Miestai lentelė
CREATE TABLE miestai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    population INT NOT NULL,
    area DECIMAL(10, 0) NOT NULL
);

-- Vartotojai lentelė
CREATE TABLE vartotojai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kategorijos lentelė
CREATE TABLE kateogrijos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);