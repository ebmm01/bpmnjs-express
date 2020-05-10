const express = require('express');
const routes = express.Router();

const WfModelController = require('./controllers/WfModelController')
const WfSocketController = require('./controllers/WfSocketController')

const wfSocketController = new WfSocketController();


routes.get('/wfmodels', WfModelController.index)
routes.post('/wfmodel', WfModelController.store)
routes.get('/wfmodel/:id', WfModelController.show)
routes.put('/wfmodel/:id', WfModelController.update)
routes.delete('/wfmodel/:id', WfModelController.destroy)

// Ws routes
routes.ws('/ws', wfSocketController.config)

module.exports = routes;