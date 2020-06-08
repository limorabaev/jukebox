import userService from '@/services/user.service.js';

export default {
    state: {
        loggedinUser: userService.getLoggedinUser(),
        users: []
    },
    getters: {
        loggedinUser(state) {
            return state.loggedinUser;
        },
        users(state) {
            return state.toys;
        },
        isGuestUser(state, getters) {
            return (getters.loggedinUser.fullName === 'guest' && !getters.loggedinUser.email)
        }
    },
    mutations: {
        setUser(state, { user }) {
            state.loggedinUser = user;
        },
        setUsers(state, { users }) {
            state.users = users;
        },
        removeUser(state, { userId }) {
            state.users = state.users.filter(user => user._id !== userId);
        },
        saveUserCreatedStation(state, { station }) {
            const miniStation = {
                _id: station._id,
                name: station.name,
                imgUrl: station.imgUrl
            };
            const idx = state.loggedinUser.stations.findIndex(currStation => currStation._id === station._id);
            if (idx === -1) state.loggedinUser.stations.unshift(miniStation);
            else state.loggedinUser.stations.splice(idx, 1, miniStation);
        },
        removeUserCreatedStation(state, { stationId }) {
            const idx = state.loggedinUser.stations.findIndex(currStation => currStation._id === stationId);
            if (idx === -1) state.loggedinUser.stations.splice(idx, 1);
        }
    },
    actions: {
        async login(context, { userCred }) {
            const user = await userService.login(userCred);
            if (!user) return;
            context.commit({ type: 'setUser', user });
            return user;
        },
        async signup(context, { userCred }) {
            const user = await userService.signup(userCred);
            if (!user) return;
            context.commit({ type: 'setUser', user });
            return user;
        },
        async logout(context) {
            await userService.logout()
            context.commit({ type: 'setUsers', users: [] });
            context.commit({ type: 'setUser', user: userService.getLoggedinUser() }); // returns guest after logout
        },
        async updateUser(context, { user }) {
            user = await userService.update(user);
            context.commit({ type: 'setUser', user });
            return user;
        },
        async loadUsers(context) {
            const users = await userService.getUsers();
            context.commit({ type: 'setUsers', users });
            return users;
        },
        async removeUser(context, { userId }) {
            await userService.remove(userId);
            context.commit({ type: 'removeUser', userId });
        },
        async saveUserCreatedStation(context, payload) {
            context.commit(payload);
            return await context.dispatch({ type: 'updateUser', user: context.getters.loggedinUser });
        },
        async removeUserCreatedStation(context, payload) {
            context.commit(payload);
            return await context.dispatch({ type: 'updateUser', user: context.getters.loggedinUser });
        },
    }
}