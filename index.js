const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, './.env') });
const { contactsRouter } = require('./src/contacts/contact.router.js');
const mongoose = require('mongoose');


const CrudServer = class {

   async start() {
        this.initServer();
        await  this.initDatabase();
        this.initMiddlewares();
        this.initRoutes();
        this.initErrorHandling();
        this.startListening();
    }

    initServer() {
        this.app = express();
    }

    async initDatabase() {
       try {
           await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
           console.log("Database connection successful")
       } catch (err) {
           console.log(err)
          process.exit(1) 
    }
    }
    
    initMiddlewares() {
        this.app.use(express.json());
        this.app.use(morgan('tiny'));
        this.app.use(cors());
    }

    initRoutes() {
        this.app.use('/', contactsRouter)
        
    }

    initErrorHandling() {
        this.app.use((err, req, res, next) => {
            const statusCode = err.status || 500;
            return res.status(statusCode).send(err.message);
        })
    }

    startListening() {
        const { PORT } = process.env;
        this.app.listen(PORT, () => {
            console.log('Server started listenning on PORT', PORT);
        })
    }
}
new CrudServer().start()
//для базы данных контактов