const UsuarioService = require('../services/UsuarioService');

class UsuarioController {
  async registrar(req, res) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios: nome, email e senha.' });
      }

      const usuario = await UsuarioService.registrar(nome, email, senha);
      
      const usuarioResponse = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        createdAt: usuario.createdAt,
      };

      return res.status(201).json(usuarioResponse);
    } catch (error) {
      if (error.message === 'Este e-mail já está cadastrado.') {
        return res.status(409).json({ message: error.message });
      }
      console.error('Erro ao registrar usuário:', error);
      return res.status(500).json({ message: 'Erro interno ao tentar registrar o usuário.' });
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ message: 'Email and senha são obrigatórios.' });
      }

      const { token } = await UsuarioService.login(email, senha);

      return res.status(200).json({ token });

    } catch (error) {
      if (error.message === 'Credenciais inválidas') {
        return res.status(401).json({ message: error.message });
      }
      console.error('Erro ao fazer login:', error);
      return res.status(500).json({ message: 'Erro interno ao tentar fazer login.' });
    }
  }
}

module.exports = new UsuarioController();
