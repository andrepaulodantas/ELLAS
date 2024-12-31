const { Usuario } = require('../models');

class UsuarioController {
  async pegaTodos(req, res) {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  }

  async pegaUm(req, res) {
    const usuario = await Usuario.findByPk(req.params.id);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  }

  async cria(req, res) {
    const novoUsuario = await Usuario.create(req.body);
    res.json(novoUsuario);
  }

  async atualiza(req, res) {
    const [updated] = await Usuario.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedUsuario = await Usuario.findByPk(req.params.id);
      res.json(updatedUsuario);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  }

  async apaga(req, res) {
    const deleted = await Usuario.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Usuário deletado' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  }
}

module.exports = UsuarioController;
