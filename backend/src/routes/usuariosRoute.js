const { Router } = require('express');
const AuthController = require('../controllers/AuthController');
const UsuarioController = require('../controllers/UsuarioController');

const authController = new AuthController();
const usuarioController = new UsuarioController();

const router = Router();

// Rotas de Autenticação
router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));

// Rotas de CRUD para Usuários
router.get('/', (req, res) => usuarioController.pegaTodos(req, res));
router.get('/:id', (req, res) => usuarioController.pegaUm(req, res));
router.post('/', (req, res) => usuarioController.cria(req, res));
router.put('/:id', (req, res) => usuarioController.atualiza(req, res));
router.delete('/:id', (req, res) => usuarioController.apaga(req, res));

module.exports = router;
