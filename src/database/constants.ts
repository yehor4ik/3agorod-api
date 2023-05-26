export const INITIALIZATION_POSTGRESQL_DB = `
    CREATE TABLE IF NOT EXISTS Collection
    (
        id              SERIAL PRIMARY KEY,
        name            VARCHAR(255) NOT NULL,
        background_image TEXT
    );

    CREATE TABLE IF NOT EXISTS Image
    (
        id  SERIAL PRIMARY KEY,
        url TEXT
    );

    CREATE TABLE IF NOT EXISTS Price
    (
        id       SERIAL PRIMARY KEY,
        value    NUMERIC,
        currency VARCHAR(3) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Stock
    (
        id       SERIAL PRIMARY KEY,
        size     VARCHAR(2) NOT NULL,
        quantity INTEGER,
        price_id  INTEGER,
        FOREIGN KEY (price_id) REFERENCES Price (id)
    );

    CREATE TABLE IF NOT EXISTS Product
    (
        id           SERIAL PRIMARY KEY,
        name         VARCHAR(255) NOT NULL,
        description  TEXT,
        image_id      INTEGER,
        stock_id      INTEGER,
        collection_id INTEGER,
        FOREIGN KEY (stock_id) REFERENCES Stock (id),
        FOREIGN KEY (image_id) REFERENCES Image (id),
        FOREIGN KEY (collection_id) REFERENCES Collection (id)
    );
`;
