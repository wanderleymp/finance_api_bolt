const express = require('express');
const { body, param, query } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authMiddleware } = require('../middleware/auth');
const {
  getMovements,
  getMovementById,
  createMovement,
  updateMovement,
  deleteMovement
} = require('../controllers/movementController');

const router = express.Router();

/**
 * @swagger
 * /movements:
 *   get:
 *     tags:
 *       - Movimentos
 *     summary: Lista todos os movimentos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial para filtro
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final para filtro
 *     responses:
 *       200:
 *         description: Lista de movimentos retornada com sucesso
 */
router.get('/', 
  authMiddleware,
  [
    query('startDate').optional().isDate().withMessage('Data inicial inválida'),
    query('endDate').optional().isDate().withMessage('Data final inválida')
  ],
  validate,
  getMovements
);

/**
 * @swagger
 * /movements/{id}:
 *   get:
 *     tags:
 *       - Movimentos
 *     summary: Busca um movimento pelo ID
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
 *         description: Movimento encontrado com sucesso
 *       404:
 *         description: Movimento não encontrado
 */
router.get('/:id',
  authMiddleware,
  [param('id').isInt().withMessage('ID deve ser um número inteiro')],
  validate,
  getMovementById
);

/**
 * @swagger
 * /movements:
 *   post:
 *     tags:
 *       - Movimentos
 *     summary: Cria um novo movimento
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movement_type
 *               - person_id
 *               - license_id
 *             properties:
 *               movement_type:
 *                 type: string
 *               person_id:
 *                 type: integer
 *               license_id:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     item_id:
 *                       type: integer
 *                     quantity:
 *                       type: number
 *                     unit_price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Movimento criado com sucesso
 */
router.post('/',
  authMiddleware,
  [
    body('movement_type').notEmpty().withMessage('Tipo de movimento é obrigatório'),
    body('person_id').isInt().withMessage('ID da pessoa inválido'),
    body('license_id').isInt().withMessage('ID da licença inválido'),
    body('items.*.item_id').isInt().withMessage('ID do item inválido'),
    body('items.*.quantity').isFloat({ min: 0.01 }).withMessage('Quantidade inválida'),
    body('items.*.unit_price').isFloat({ min: 0 }).withMessage('Preço unitário inválido')
  ],
  validate,
  createMovement
);

/**
 * @swagger
 * /movements/{id}:
 *   put:
 *     tags:
 *       - Movimentos
 *     summary: Atualiza um movimento
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
 *               movement_type:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movimento atualizado com sucesso
 *       404:
 *         description: Movimento não encontrado
 */
router.put('/:id',
  authMiddleware,
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('movement_type').optional().notEmpty().withMessage('Tipo de movimento não pode ser vazio'),
    body('description').optional().notEmpty().withMessage('Descrição não pode ser vazia')
  ],
  validate,
  updateMovement
);

/**
 * @swagger
 * /movements/{id}:
 *   delete:
 *     tags:
 *       - Movimentos
 *     summary: Remove um movimento
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
 *         description: Movimento removido com sucesso
 *       404:
 *         description: Movimento não encontrado
 */
router.delete('/:id',
  authMiddleware,
  [param('id').isInt().withMessage('ID deve ser um número inteiro')],
  validate,
  deleteMovement
);

module.exports = router;