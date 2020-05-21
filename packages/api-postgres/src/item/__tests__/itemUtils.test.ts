import { normalizeData, isValidItemForCategory, isValidSizeForItem } from '../itemUtils';

describe('Item utilities', () => {
    describe('normalizeData() method', () => {
        it('normalizes data when required', () => {
            const data = {
                clientId: '987654',
                category: 'Household',
                name: 'Plates',
                quantity: 4,
                location: 'Aurora House',
                requestorId: '80453b6b-d1af-4142-903b-3ba9f92e7f39',
                note: 'This should STAY title case'
            };

            const result = normalizeData(data);

            expect(result).toEqual(
                expect.objectContaining({
                    clientId: '987654',
                    category: 'household',
                    name: 'plates',
                    quantity: 4,
                    location: 'aurora house',
                    requestorId: '80453b6b-d1af-4142-903b-3ba9f92e7f39',
                    note: 'This should STAY title case'
                })
            );
        });

        it('leaves note data unchanged', () => {
            const data = {
                clientId: '987654',
                category: 'household',
                name: 'plates',
                quantity: 4,
                location: 'aurora house',
                requestorId: '80453b6b-d1af-4142-903b-3ba9f92e7f39',
                note: 'This should STAY title case'
            };

            const result = normalizeData(data);

            expect(result).toEqual(
                expect.objectContaining({
                    clientId: '987654',
                    category: 'household',
                    name: 'plates',
                    quantity: 4,
                    location: 'aurora house',
                    requestorId: '80453b6b-d1af-4142-903b-3ba9f92e7f39',
                    note: 'This should STAY title case'
                })
            );
        });

        it('leaves size data unchanged', () => {
            const data = {
                clientId: '987654',
                category: 'Clothing',
                name: 'pants',
                size: 'L (33-37/34)',
                quantity: 2,
                location: 'aurora house',
                requestorId: '80453b6b-d1af-4142-903b-3ba9f92e7f39',
                note: 'This should STAY title case'
            };

            const result = normalizeData(data);

            expect(result).toEqual(
                expect.objectContaining({
                    clientId: '987654',
                    category: 'clothing',
                    name: 'pants',
                    quantity: 2,
                    size: 'L (33-37/34)',
                    location: 'aurora house',
                    requestorId: '80453b6b-d1af-4142-903b-3ba9f92e7f39',
                    note: 'This should STAY title case'
                })
            );
        });
    });

    describe('isValidItemForCategory() method', () => {
        it.each`
            category              | item             | expected
            ${''}                 | ${''}            | ${false}
            ${'unknown'}          | ${''}            | ${false}
            ${'unknown'}          | ${'laptop'}      | ${false}
            ${'clothing'}         | ${'shirt'}       | ${true}
            ${'clothing'}         | ${'socks'}       | ${true}
            ${'clothing'}         | ${'coat'}        | ${true}
            ${'clothing'}         | ${'shampoo'}     | ${false}
            ${'clothing'}         | ${'tuxedo'}      | ${false}
            ${'engagement'}       | ${'games'}       | ${true}
            ${'engagement'}       | ${'pillows'}     | ${false}
            ${'household'}        | ${'pillows'}     | ${true}
            ${'household'}        | ${'bedding'}     | ${true}
            ${'household'}        | ${'artwork'}     | ${false}
            ${'household'}        | ${'amazon echo'} | ${false}
            ${'personal hygiene'} | ${'soap'}        | ${true}
            ${'personal hygiene'} | ${'cutlery'}     | ${false}
            ${'personal hygiene'} | ${'plates'}      | ${false}
            ${'pet'}              | ${'specify'}     | ${true}
            ${'pet'}              | ${'food'}        | ${false}
            ${'ticket'}           | ${'specify'}     | ${true}
            ${'ticket'}           | ${'soap'}        | ${false}
            ${'other'}            | ${'specify'}     | ${true}
            ${'other'}            | ${'4k tv'}       | ${false}
        `('returns $expected for $item in $category category', ({ category, item, expected }) => {
            const result = isValidItemForCategory(category, item);
            expect(result).toEqual(expected);
        });
    });

    describe('isValidSizeForItem() method', () => {
        it.each`
            item           | size                 | expected
            ${''}          | ${''}                | ${false}
            ${'shirt'}     | ${'L (10-12/42-44)'} | ${true}
            ${'coat'}      | ${'L (10-12/42-44)'} | ${true}
            ${'shirt'}     | ${'L (33-37/34)'}    | ${false}
            ${'pants'}     | ${'M (30-32/32)'}    | ${true}
            ${'shoes'}     | ${"Men's 12"}        | ${true}
            ${'shoes'}     | ${"Woman's 15"}      | ${false}
            ${'socks'}     | ${'XL'}              | ${true}
            ${'underwear'} | ${'XL'}              | ${true}
            ${'bra'}       | ${'L (37-41, C-D)'}  | ${true}
            ${'bra'}       | ${'M (37-41, C-D)'}  | ${false}
            ${'gloves'}    | ${'M'}               | ${true}
            ${'gloves'}    | ${'XXL'}             | ${false}
            ${'hat'}       | ${''}                | ${true}
            ${'scarf'}     | ${''}                | ${true}
            ${'hat'}       | ${null}              | ${true}
            ${'scarf'}     | ${null}              | ${true}
            ${'hat'}       | ${'L (33-37/34)'}    | ${false}
            ${'scarf'}     | ${'L (33-37/34)'}    | ${false}
        `('returns $expected for $item with size $size', ({ item, size, expected }) => {
            const result = isValidSizeForItem(item, size);
            expect(result).toEqual(expected);
        });
    });
});
