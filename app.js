const express = require('express')
const config = require('config')
const mongoose = require('mongoose');

const app = express()


const PORT = config.get('port') || 5000


async function start() {
    try {
await mongoose.connect(config.get('mongoUrl'), { 
    
})
    } catch (err) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

app.listen(PORT, () => console.log(`App has been listening on ${PORT}...`))