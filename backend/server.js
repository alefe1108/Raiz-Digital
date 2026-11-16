const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Carrega variáveis de ambiente do .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// CONEXÃO COM MYSQL (Pool de conexões)
// =====================================================
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'raiz_digital',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testa a conexão ao iniciar
async function testarConexao() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL conectado!');
    console.log(`📁 Banco: ${process.env.DB_NAME} @ ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    conn.release();
  } catch (erro) {
    console.error('❌ Erro ao conectar no MySQL:');
    console.error('   Verifique se o MySQL está rodando e as credenciais no .env');
    console.error('   Erro:', erro.message);
    process.exit(1);
  }
}

// Cria a tabela se não existir
async function inicializarBanco() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        contato VARCHAR(20),
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela "usuarios" verificada/criada');
  } catch (erro) {
    console.error('❌ Erro ao criar tabela:', erro.message);
  }
}

// =====================================================
// ROTAS DA API
// =====================================================

// POST /api/cadastro - Cadastrar novo usuário
app.post('/api/cadastro', async (req, res) => {
  let conn;
  try {
    const { nome, email, senha, ConfirmaSenha, Contato } = req.body;

    // Validações
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
    }
    if (senha !== ConfirmaSenha) {
      return res.status(400).json({ erro: 'As senhas não coincidem.' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    conn = await pool.getConnection();

    // Verifica se email já existe
    const [existe] = await conn.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existe.length > 0) {
      conn.release();
      return res.status(400).json({ erro: 'Este e-mail já está cadastrado.' });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Insere no banco
    const [resultado] = await conn.query(
      'INSERT INTO usuarios (nome, email, senha, contato) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, Contato || '']
    );
    conn.release();

    console.log('✅ Novo usuário cadastrado:', { id: resultado.insertId, nome, email });

    res.status(201).json({
      mensagem: 'Cadastro realizado com sucesso!',
      usuario: { id: resultado.insertId, nome, email }
    });

  } catch (erro) {
    if (conn) conn.release();
    console.error('❌ Erro no cadastro:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// POST /api/login - Fazer login
app.post('/api/login', async (req, res) => {
  let conn;
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    conn = await pool.getConnection();

    // Busca usuário
    const [usuarios] = await conn.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    conn.release();

    if (usuarios.length === 0) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const usuario = usuarios[0];

    // Compara senha com hash
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    // Login OK - retorna sem a senha
    const { senha: _, ...usuarioSeguro } = usuario;

    console.log('✅ Login realizado:', { id: usuario.id, nome: usuario.nome, email: usuario.email });

    res.json({
      mensagem: 'Login realizado com sucesso!',
      usuario: usuarioSeguro
    });

  } catch (erro) {
    if (conn) conn.release();
    console.error('❌ Erro no login:', erro);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// GET /api/usuarios - Listar todos (debug)
app.get('/api/usuarios', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [usuarios] = await conn.query('SELECT id, nome, email, contato, data_cadastro FROM usuarios');
    conn.release();
    res.json({ usuarios });
  } catch (erro) {
    if (conn) conn.release();
    console.error('❌ Erro ao listar:', erro);
    res.status(500).json({ erro: 'Erro interno.' });
  }
});

// Inicia servidor após testar conexão e criar tabela
async function iniciar() {
  await testarConexao();
  await inicializarBanco();

  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║  🌱 RAIZ DIGITAL - Backend MySQL rodando!             ║
║                                                       ║
║  📡 Servidor: http://localhost:${PORT}                   ║
║  🔗 API Cadastro: POST http://localhost:${PORT}/api/cadastro ║
║  🔗 API Login:    POST http://localhost:${PORT}/api/login    ║
║  🔗 Ver usuários: GET  http://localhost:${PORT}/api/usuarios ║
║                                                       ║
║  🗄️  Banco: MySQL (${process.env.DB_NAME})                   ║
║  🔐 Senhas: bcrypt hash                               ║
║                                                       ║
║  Pressione Ctrl+C para parar                          ║
╚═══════════════════════════════════════════════════════╝
    `);
  });
}

iniciar();