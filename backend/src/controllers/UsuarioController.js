const UsuarioService = require('../services/UsuarioService');
const bcrypt = require('bcryptjs');

class UsuarioController {
  constructor() {
    this.usuarioService = new UsuarioService();
  }

  async pegaTodos(req, res) {
    try {
      const usuarios = await this.usuarioService.pegaTodosOsRegistros();
      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  async pegaUm(req, res) {
    const { id } = req.params;
    try {
      const usuario = await this.usuarioService.pegaUmRegistro({ id });
      return res.status(200).json(usuario);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  async cria(req, res) {
    const novoUsuario = req.body;
    try {
      novoUsuario.senha = await bcrypt.hash(novoUsuario.senha, 10);
      const usuarioCriado = await this.usuarioService.criaRegistro(novoUsuario);
      return res.status(201).json(usuarioCriado);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  async atualiza(req, res) {
    const { id } = req.params;
    const novasInfos = req.body;
    try {
      if (novasInfos.senha) {
        novasInfos.senha = await bcrypt.hash(novasInfos.senha, 10);
      }
      await this.usuarioService.atualizaRegistro(novasInfos, { id });
      return res.status(200).json({ message: `Usuário ${id} atualizado` });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  async apaga(req, res) {
    const { id } = req.params;
    try {
      await this.usuarioService.apagaRegistro({ id });
      return res.status(200).json({ message: `Usuário ${id} apagado` });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}

module.exports = UsuarioController;
