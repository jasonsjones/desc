import User from '../entity/User';
import Item from '../entity/Item';
import { EntityManager, Repository } from 'typeorm';
import { getDbConnection } from '../config/database';

export function getEntityManager(): EntityManager {
    return getDbConnection().manager;
}

export function getUserRepository(): Repository<User> {
    return getDbConnection().getRepository(User);
}

export function getItemRepository(): Repository<Item> {
    return getDbConnection().getRepository(Item);
}
