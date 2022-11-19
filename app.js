const express=require('express');
const app=express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true,limit :'100mb' }));
// parse application/json
app.use(bodyParser.json());

const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

require('dotenv').config();
const cors = require('cors');
app.use(cors());
global.publicPath=__dirname+'/controllers/images';

app.use(function(req, res, next){
	global.req=req;
	next();
});

app.use(express.static(__dirname + '/public'));

const mongoose = require('mongoose');
/* mongoose.connect('mongodb://localhost:27017/MeanStackDB', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
	console.log('mongodb connected successfully');
}).catch((err)=>{
	console.log(err);
}); */
mongoose
  .connect(
    "mongodb://localhost:27017/sport"
  )
  .then(() => {
    console.log("Connected to database !");
  })
  .catch(() => {
    console.log("Connection failed !");
  });


require('./middleware/extend-node-input-validator')
require('./routes/index')(app);

const http=require('http');
const server=http.Server(app);
const port=process.env.PORT|| 3000;

let socketIO = require('socket.io');
let io = socketIO(server);

server.listen(port,()=>{
	console.log(`server is running on port localhost:${port}`);
});

io.on('connection',(socket)=>{
  socket.on('join',(data)=>{
    socket.join(data.room);
    socket.broadcast.to(data.room).emit('user joined');
  });
  socket.on('message',(data)=>{
    io.on(data.room).emit('new message' , {user:data.user, message:data.message});
  });
})

