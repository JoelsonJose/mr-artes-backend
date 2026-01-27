const UsuarioService = require('../services/UsuarioService');

class UsuarioController {
  async registrar(req, res) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Todos os campos são obrigatórios: nome, email e senha.' }));
        return;
      }

      const usuario = await UsuarioService.registrar(nome, email, senha);
      
      const usuarioResponse = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        createdAt: usuario.createdAt,
      };

      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(usuarioResponse));

    } catch (error) {
      if (error.message === 'Este e-mail já está cadastrado.') {
        res.statusCode = 409;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: error.message }));
        return;
      }
      console.error('Erro ao registrar usuário:', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Erro interno ao tentar registrar o usuário.' }));
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Email e senha são obrigatórios.' }));
        return;
      }

      const { token } = await UsuarioService.login(email, senha);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ token }));

    } catch (error) {
      if (error.message === 'Credenciais inválidas') {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: error.message }));
        return;
      }
      console.error('Erro ao fazer login:', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Erro interno ao tentar fazer login.' }));
    }
  }
}

module.exports = new UsuarioController();
