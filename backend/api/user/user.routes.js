const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { query, getById, update, remove } = require('./user.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', query)
router.get('/:id', getById)
router.put('/:id', requireAuth, update)
router.delete('/:id', requireAuth, requireAdmin, remove)

module.exports = router