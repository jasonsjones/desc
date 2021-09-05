import { closeConnection, createPostgresConnection } from '../config/database';
import TestUtils from '../testUtils/TestUtilities';
/*
  Might be a good idea to have different setup files for different types of tests.
  These set up files can be referrenced by specific jest.config.json files depending
  on the test type (e.g. unit, integration, or acceptance)
*/

beforeAll(async () => {
    await createPostgresConnection();
    await TestUtils.dropNotes();
    await TestUtils.dropItems();
    await TestUtils.dropClientRequests();
    await TestUtils.dropUsers();
});

afterAll(async () => {
    await closeConnection();
});
