const stationService = require('./station.service')

module.exports = {
    query,
    getTags,
    getById,
    add,
    update,
    remove
}

async function query(req, res) {
    const stations = await stationService.query(req.query)
    res.json(stations)
}

async function getTags(req, res) {
    const tags = await stationService.getTags();
    res.json(tags)
}

async function getById(req, res) {
    const station = await stationService.getById(req.params.id)
    res.json(station)
}

async function add(req, res) {
    const station = req.body;
    await stationService.add(station)
    res.json(station)
}

async function update(req, res) {
    const station = req.body;
    await stationService.update(station)
    res.json(station)
}

async function remove(req, res) {
    await stationService.remove(req.params.id)
    res.end()
}