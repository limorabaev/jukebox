const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getById,
    add,
    update,
    remove,
    getTags
}

async function query(params) {
    const filterBy = _buildFilterCriteria(params);
    const sortBy = _buildSortCriteria(params);
    const collection = await dbService.getCollection('station');
    try {
        const stations = await collection.find(filterBy).collation({ locale: "en" }).sort(sortBy).toArray();
        return stations;
    } catch (err) {
        console.log('ERROR: cannot find stations');
        throw err;
    }
}

async function getTags() {
    const collection = await dbService.getCollection('station');
    try {
        const query = { "tags.0": { "$exists": true } };
        const projection = { "_id": 0, "tags": 1 };
        const tagsObjArray = await collection.find(query).project(projection).toArray();
        var allTags = tagsObjArray.reduce((acc, tagObj) => {
            tagObj.tags.forEach(tag => {
                if (!acc.includes(tag)) acc.push(tag);
            });
            return acc;
        }, [])
        return allTags;
    } catch (err) {
        console.log('ERROR: cannot find station tags');
        throw err;
    }
}

async function getById(stationId) {
    const collection = await dbService.getCollection('station');
    try {
        const station = await collection.findOne({ "_id": ObjectId(stationId) });
        return station;
    } catch (err) {
        console.log(`ERROR: while finding station ${stationId}`);
        throw err;
    }
}

async function add(station) {
    station.createdBy._id = ObjectId(station.createdBy._id);
    station.songs = station.songs.map(song => {
        song.addedBy._id = ObjectId(song.addedBy._id)
        return song;
    });
    const collection = await dbService.getCollection('station');
    try {
        await collection.insertOne(station);
        return station;
    } catch (err) {
        console.log(`ERROR: cannot insert station`);
        throw err;
    }
}

async function update(station) {
    const collection = await dbService.getCollection('station');
    station._id = ObjectId(station._id);
    station.createdBy._id = ObjectId(station.createdBy._id);
    station.likedBy = station.likedBy.map(user => {
        user._id = ObjectId(user._id);
        return user;
    });
    station.songs = station.songs.map(song => {
        song.addedBy._id = ObjectId(song.addedBy._id)
        return song;
    });
    try {
        await collection.replaceOne({ "_id": station._id }, { $set: station });
        return station;
    } catch (err) {
        console.log(`ERROR: cannot update station ${station._id}`);
        throw err;
    }
}

async function remove(stationId) {
    const collection = await dbService.getCollection('station');
    try {
        await collection.deleteOne({ "_id": ObjectId(stationId) });
    } catch (err) {
        console.log(`ERROR: cannot remove station ${stationId}`);
        throw err;
    }
}

function _buildFilterCriteria(params) {
    const filterBy = {};
    if (params.name) {
        var regex = new RegExp(params.name, 'i');
        filterBy.name = { $regex: regex };
    }
    if (params.createdBy) {
        
    }
    if (params.type) {
        filterBy.type = params.type;
    }
    if (params.tag) {
        filterBy.tags = params.tag;
    }
    return filterBy;
}

function _buildSortCriteria(params) {
    const sortBy = { name: 1 };
    // const sortBy = {};
    // sortBy[params._sort] = +params._order;
    return sortBy;
}