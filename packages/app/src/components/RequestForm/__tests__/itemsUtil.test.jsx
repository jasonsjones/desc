import * as Util from '../itemsUtil';

describe('Item Utilities', () => {
    describe('determines sizes of items', () => {
        it('fetches the correct sizes for a shirt', () => {
            const sizes = Util.getItemSizes('Clothing', 'Shirt');
            expect(sizes).toStrictEqual([
                'XS (0/32)',
                'S (2-4/34-36)',
                'M (6-8/38-40)',
                'L (10-12/42-44)',
                'XL (14-16/46)',
                'XXL (18-20/48)',
                'XXXL (22-24-50)'
            ]);
        });

        it('fetches the correct sizes for a coat', () => {
            const sizes = Util.getItemSizes('Clothing', 'Coat');
            expect(sizes).toStrictEqual([
                'XS (0/32)',
                'S (2-4/34-36)',
                'M (6-8/38-40)',
                'L (10-12/42-44)',
                'XL (14-16/46)',
                'XXL (18-20/48)',
                'XXXL (22-24-50)'
            ]);
        });

        it('fetches the correct sizes for pants', () => {
            const sizes = Util.getItemSizes('Clothing', 'Pants');
            expect(sizes).toStrictEqual([
                'XS (25-26/28)',
                'S (27-29/30)',
                'M (30-32/32)',
                'L (33-37/34)',
                'XL (38-41/36)',
                'XXL (42-46/38)',
                'XXXL (47+/40+)'
            ]);
        });

        it('fetches the correct sizes for shoes', () => {
            const sizes = Util.getItemSizes('Clothing', 'Shoes');
            expect(sizes).toEqual(
                expect.arrayContaining([
                    "Women's 4",
                    "Women's 4.5",
                    "Women's 5",
                    "Women's 5.5",
                    "Women's 6",
                    "Women's 6.5",
                    "Women's 7",
                    "Women's 7.5",
                    "Women's 8",
                    "Women's 8.5",
                    "Men's 9",
                    "Men's 9.5",
                    "Men's 10",
                    "Men's 10.5",
                    "Men's 11",
                    "Men's 11.5",
                    "Men's 12",
                    "Men's 12.5",
                    "Men's 13"
                ])
            );
        });

        it('fetches the correct sizes for socks', () => {
            const socks = Util.getItemSizes('Clothing', 'Socks', 'Female');
            expect(socks).toStrictEqual(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']);
        });

        it('fetches the correct sizes for gloves', () => {
            const gloves = Util.getItemSizes('Clothing', 'Gloves');
            expect(gloves).toStrictEqual(['S', 'M', 'L']);
        });

        it('non clothing items have no sizes', () => {
            const result = Util.getItemSizes('Household', 'Pillow');
            expect(result).toBeUndefined();
        });
    });
});
