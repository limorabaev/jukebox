import stationService from '@/services/station.service.js';

export default {
    state: {
        stations: [],
        tags: [],
        filterBy: {
            name: '',
            tag: '',
            _sort: 'name',
            _order: 1
        },
        currStation: null,
        tags: []
    },
    getters: {
        stations(state) {
            return state.stations;
        },
        tags(state) {
            return state.tags;
        },
        currStation(state) {
            return state.currStation;
        },
        filterBy(state) {
            return state.filterBy;
        },
        tags(state) {
            return state.tags;
        },
    },
    mutations: {
        setStations(state, { stations }) {
            state.stations = stations;
        },
        setTags(state, { tags }) {
            state.tags = tags;
        },
        setStation(state, { station }) {
            state.currStation = station;
        },
        unsetStation(state) {
            state.currStation = null;
        },
        setFilterBy(state, { filterBy }) {
            state.filterBy = filterBy;
        },
        addStation(state, { station }) {
            state.stations.unshift(station);
        },
        removeStation(state, { stationId }) {
            const idx = state.stations.findIndex(station => station._id === stationId);
            if (idx === -1) return;
            state.stations.splice(idx, 1);
        },
        updateStation(state, { station }) {
            const idx = state.stations.findIndex(currStation => currStation._id === station._id);
            if (idx === -1) return;
            state.stations.splice(idx, 1, station);
        },
        addSong(state, { song }) {
            const loggedinUser = this.getters.loggedinUser;
            song.addedBy = {
                _id: loggedinUser._id,
                fullName: loggedinUser.fullName,
                imgUrl: loggedinUser.imgUrl
            };
            state.currStation.songs.push(song);
        },
        updatePlaylist(state, { songs }) {
            state.currStation.songs = songs;
        },
        addTag(state, { tag }) {
            state.currStation.tags.push(tag);
            if (!state.tags.includes(tag)) state.tags.push(tag);
        },
        removeTag(state, { tag }) {
            const idx = state.currStation.tags.findIndex(currTag => currTag === tag);
            if (idx === -1) return;
            state.currStation.tags.splice(idx, 1);
        },
        setStationName(state, { name }) {
            state.currStation.name = name;
        },
        setStationImg(state, { imgUrl }) {
            state.currStation.imgUrl = imgUrl;
        },
        addLike(state) {
            state.currStation.likedBy.push(this.getters.loggedinUser);
        }
    },
    actions: {
        async loadStations(context) {
            // console.log(context.getters.filterBy)
            const stations = await stationService.query(context.getters.filterBy);
            context.commit({ type: 'setStations', stations });
            return stations;
        },
        async loadTags(context) {
            const tags = await stationService.getTags();
            context.commit({ type: 'setTags', tags });
            return tags;
        },
        async loadStation(context, { stationId }) {
            const station = (stationId) ? await stationService.getById(stationId) : stationService.getEmptyStation();
            context.commit({ type: 'setStation', station });
            return station;
        },
        setFilterBy(context, payload) {
            context.commit(payload);
            return context.dispatch({ type: 'loadStations' });
        },
        async saveStation(context, { station }) {
            console.log(station)
            const isUpdate = !!station._id;
            if (!isUpdate) {
                const loggedinUser = context.getters.loggedinUser;
                station.createdBy = {
                    _id: loggedinUser._id,
                    fullName: loggedinUser.fullName,
                    imgUrl: loggedinUser.imgUrl
                };
            }
            station = await stationService.save(station);
            if (isUpdate) context.commit({ type: 'updateStation', station });
            else context.commit({ type: 'addStation', station });
            if (!context.getters.isGuestUser) {
                context.dispatch({ type: 'saveUserCreatedStation', station })
            }
            return station;
        },
        async removeStation(context, payload) {
            await stationService.remove(stationId);
            context.commit(payload);
            if (!context.getters.isGuestUser) {
                context.dispatch({ type: 'removeUserCreatedStation', station })
            }
        },
        async addSong(context, payload) {
            context.commit(payload);
            return await context.dispatch({ type: 'saveStation', station: context.getters.currStation });
        },
        async updatePlaylist(context, payload) {
            context.commit(payload);
            return await context.dispatch({ type: 'saveStation', station: context.getters.currStation });
        },
        async addLike(context, payload) {
            context.commit(payload);
            return await context.dispatch({ type: 'saveStation', station: context.getters.currStation });
        }
    }
}