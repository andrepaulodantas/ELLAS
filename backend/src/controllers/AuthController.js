const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

class AuthController {
  async register(req, res) {
    try {
      const { nome, email, senha } = req.body;
      const hashedPassword = await bcrypt.hash(senha, 10);
      const user = await Usuario.create({ nome, email, senha: hashedPassword });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const user = await Usuario.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      const isMatch = await bcrypt.compare(senha, user.senha);
      if (!isMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }
}

module.exports = AuthController;

