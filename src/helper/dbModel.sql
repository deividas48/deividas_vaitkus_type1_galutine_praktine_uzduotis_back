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
    is_published BOOLEAN NOT NULL DEFAULT TRUE
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

-- 'miestai' lentelės duomenų pildymas
INSERT INTO
    miestai (name, population, area)
VALUES
    ('Orlando', 316.081, 308),
    ('Salt lake city', 200.567, 285),
    ('Vilnius', 580.020, 401),
    ('Kaunas', 300.000, 150),
    ('Klaipėda', 150.000, 100),
    ('Washington, D.C.', 705.749, 177),
    ('Philadelphia', 1584.064, 369),
    ('Shirebrook', 13.000, 10),
    ('Švenčionys', 10.000, 5);

-- 'kategorijos' lentelės duomenų pildymas
INSERT INTO
    kateogrijos (name)
VALUES
    ('Kompiuteriai'),
    ('Laisvalaikio prekės'),
    ('Automobiliai'),
    ('Buitinė technika'),
    ('Kita');

-- 'vartotojai' lentelės duomenų pildymas
INSERT INTO
    vartotojai (name, email, password, avatar_url)
VALUES
    (
        'Jason S',
        'jason.s@gmail.com',
        'statham',
        'https://images.pexels.com/photos/7298423/pexels-photo-7298423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ),
    (
        'Will S',
        'will.s@gmail.com',
        'smith',
        'https://images.pexels.com/photos/4584608/pexels-photo-4584608.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ),
    (
        'Ronald Reagan',
        'ronald.reagan@mail.com',
        'reagan',
        'https://images.pexels.com/photos/41008/cowboy-ronald-reagan-cowboy-hat-hat-41008.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ),
    (
        'Zbignev J',
        'zbignevas.jedinskis@yandex.ru',
        'jedinskis',
        'https://images.pexels.com/photos/14431137/pexels-photo-14431137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    );

-- 'skelbimai' lentelės duomenų pildymas
INSERT INTO
    skelbimai (
        title,
        main_image_url,
        description,
        price,
        phone,
        type,
        town_id,
        user_id,
        category_id
    )
VALUES
    (
        'Macintosh 128K',
        'macintosh.png',
        'Parduodu Macintosh 128K kompiuterį. Kompiuteris naujas. RAM: 128KB, HDD: 20MB, CPU: 8MHz.',
        2494.99,
        '+37061234567',
        'sell',
        6,
        3,
        1
    ),
    (
        'Neuralyzer',
        'neauralizer.png',
        'Nuomoju Neuralyzer 1st gen. atminties šalinimo prietaisą. Prietaisas šalina atmintį gerai. Veikia ant žmonių, gyvūnų, bei naujagimių. Vietoje parodysiu kaip naudotis.',
        3000.00,
        '+37061234557',
        'rent',
        7,
        2,
        2
    ),
    (
        '2005 Audi A8 6.0 W12',
        'a8.png',
        'Parduodu Audi A8. Automobilis labai geros būklės. Naudojo garbaus amžiaus asmuo iki sodo ir atgal. Nematęs sniego, druskų, tepalo nevalgo. Kaina derinama vietoje.',
        15000.00,
        '+37064734567',
        'sell',
        8,
        1,
        3
    ),
    (
        'Muzikos diskai',
        'cd.png',
        'Perku CD su muzika. Tinka lenkiškas ir rusiškas popsas.',
        4.99,
        '+37061212567',
        'buy',
        9,
        4,
        4
    ),
    (
        'SIG SG 550',
        'gun.jpeg',
        'Perku SIG SG 550 Counter-Strike: Global Offensive žaidimo atvaizdą.',
        19.99,
        '+37064734567',
        'buy',
        8,
        1,
        5
    );

-- 'skelbimai' lentelės duomenų pildymas
ALTER TABLE
    skelbimai
ADD
    COLUMN main_image_url_1 VARCHAR(1000),
ADD
    COLUMN main_image_url_2 VARCHAR(1000),
ADD
    COLUMN main_image_url_3 VARCHAR(1000);

-- Add two aditional columns to 'vartotojai' table 
ALTER TABLE
    `vartotojai`
ADD
    `user_city` VARCHAR(24) NOT NULL
AFTER
    `password`,
ADD
    `user_phone` VARCHAR(20) NOT NULL
AFTER
    `user_city`;

-- Create 6 more columns for listings images
ALTER TABLE
    `skelbimai`
ADD
    `main_image_url_4` VARCHAR(80) NULL DEFAULT NULL
AFTER
    `main_image_url_3`,
ADD
    `main_image_url_5` VARCHAR(80) NULL DEFAULT NULL
AFTER
    `main_image_url_4`,
ADD
    `main_image_url_6` VARCHAR(80) NULL DEFAULT NULL
AFTER
    `main_image_url_5`,
ADD
    `main_image_url_7` VARCHAR(80) NULL DEFAULT NULL
AFTER
    `main_image_url_6`,
ADD
    `main_image_url_8` VARCHAR(80) NULL DEFAULT NULL
AFTER
    `main_image_url_7`,
ADD
    `main_image_url_9` VARCHAR(80) NULL DEFAULT NULL
AFTER
    `main_image_url_8`;