const userService = require('./user.service')

module.exports = {
    query,
    getById,
    update,
    remove
}

async function query(req, res) {
    const users = await userService.query(req.query)
    res.send(users)
}

async function getById(req, res) {
    const user = await userService.getById(req.params.id)
    res.send(user)
}

async function update(req, res) {
    const user = req.body;
    await userService.update(user)
    res.send(user)
}

async function remove(req, res) {
    await userService.remove(req.params.id)
    res.end()
}