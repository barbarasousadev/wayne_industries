const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/verificarToken');

router.get('/', authMiddleware, userController.listarUsuarios);
router.post('/', authMiddleware, userController.adicionarUsuario); 
router.put('/:id', authMiddleware, userController.editarUsuario);
router.delete('/:id', authMiddleware, userController.excluirUsuario);

module.exports = router;
