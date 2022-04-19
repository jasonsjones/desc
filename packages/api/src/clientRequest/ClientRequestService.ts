import ClientRequest from '../entity/ClientRequest';
import { ItemFields } from '../common/types/items';
import userService from '../user/UserService';
import itemService from '../item/ItemService';
import Item from '../entity/Item';
import { getEntityManager } from '../common/entityUtils';

interface ClientRequestData {
    clientId: string;
    requestorId: string;
    items?: ItemFields | ItemFields[];
}

class ClientRequestService {
    async createClientRequest(data: ClientRequestData): Promise<ClientRequest> {
        const em = getEntityManager();
        const { clientId, requestorId, items } = data;
        const clientRequest = new ClientRequest();
        clientRequest.clientId = clientId;

        const requestor = await userService.getUserById(requestorId);
        if (!requestor) {
            throw new Error('Invalid requestor');
        }
        clientRequest.submittedBy = requestor;

        if (!items) {
            return em.save(clientRequest);
        }

        if (Array.isArray(items)) {
            let itemEntity;
            const createdItems: Item[] = [];
            for (const item of items) {
                itemEntity = await itemService.createItem(item);
                itemEntity.clientRequest = clientRequest;
                createdItems.push(itemEntity);
            }
            clientRequest.items = createdItems;
        } else {
            const tempItem = await itemService.createItem(items);
            tempItem.clientRequest = clientRequest;
            clientRequest.items = [tempItem];
        }

        return em.save(clientRequest);
    }

    async getAllClientRequests(): Promise<ClientRequest[]> {
        return getEntityManager().find(ClientRequest, { relations: ['submittedBy', 'items'] });
    }

    getClientRequestById(id: string): Promise<ClientRequest | undefined> {
        return getEntityManager().findOne(ClientRequest, {
            where: { id },
            relations: ['submittedBy', 'items']
        });
    }
}

export default new ClientRequestService();
