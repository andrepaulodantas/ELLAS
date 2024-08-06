const { Router } = require('express');
const AuthController = require('../controllers/AuthController');
const authController = new AuthController();
const router = Router();

// Rotas de Autenticação
router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));

module.exports = router;

