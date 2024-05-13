const { Router } = require('express');
const PessoaController = require('../controllers/PessoaController.js');
const AuthController = require('../controllers/AuthController.js');

const pessoaController = new PessoaController();
const authController = new AuthController();

const router = Router();

router.get('/pessoas', (req, res) => pessoaController.pegaTodos(req, res));
router.get('/pessoas/:id', (req, res) => pessoaController.pegaUm(req, res));
router.post('/pessoas', (req, res) => pessoaController.cria(req, res));
router.put('/pessoas/:id', (req, res) => pessoaController.atualiza(req, res));
router.delete('/pessoas/:id', (req, res) => pessoaController.apaga(req, res));
router.post('/login', (req, res) => authController.login(req, res)); // Adicionado

module.exports = router;

