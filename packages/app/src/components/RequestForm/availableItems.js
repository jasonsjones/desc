const SHIRT_OR_COAT_SIZES = [
    'XS (0/32)',
    'S (2-4/34-36)',
    'M (6-8/38-40)',
    'L (10-12/42-44)',
    'XL (14-16/46)',
    'XXL (18-20/48)',
    'XXXL (22-24-50)'
];

const SOCK_OR_UNDERWEAR_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export default {
    Clothing: {
        Shirt: {
            sizes: SHIRT_OR_COAT_SIZES
        },
        Coat: {
            sizes: SHIRT_OR_COAT_SIZES
        },
        Pants: {
            sizes: [
                'XS (25-26/28',
                'S (27-29/30)',
                'M (30-32/32)',
                'L (33-37/34)',
                'XL (38-41/36)',
                'XXL (42-46/38)',
                'XXXL (47+/40+)'
            ]
        },
        Socks: {
            sizes: SOCK_OR_UNDERWEAR_SIZES
        },
        Underwear: {
            sizes: SOCK_OR_UNDERWEAR_SIZES
        },
        Bra: {
            sizes: [
                'S (32-34, A-B)',
                'M (34-37, B-C)',
                'L (37-41, C-D)',
                'XL (40-43 D-E)',
                'XXXL (43+ D+)'
            ]
        },
        Shoes: {
            sizes: [
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
                "Women's 9",
                "Women's 9.5",
                "Women's 10",
                "Women's 10.5",
                "Women's 11",
                "Women's 11.5",
                "Women's 12",
                "Men's 6",
                "Men's 6.5",
                "Men's 7",
                "Men's 7.5",
                "Men's 8",
                "Men's 8.5",
                "Men's 9",
                "Men's 9.5",
                "Men's 10",
                "Men's 10.5",
                "Men's 11",
                "Men's 11.5",
                "Men's 12",
                "Men's 12.5",
                "Men's 13",
                "Men's 13.5",
                "Men's 14",
                "Men's 14.5",
                "Men's 15",
                "Men's 15.5",
                "Men's 16"
            ]
        },
        Gloves: {
            sizes: ['S', 'M', 'L']
        },
        Scarf: {},
        Hat: {},
        Other: {}
    },

    Household: {
        Bedding: {},
        Pillow: {},
        Plates: {},
        Cutlery: {},
        'Pots & Pans': {},
        'Napkins/Paper Towels': {},
        'Shower Curtain': {},
        Other: {}
    },

    'Personal Hygiene': {
        Soap: {},
        Shampoo: {},
        Conditioner: {},
        'Brush/Comb': {},
        Toothbrush: {},
        Toothpaste: {},
        Floss: {},
        'Feminine Pad': {},
        Tampons: {},
        'Toilet Paper': {},
        Other: {}
    },

    Engagement: {
        Artwork: {},
        Games: {},
        'Candy/Treats': {},
        Other: {}
    },

    Tickets: {
        Specify: {}
    },

    Pets: {
        Specify: {}
    },

    Other: {
        Specify: {}
    }
};
