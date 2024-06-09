const { Usuario } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
  async login(req, res) {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (usuario && bcrypt.compareSync(senha, usuario.senha)) {
      const token = jwt.sign({ id: usuario.id }, 'your_jwt_secret');
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  }

  async register(req, res) {
    const { nome, email, senha } = req.body;
    const hash = bcrypt.hashSync(senha, 10);
    const novoUsuario = await Usuario.create({ nome, email, senha: hash });
    res.json(novoUsuario);
  }
}

module.exports = AuthController;
