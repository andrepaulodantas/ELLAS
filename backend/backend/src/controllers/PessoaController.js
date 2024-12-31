const { Pessoa } = require('../models');

class PessoaController {
  async pegaTodos(req, res) {
    const pessoas = await Pessoa.findAll();
    res.json(pessoas);
  }

  async pegaUm(req, res) {
    const pessoa = await Pessoa.findByPk(req.params.id);
    if (pessoa) {
      res.json(pessoa);
    } else {
      res.status(404).json({ error: 'Pessoa não encontrada' });
    }
  }

  async cria(req, res) {
    const novaPessoa = await Pessoa.create(req.body);
    res.json(novaPessoa);
  }

  async atualiza(req, res) {
    const [updated] = await Pessoa.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedPessoa = await Pessoa.findByPk(req.params.id);
      res.json(updatedPessoa);
    } else {
      res.status(404).json({ error: 'Pessoa não encontrada' });
    }
  }

  async apaga(req, res) {
    const deleted = await Pessoa.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Pessoa deletada' });
    } else {
      res.status(404).json({ error: 'Pessoa não encontrada' });
    }
  }
}

module.exports = PessoaController;
