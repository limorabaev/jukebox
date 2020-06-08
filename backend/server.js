const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const authRoutes = require('./api/auth/auth.routes');
const userRoutes = require('./api/user/user.routes');
const stationRoutes = require('./api/station/station.routes');
const connectSockets = require('./api/socket/socket.routes');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'alpaca sheep',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
    app.get(/(?!^\/api\/.*)(^.*$)/, function(req, res) {
        res.sendfile(path.resolve(__dirname, 'public/index.html'));
    });
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:8081', 'http://localhost:8081'],
        credentials: true
    };
    app.use(cors(corsOptions));
}

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/station', stationRoutes);
connectSockets(io);

const logger = require('./services/logger.service');
const port = process.env.PORT || 3030;
http.listen(port, () => {
    logger.info('Server is running on port: ' + port);
});