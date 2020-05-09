const mongoose = require("mongoose");

const WfModel = mongoose.model('WfModel');

module.exports = {
    async index(req, res) {
        const wfModels = await WfModel.find({}, {name:1, lastUpdatedAt:1}).sort( { lastUpdatedAt: -1 } );

        return res.json(wfModels);
    },

    async show(req, res) {
        const wfModel = await WfModel.findById(req.params.id);
        
        return res.json(wfModel);
    },

    async store(req, res) {
        const wfModel = await WfModel.create(req.body);

        return res.json(wfModel)
    },

    async update(req, res) {
        req.body.lastUpdatedAt = Date.now()
        const wfModel = await WfModel.findByIdAndUpdate(req.params.id, req.body, { new:true })

        return res.json(wfModel);
    },

    async destroy(req, res) {
        await WfModel.findByIdAndRemove(req.params.id);

        return res.send();
    }
}