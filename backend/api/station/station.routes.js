const express = require('express');
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware');
const { query, getTags, getById, add, update, remove } = require('./station.controller');
const router = express.Router();

router.get('/', query);
router.get('/tag', getTags);
router.get('/:id', getById);
router.post('/', add);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;