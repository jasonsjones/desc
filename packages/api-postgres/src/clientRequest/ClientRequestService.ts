import ClientRequest from '../entity/ClientRequest';
import { ItemData } from '../common/types';
import UserService from '../user/UserService';
import ItemService from '../item/ItemService';
import Item from '../entity/Item';

interface ClientRequestData {
    clientId: string;
    requestorId: string;
    items?: ItemData | ItemData[];
}
export default class ClientRequestService {
    static async createClientRequest(data: ClientRequestData): Promise<ClientRequest> {
        const { clientId, requestorId, items } = data;
        const clientRequest = new ClientRequest();
        clientRequest.clientId = clientId;

        const requestor = await UserService.getUserById(requestorId);
        if (!requestor) {
            throw new Error('Invalid requestor');
        }
        clientRequest.submittedBy = requestor;

        if (!items) {
            return clientRequest.save();
        }

        if (Array.isArray(items)) {
            let itemEntity;
            const createdItems: Item[] = [];
            for (const item of items) {
                itemEntity = await ItemService.createItem(item);
                itemEntity.clientRequest = clientRequest;
                createdItems.push(itemEntity);
            }
            clientRequest.items = createdItems;
        } else {
            const tempItem = await ItemService.createItem(items);
            tempItem.clientRequest = clientRequest;
            clientRequest.items = [tempItem];
        }

        return clientRequest.save();
    }

    static async getAllClientRequests(): Promise<ClientRequest[]> {
        return ClientRequest.find({ relations: ['submittedBy', 'items'] });
    }

    static getClientRequestById(id: string): Promise<ClientRequest | undefined> {
        return ClientRequest.findOne({
            where: { id },
            relations: ['submittedBy', 'items']
        });
    }
}
