const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UsuarioService {
  async registrar(nome, email, senha) {
    // Verifica se o email já está em uso
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    // Gera o hash da senha
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);

    // Cria o usuário no banco de dados
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha_hash,
    });

    return novoUsuario;
  }

  async login(email, senha) {
    // 1. Encontrar o usuário pelo email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      throw new Error('Credenciais inválidas'); // Mensagem genérica por segurança
    }

    // 2. Comparar a senha enviada com o hash salvo no banco
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaCorreta) {
      throw new Error('Credenciais inválidas');
    }

    // 3. Gerar o token JWT
    const payload = {
      id: usuario.id,
      nome: usuario.nome,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8h', // Token expira em 8 horas
    });

    return { token };
  }
}

module.exports = new UsuarioService();
