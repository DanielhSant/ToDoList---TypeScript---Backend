const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ToDoList',
  password: 'Daniel120',
  port: 5433,
});


/* Criação da tabela
const createAfazeresTable = `
CREATE TABLE Afazeres (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  afazer TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (email) REFERENCES Usuarios(email)
  );
`;

// Executa a query para criar a tabela
pool.query(createAfazeresTable, (err, res) => {
  if (err) {
    console.error('Erro ao criar a tabela de Afazeres:', err);
  } else {
    console.log('Tabela de Afazeres criada com sucesso!');
  }
});
*/

module.exports = { pool }