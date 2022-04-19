import { Request, Response } from 'express';
import clientRequestService from './ClientRequestService';

class ClientRequestController {
    createClientRequest(req: Request, res: Response): Promise<Response> {
        const { clientId, requestorId, items } = req.body;
        return clientRequestService.createClientRequest({ clientId, requestorId, items })
            .then((cr) => {
                // need to remove the reference to this client request in the items since it causes a circular reference
                // and JSON does not handle it
                if (cr.items && cr.items.length > 0) {
                    for (const item of cr.items) {
                        delete item.clientRequest;
                        // need to remove the reference to the item in the note since it causes a circular reference
                        // and JSON does not handle it
                        if (item.notes && item.notes.length > 0) {
                            delete item.notes[0].item;
                        }
                    }
                }

                return res.status(201).json({
                    success: true,
                    message: 'client request created',
                    payload: {
                        clientRequest: cr
                    }
                });
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error creating client request',
                    payload: {
                        error: err.message,
                        clientRequest: null
                    }
                });
            });
    }

    getAllClientRequests(_: Request, res: Response): Promise<Response> {
        return clientRequestService.getAllClientRequests()
            .then((requests) => {
                return res.json({
                    success: true,
                    message: 'client requests fetched',
                    payload: {
                        clientRequests: requests
                    }
                });
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error fetching client requests',
                    payload: {
                        error: err.message,
                        clientRequest: null
                    }
                });
            });
    }

    getClientRequest(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        return clientRequestService.getClientRequestById(id)
            .then((cr) => {
                if (cr) {
                    return res.json({
                        success: true,
                        message: 'client request fetched',
                        payload: {
                            clientRequest: cr
                        }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'client request not found',
                        payload: {
                            clientRequest: null
                        }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error fetching client request',
                    payload: {
                        error: err.message,
                        clientRequest: null
                    }
                });
            });
    }
}

export default new ClientRequestController();
