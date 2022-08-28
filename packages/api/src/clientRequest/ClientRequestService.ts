import { getClientRequestRepository } from '../common/entityUtils';
import { ItemFields } from '../common/types/items';
import ClientRequest from '../entity/ClientRequest';
import Item from '../entity/Item';
import itemService from '../item/ItemService';
import userService from '../user/UserService';

interface ClientRequestData {
    clientId: string;
    requestorId: string;
    items?: ItemFields | ItemFields[];
}

class ClientRequestService {
    async createClientRequest(data: ClientRequestData): Promise<ClientRequest> {
        const { clientId, requestorId, items } = data;
        const clientRequest = new ClientRequest();
        clientRequest.clientId = clientId;

        const requestor = await userService.getUserById(requestorId);
        if (!requestor) {
            throw new Error('Invalid requestor');
        }
        clientRequest.submittedBy = requestor;

        if (!items) {
            return getClientRequestRepository().save(clientRequest);
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

        return getClientRequestRepository().save(clientRequest);
    }

    async getAllClientRequests(): Promise<ClientRequest[]> {
        return getClientRequestRepository().find({ relations: { submittedBy: true, items: true } });
    }

    getClientRequestById(id: string): Promise<ClientRequest | null> {
        return getClientRequestRepository().findOne({
            where: { id },
            relations: {
                submittedBy: true,
                items: true
            }
        });
    }
}

export default new ClientRequestService();
