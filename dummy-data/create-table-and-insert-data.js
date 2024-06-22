const pool = require('./db'); // Assuming database.js is in the same directory

async function createTablesAndInsertData() {
  try {
    // Create tables if they do not exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        photo VARCHAR(255),
        role ENUM('user', 'admin') DEFAULT 'user'
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(255) NOT NULL,
        release_year YEAR NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS actors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        birthdate DATE NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS directors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        birthdate DATE NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS movie_actors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        movie_id INT,
        actor_id INT,
        FOREIGN KEY (movie_id) REFERENCES movies(id),
        FOREIGN KEY (actor_id) REFERENCES actors(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS movie_directors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        movie_id INT,
        director_id INT,
        FOREIGN KEY (movie_id) REFERENCES movies(id),
        FOREIGN KEY (director_id) REFERENCES directors(id)
      );
    `);

    console.log('Tables created successfully.');

    // Insert dummy data into tables
    await pool.query(`
      INSERT INTO users (name, email, password, photo, role) VALUES
      ('Alice', 'alice@example.com', 'password123', 'alice.jpg', 'admin'),
      ('Bob', 'bob@example.com', 'password456', 'bob.jpg', 'user'),
      ('Charlie', 'charlie@example.com', 'password789', 'charlie.jpg', 'user');
    `);

    await pool.query(`
      INSERT INTO movies (title, genre, release_year) VALUES
      ('Inception', 'Sci-Fi', 2010),
      ('Bodyguard', 'Action', 2010),
      ('The Dark Knight', 'Action', 2008),
      ('Pulp Fiction', 'Crime', 1994);
    `);

    await pool.query(`
      INSERT INTO actors (name, birthdate) VALUES
      ('Leonardo DiCaprio', '1974-11-11'),
      ('Christian Bale', '1974-01-30'),
      ('John Travolta', '1954-02-18');
    `);

    await pool.query(`
      INSERT INTO directors (name, birthdate) VALUES
      ('Christopher Nolan', '1970-07-30'),
      ('Quentin Tarantino', '1963-03-27');
    `);

    await pool.query(`
      INSERT INTO movie_actors (movie_id, actor_id) VALUES
      (1, 1), -- Inception - Leonardo DiCaprio
      (2, 2), -- The Dark Knight - Christian Bale
      (3, 3); -- Pulp Fiction - John Travolta
    `);

    await pool.query(`
      INSERT INTO movie_directors (movie_id, director_id) VALUES
      (1, 1), -- Inception - Christopher Nolan
      (2, 1), -- The Dark Knight - Christopher Nolan
      (3, 2); -- Pulp Fiction - Quentin Tarantino
    `);

    console.log('Dummy data inserted successfully.');
  } catch (error) {
    console.error('Error creating tables or inserting data:', error);
  } finally {
    // Close the connection pool after all queries
    pool.end();
  }
}

// Call the function to create tables and insert data
createTablesAndInsertData();
