const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthController {
  async login(req, res) {
    const { email, senha } = req.body;
    try {
      console.log('Email:', email); // Adicione este log
      console.log('Senha:', senha); // Adicione este log
      const user = await Usuario.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      console.log('Usuário encontrado:', user); // Adicione este log

      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Senha inválida' });
      }

      const token = jwt.sign({ id: user.id }, 'seu-segredo-jwt', { expiresIn: '1h' });
      return res.status(200).json({ token });
    } catch (error) {
      console.error('Erro no login:', error); // Adicione este log
      return res.status(500).json({ message: error.message });
    }
  }

  async register(req, res) {
    const { nome, email, senha } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(senha, 10);
      const newUser = await Usuario.create({ nome, email, senha: hashedPassword });
      return res.status(201).json(newUser);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = AuthController;
