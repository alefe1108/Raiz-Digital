# Raiz Digital - Backend

Backend simples em Node.js/Express para login e cadastro com banco de dados JSON.

## 🚀 Como rodar

```bash
# 1. Entre na pasta do backend
cd backend

# 2. Instale as dependências (só precisa fazer uma vez)
npm install

# 3. Inicie o servidor
npm start
# ou
node server.js
```

O servidor vai rodar em: **http://localhost:3001**

## 📡 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/cadastro` | Cadastrar novo usuário |
| POST | `/api/login` | Fazer login |
| GET | `/api/usuarios` | Listar usuários (debug) |

## 💾 Banco de Dados

Usa um arquivo **JSON** (`database.json`) como banco de dados:
- Simples, sem instalação extra
- Funciona em qualquer sistema (Windows, Mac, Linux)
- Senhas salvas com **hash bcrypt** (seguro!)

## 🔧 Estrutura do Projeto

```
backend/
├── server.js          # Servidor Express + rotas
├── package.json       # Dependências
├── database.json      # Banco de dados (criado automaticamente)
└── node_modules/      # Dependências instaladas
```

## 🔐 Segurança

- ✅ Senhas criptografadas com **bcrypt** (nunca salvas em texto puro)
- ✅ Validação de email único
- ✅ Validação de senha mínima (6 caracteres)
- ✅ CORS configurado para o frontend

## 🌐 Frontend

O frontend (em `../Raiz-Digital-Home/`) já está configurado para chamar:
- `http://localhost:3001/api/cadastro`
- `http://localhost:3001/api/login`

Se mudar a porta do backend, atualize a constante `API_URL` em:
- `../Raiz-Digital-Home/script.js` (cadastro)
- `../Raiz-Digital-Home/Login/script.js` (login)

## 🧪 Testar pela linha de comando

```bash
# Cadastro
curl -X POST http://localhost:3001/api/cadastro \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@email.com","senha":"123456","ConfirmaSenha":"123456"}'

# Login
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","senha":"123456"}'

# Ver usuários
curl http://localhost:3001/api/usuarios
```

## 📚 Para aprender mais

Este backend ensina conceitos fundamentais:
1. **Express.js** - Framework web para Node.js
2. **API REST** - Como criar endpoints HTTP
3. **JSON** - Formato de dados simples
4. **bcrypt** - Como guardar senhas com segurança
5. **Middleware** - CORS, JSON parsing
6. **Validação** - Verificar dados antes de salvar

Para produção real, você trocaria o JSON por:
- **SQLite** (arquivo único, SQL real)
- **PostgreSQL/MySQL** (servidor de banco)
- **MongoDB** (banco NoSQL)
- **Firebase/Supabase** (backend como serviço)