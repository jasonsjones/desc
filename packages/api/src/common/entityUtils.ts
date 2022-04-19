import Note from 'src/entity/Note';
import { EntityManager, Repository } from 'typeorm';
import { getDbConnection } from '../config/database';
import Item from '../entity/Item';
import User from '../entity/User';

export function getEntityManager(): EntityManager {
    return getDbConnection().manager;
}

export function getUserRepository(): Repository<User> {
    return getDbConnection().getRepository(User);
}

export function getItemRepository(): Repository<Item> {
    return getDbConnection().getRepository(Item);
}

export function getNoteRepository(): Repository<Note> {
    return getDbConnection().getRepository(Note);
}
