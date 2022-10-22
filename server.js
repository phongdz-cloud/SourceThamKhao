require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')   
const passport = require('passport')
const SocketServer = require('./socketServer')
const { ExpressPeerServer } = require('peer')
const path = require('path')

const {jwtStrategy} = require('./apis/plugins/passport')


const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())


// Routes
app.use('/api', require('./apis/routes/index'))

//Passport
app.use(passport.initialize())
passport.use('jwt', jwtStrategy)

// Socket
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', socket => {
    console.log(socket.id + "connected")
    SocketServer(socket)
})

// Create peer server
ExpressPeerServer(http, { path: '/' })



const URI = process.env.DB_CONNECTION
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('Connected to mongodb')
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}


const port = process.env.PORT || 5050
http.listen(port, () => {
    console.log('Server is running on port', port)
})