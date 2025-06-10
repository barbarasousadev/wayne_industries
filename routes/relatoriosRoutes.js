const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/verificarToken');
const relatoriosController = require('../controllers/relatoriosController');

router.get('/', verificarToken, relatoriosController.listarRelatorios);

router.post('/', verificarToken, relatoriosController.criarRelatorio);

router.patch('/:id/concluir', verificarToken, relatoriosController.concluirRelatorio);

router.delete('/:id', verificarToken, relatoriosController.excluirRelatorio);


module.exports = router;
