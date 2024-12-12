const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authMiddleware } = require('../middleware/auth');
const {
  getPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson
} = require('../controllers/personController');

const router = express.Router();

/**
 * @swagger
 * /persons:
 *   get:
 *     tags:
 *       - Pessoas
 *     summary: Lista todas as pessoas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pessoas retornada com sucesso
 */
router.get('/', authMiddleware, getPersons);

/**
 * @swagger
 * /persons/{id}:
 *   get:
 *     tags:
 *       - Pessoas
 *     summary: Busca uma pessoa pelo ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pessoa encontrada com sucesso
 *       404:
 *         description: Pessoa não encontrada
 */
router.get('/:id', 
  authMiddleware,
  [param('id').isInt().withMessage('ID deve ser um número inteiro')],
  validate,
  getPersonById
);

/**
 * @swagger
 * /persons:
 *   post:
 *     tags:
 *       - Pessoas
 *     summary: Cria uma nova pessoa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *             properties:
 *               full_name:
 *                 type: string
 *               birth_date:
 *                 type: string
 *                 format: date
 *               documents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     document_type_id:
 *                       type: integer
 *                     document_value:
 *                       type: string
 *     responses:
 *       201:
 *         description: Pessoa criada com sucesso
 */
router.post('/',
  authMiddleware,
  [
    body('full_name').notEmpty().withMessage('Nome completo é obrigatório'),
    body('birth_date').optional().isDate().withMessage('Data de nascimento inválida'),
    body('documents.*.document_type_id').optional().isInt().withMessage('Tipo de documento inválido'),
    body('documents.*.document_value').optional().notEmpty().withMessage('Valor do documento é obrigatório')
  ],
  validate,
  createPerson
);

/**
 * @swagger
 * /persons/{id}:
 *   put:
 *     tags:
 *       - Pessoas
 *     summary: Atualiza uma pessoa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               birth_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Pessoa atualizada com sucesso
 *       404:
 *         description: Pessoa não encontrada
 */
router.put('/:id',
  authMiddleware,
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('full_name').optional().notEmpty().withMessage('Nome completo não pode ser vazio'),
    body('birth_date').optional().isDate().withMessage('Data de nascimento inválida')
  ],
  validate,
  updatePerson
);

/**
 * @swagger
 * /persons/{id}:
 *   delete:
 *     tags:
 *       - Pessoas
 *     summary: Remove uma pessoa
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Pessoa removida com sucesso
 *       404:
 *         description: Pessoa não encontrada
 */
router.delete('/:id',
  authMiddleware,
  [param('id').isInt().withMessage('ID deve ser um número inteiro')],
  validate,
  deletePerson
);

module.exports = router;