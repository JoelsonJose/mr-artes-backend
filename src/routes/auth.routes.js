const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

// Rota para registrar um novo usuário
// POST /api/auth/register
router.post('/register', UsuarioController.registrar);

// Rota para fazer login
// POST /api/auth/login
router.post('/login', UsuarioController.login);

module.exports = router;

