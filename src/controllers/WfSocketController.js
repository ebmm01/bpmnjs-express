const workflows = {}

class WfSocketController {
    constructor() {
        this.handlers = [
            this.addToWorkflow,
            this.updateWorkflow,
            this.clientWorkflowChanged
        ]
    }

    handleMessage({msg, ws, initChain = false}) {
        const _this = this

        if (initChain) {
            _this.internalHandlerList = [...this.handlers]
        }

        const handler = _this.internalHandlerList[0]
        handler({msg, ws}, _this)
    }

    next({msg, ws}) {
        if(this.internalHandlerList.length > 1 ){
            this.internalHandlerList.shift()
            this.handleMessage({msg, ws})
        }
    }

    addToWorkflow({msg, ws}, _this) {
        if (msg.addToWorkflow) {
            if (!workflows[msg.workflowId]) {
                workflows[msg.workflowId] = {}
                workflows[msg.workflowId].modelData = msg.modelData
                workflows[msg.workflowId].clients = [ws]
            } 
            else {
                workflows[msg.workflowId].clients.push(ws)
            }
        }
        else {
            _this.next({msg, ws})
        }
    }

    updateWorkflow({msg, ws}, _this) {
        if (msg.type === 'updateWorkflow' && workflows[ws.workflow]) {
            workflows[ws.workflow].modelData = msg.modelData
            workflows[ws.workflow].clients.map(client => {
                if (client.id !== ws.id) {
                    client.send(JSON.stringify({
                        modelData: workflows[ws.workflow].modelData,
                        type: 'updateWorkflow'
                    }))
                }
            })
        }
        else {
            _this.next({msg, ws})
        }
    }
    clientWorkflowChanged({msg, ws}, _this) {
        if (msg.type === 'clientWorkflowChanged') {

            // Disconecto o client do workflow atual
            if (workflows[msg.oldWorkflow] && workflows[msg.oldWorkflow].clients) {
                _this.handleWsRemove(msg.oldWorkflow, ws.id);
                ws.workflow = msg.newWorkflow
                if (!workflows[msg.newWorkflow]) {
                    workflows[msg.newWorkflow] = {}
                    workflows[msg.newWorkflow].modelData = msg.modelData
                    workflows[msg.newWorkflow].clients = [ws]
                } 
                else {
                    workflows[msg.newWorkflow].clients.push(ws)
                }
            }
        }
        else {
            _this.next({msg, ws})
        }
    }


    async config(ws, req) {
        ws.id = req.headers['sec-websocket-key'];
        const _this = this
        ws.on('message', function(msg) {
            msg = JSON.parse(msg)

            if (msg.workflowId) {
                ws.workflow = msg.workflowId
            }

            _this.handleMessage({msg, ws, initChain: true})

        });

        ws.on('close', () => {
            if (workflows[ws.workflow] && workflows[ws.workflow].clients) {
                _this.handleWsRemove(ws.workflow, ws.id)
            }
        })
    }

    handleWsRemove(workflow, id) {
        const clientToDisconect = workflows[workflow].clients.findIndex(client => client.id === id)

        if (clientToDisconect !== -1) {
            workflows[workflow].clients.splice(clientToDisconect, 1)
        }

        if (workflows[workflow].clients.length === 0) {
            delete workflows[workflow]
        }
    }
}


module.exports = WfSocketController