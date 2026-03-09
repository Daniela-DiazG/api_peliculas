CREATE DATABASE peliculas_db;

USE peliculas_db;
CREATE TABLE genero (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    estado BOOLEAN DEFAULT TRUE,
    descripcion TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME
);

CREATE TABLE director (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(150),
    estado BOOLEAN DEFAULT TRUE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME
);

CREATE TABLE productora (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150),
    estado BOOLEAN DEFAULT TRUE,
    slogan VARCHAR(255),
    descripcion TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME
);

CREATE TABLE tipo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME
);

CREATE TABLE media (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serial VARCHAR(100) UNIQUE,
    titulo VARCHAR(255),
    sinopsis TEXT,
    url VARCHAR(255) UNIQUE,
    imagen VARCHAR(255),
    anio_estreno INT,
    genero_id INT,
    director_id INT,
    productora_id INT,
    tipo_id INT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME,

    FOREIGN KEY (genero_id) REFERENCES genero(id),
    FOREIGN KEY (director_id) REFERENCES director(id),
    FOREIGN KEY (productora_id) REFERENCES productora(id),
    FOREIGN KEY (tipo_id) REFERENCES tipo(id)
);