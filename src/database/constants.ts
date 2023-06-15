export const INITIALIZATION_POSTGRESQL_DB = `
    CREATE TABLE IF NOT EXISTS Users
    (
        id              SERIAL PRIMARY KEY,
        email            VARCHAR(255) NOT NULL UNIQUE,
        name            VARCHAR(255) NOT NULL,
        password          VARCHAR(255) NOT NULL,
        created_at        DATE,
        updated_at        DATE
    );

    CREATE TABLE IF NOT EXISTS Image
    (
        id  SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        filename VARCHAR(255) NOT NULL,
        size INTEGER NOT NULL,
        created_at        DATE,
        updated_at        DATE
    );

    CREATE TABLE IF NOT EXISTS Collection
    (
        id              SERIAL PRIMARY KEY,
        name            VARCHAR(255) NOT NULL,
        background_id    INTEGER,
        created_at        DATE,
        updated_at        DATE,
        FOREIGN KEY (background_id) REFERENCES Image (id)
    );

    CREATE TABLE IF NOT EXISTS Price
    (
        id       SERIAL PRIMARY KEY,
        value    NUMERIC NOT NULL,
        currency VARCHAR(3) CHECK ( currency IN ('USD', 'EUR', 'UAH')) NOT NULL,
        created_at        DATE,
        updated_at        DATE
    );

    CREATE TABLE IF NOT EXISTS Stock
    (
        id       SERIAL PRIMARY KEY,
        size     VARCHAR(2) CHECK ( size IN ('XS', 'S', 'M', 'L', 'XL')) NOT NULL,
        quantity INTEGER DEFAULT 0,
        created_at        DATE,
        updated_at        DATE
    );

    CREATE TABLE IF NOT EXISTS Product
    (
        id           SERIAL PRIMARY KEY,
        name         VARCHAR(255) NOT NULL,
        description  TEXT,
        image_id      INTEGER,
        stock_id      INTEGER,
        collection_id INTEGER,
        created_at        DATE,
        updated_at        DATE,
        FOREIGN KEY (stock_id) REFERENCES Stock (id),
        FOREIGN KEY (image_id) REFERENCES Image (id),
        FOREIGN KEY (collection_id) REFERENCES Collection (id)
    );
`;
