// @ts-check


/* eslint-disable no-console */

const express = require('express')

const app = express()

const PORT = 5000;

app.use('/', (req, res)=>{
    console.log('Middleware 1')
    res.send('hello express;');
})

app.use((req, res)=>{
    console.log('Middleware 1')
    res.send('hello express;');
})

app.listen(PORT, ()=>{
    console.log(`The Express server is lintening at port: ${PORT}`)
})

