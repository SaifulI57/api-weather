import express from 'express'
import env from 'dotenv'
import bodyParser from 'body-parser'
import Logging from './logging/Logging.js';
let app = express()

const L = new Logging()
env.config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.use('/',(req,res, next)=>{
    res.send({ message: 'Worked'})
})

app.use('/api', apiRoutes)
app.use((err,req,res)=>{
    if(err.status === 404){
        res.status(404).send({ message: "endpoint not found" })
    }
})

app.use((req, res, next) => {
    L.info(` Incoming Request -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        L.info(` Incoming Request Finish -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - StatusCode: [${res.statusCode}] - Status: [${res.statusMessage}]`);
    });
    next();
});

app.listen(process.env.PORT,()=>{
    console.log(`listening on ${process.env.PORT}`)
})
