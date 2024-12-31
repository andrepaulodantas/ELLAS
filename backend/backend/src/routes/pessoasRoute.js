const { Router } = require('express');
const PessoaController = require('../controllers/PessoaController.js');

const pessoaController = new PessoaController();
const router = Router();

router.get('/', (req, res) => pessoaController.pegaTodos(req, res));
router.get('/:id', (req, res) => pessoaController.pegaUm(req, res));
router.post('/', (req, res) => pessoaController.cria(req, res));
router.put('/:id', (req, res) => pessoaController.atualiza(req, res));
router.delete('/:id', (req, res) => pessoaController.apaga(req, res));

module.exports = router;
