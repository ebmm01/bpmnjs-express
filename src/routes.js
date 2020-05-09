const express = require('express');
const routes = express.Router();

const WfModelController = require('./controllers/WfModelController')

routes.get('/wfmodels', WfModelController.index)
routes.post('/wfmodel', WfModelController.store)
routes.get('/wfmodel/:id', WfModelController.show)
routes.put('/wfmodel/:id', WfModelController.update)
routes.delete('/wfmodel/:id', WfModelController.destroy)

module.exports = routes;