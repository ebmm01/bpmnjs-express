const workflows = {}

class WfSocketController {
    constructor() {}

    async config(ws, req) {
        ws.id = req.headers['sec-websocket-key'];
        ws.on('message', function(msg) {
            msg = JSON.parse(msg)

            if (msg.workflowId) {
                ws.workflow = msg.workflowId
            }

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
        });

        ws.on('close', () => {
            if (workflows[ws.workflow] && workflows[ws.workflow].clients) {
                const clientToDisconect = workflows[ws.workflow].clients.findIndex(client => client.id === ws.id)

                if (clientToDisconect !== -1) {
                    workflows[ws.workflow].clients.splice(clientToDisconect, 1)
                }

                if (workflows[ws.workflow].clients.length === 0) {
                    delete workflows[ws.workflow]
                }
            }
        })
    }
}


module.exports = WfSocketController