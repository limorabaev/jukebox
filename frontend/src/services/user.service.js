import httpService from './http.service'

export default {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    getLoggedinUser
};

async function login(userCred) {
    const user = await httpService.post('auth/login', userCred);
    return _handleLogin(user);
}

async function logout() {
    await httpService.post('auth/logout');
    sessionStorage.clear();
}

async function signup(userCred) {
    const user = await httpService.post('auth/signup', userCred);
    return _handleLogin(user);
}

function getUsers() {
    return httpService.get('user');
}

function getById(userId) {
    return httpService.get(`user/${userId}`);
}

function remove(userId) {
    return httpService.delete(`user/${userId}`);
}

function update(user) {
    var loggedinUser = getLoggedinUser();
    if (loggedinUser._id === user._id) {
        sessionStorage.setItem('user', JSON.stringify(user));
    }
    return httpService.put(`user/${user._id}`, user);
}

function getLoggedinUser() {
    var user = sessionStorage.getItem('user');
    return (user) ? JSON.parse(user) : 
        {
            _id: '5e792fc31c9d4400009c8229',
            fullName: 'guest',
            imgUrl: '../img/user-icon.png',
            isAdmin: false
        }
}

function _handleLogin(user) {
    sessionStorage.setItem('user', JSON.stringify(user));
    return user;
}