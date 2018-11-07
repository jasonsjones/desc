import { expect } from 'chai';
import request from 'supertest';

import config from '../config/config';
import app from '../config/app';
import { createUser } from '../user/user-controller';
import { createItem } from './item-controller';
import { dbConnection, dropCollection } from '../utils/db-test-utils';

const ollie = {
    name: {
        first: 'Oliver',
        last: 'Queen'
    },
    email: 'oliver@qc.com',
    password: 'thegreenarrow',
    roles: ['admin', 'approver']
};

const barry = {
    name: {
        first: 'Barry',
        last: 'Allen'
    },
    email: 'barry@starlabs.com',
    password: 'theflash',
    roles: ['requestor']
};

const createOllie = () => {
    return createUser(ollie);
};

const createBarry = () => {
    return createUser(barry);
};

const getItemData = userId => {
    return {
        clothingItemWithNote: {
            clientId: '12345678',
            submittedBy: userId,
            itemCategory: 'Clothing',
            numberOfItems: 1,
            name: 'coat',
            size: 'L (42-44)',
            gender: 'M',
            note: 'Need a warm coat for the fall season'
        },
        householdItemWithNote: {
            clientId: '12345678',
            submittedBy: userId,
            itemCategory: 'Household',
            numberOfItems: 4,
            name: 'plates',
            note: 'Need some plates for a nice holiday dinner'
        },
        householdItemWithoutNote: {
            clientId: '12345678',
            submittedBy: userId,
            itemCategory: 'Household',
            numberOfItems: 2,
            name: 'bedding'
        },
        personalHygieneItemWithoutNote: {
            clientId: '12345678',
            submittedBy: userId,
            itemCategory: 'PersonalHygiene',
            numberOfItems: 1,
            name: 'toothbrush'
        }
    };
};

describe('Item acceptance tests', () => {
    let barryId;
    before(() => {
        dropCollection(dbConnection, 'users');
        return createBarry().then(user => (barryId = user._id));
    });

    afterEach(() => {
        dropCollection(dbConnection, 'items');
        dropCollection(dbConnection, 'notes');
    });

    after(() => {
        dropCollection(dbConnection, 'users');
    });

    context('POST /api/items', () => {
        it('returns status code 200 and json payload when creating a new item without a note', () => {
            const itemData = getItemData(barryId).householdItemWithoutNote;

            return request(app)
                .post('/api/items/')
                .send(itemData)
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;
                    expect(json.payload).to.have.property('item');

                    const item = res.body.payload.item;
                    expectItemShape(item);
                    expect(item.notes).to.have.length(0);
                });
        });

        it('returns status code 200 and json payload when creating a new item with a note', () => {
            const itemData = getItemData(barryId).clothingItemWithNote;

            return request(app)
                .post('/api/items/')
                .send(itemData)
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;
                    expect(json.payload).to.have.property('item');

                    const item = res.body.payload.item;
                    expectItemShape(item);
                    expect(item.notes).to.have.length(1);
                });
        });

        it('returns status code 200 and json payload with error if a required field is not provided', () => {
            const itemData = getItemData(barryId).clothingItemWithNote;
            delete itemData.name;

            return request(app)
                .post('/api/items/')
                .send(itemData)
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json.success).to.be.false;
                    expect(json.message).to.contain('Clothing validation failed:');
                });
        });
    });

    context('GET /api/items', () => {
        it('returns status code 200 and json payload with all the items', () => {
            const item1Data = getItemData(barryId).clothingItemWithNote;
            const item2Data = getItemData(barryId).householdItemWithNote;

            return createItem(item1Data)
                .then(() => createItem(item2Data))
                .then(() =>
                    request(app)
                        .get('/api/items')
                        .expect(200)
                )
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;
                    expect(json.payload).to.have.property('items');

                    const items = res.body.payload.items;
                    expect(items).to.be.an('Array');
                    expect(items).to.have.length(2);
                    expectItemShape(items[0]);
                    expectItemShape(items[1]);
                });
        });
    });

    context('GET /api/items/:id', () => {
        it('returns the item with the given id', () => {
            let itemId;
            const itemData = getItemData(barryId).clothingItemWithNote;

            return createItem(itemData)
                .then(item => (itemId = item._id))
                .then(() =>
                    request(app)
                        .get(`/api/items/${itemId}`)
                        .expect(200)
                )
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;
                    const item = res.body.payload.item;
                    expectItemShape(item);
                });
        });
    });

    context('PUT /api/items/:id', () => {
        it('updates the size of a clothing item', () => {
            let itemId;
            let updatedSize = 'XL (46)';
            const itemData = getItemData(barryId).clothingItemWithNote;

            return createItem(itemData)
                .then(item => (itemId = item._id))
                .then(() =>
                    request(app)
                        .put(`/api/items/${itemId}`)
                        .send({ size: updatedSize })
                        .expect(200)
                )
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json.message).to.contain('item updated');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;
                    const item = res.body.payload.item;
                    expectItemShape(item);
                    expect(item.size).to.equal(updatedSize);
                });
        });

        it('updates the name of a household item', () => {
            let itemId;
            let updatedName = 'cutlery';
            const itemData = getItemData(barryId).householdItemWithoutNote;

            return createItem(itemData)
                .then(item => (itemId = item._id))
                .then(() =>
                    request(app)
                        .put(`/api/items/${itemId}`)
                        .send({ name: updatedName })
                        .expect(200)
                )
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json.message).to.contain('item updated');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;
                    const item = res.body.payload.item;
                    expectItemShape(item);
                    expect(item.name).to.equal(updatedName);
                });
        });

        it('updates the urgency of a personal hygiene item', () => {
            let itemId;
            let updatedUrgency = 'survival';
            const itemData = getItemData(barryId).personalHygieneItemWithoutNote;

            return createItem(itemData)
                .then(item => (itemId = item._id))
                .then(() =>
                    request(app)
                        .put(`/api/items/${itemId}`)
                        .send({ urgency: updatedUrgency })
                        .expect(200)
                )
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json.message).to.contain('item updated');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;
                    const item = res.body.payload.item;
                    expectItemShape(item);
                    expect(item.urgency).to.equal(updatedUrgency);
                });
        });
    });

    context('DELETE /api/items/:id', () => {
        it('deletes the item with the given id', () => {
            let itemId;
            const itemData = getItemData(barryId).clothingItemWithNote;

            return createItem(itemData)
                .then(item => (itemId = item._id))
                .then(() =>
                    request(app)
                        .delete(`/api/items/${itemId}`)
                        .expect(200)
                )
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json.message).to.contain('item deleted');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;
                    const item = res.body.payload.item;
                    expectItemShape(item);
                });
        });
    });
});

const expectItemShape = item => {
    expect(item).to.have.property('clientId');
    expect(item).to.have.property('urgency');
    expect(item).to.have.property('status');
    expect(item).to.have.property('itemCategory');
    expect(item).to.have.property('numberOfItems');
    expect(item).to.have.property('name');
    expect(item).to.have.property('notes');
    expect(item.notes).to.be.an('Array');

    if (item.itemCategory === 'Clothing') {
        expect(item).to.have.property('size');
        expect(item).to.have.property('gender');
        expect(item).to.have.property('style');
    }
};
