const adminUser = {
    name: 'admin',
    email: 'admin@test.com',
    image: 'https://example.com/images/admin.jpg',
    password: 'admin1234',
    role: 'admin',
    phone: '1234567890',
    birthday: '1998-07-13'
}

const walletConfig = {
    "key": "global",
    "earnRatePercent": 0.01, // 1% of purchase price
    "expiryMonths": 12,
    "referralBonusReferrer": 5.00,
    "referralBonusReferred": 2.50
}

const loyaltyTiers = [
    {
        "name": "Bronze",
        "minSpend": 0,
        "maxSpend": 499.99,
        "color": "#cd7f32",
        "benefits": ["Earn 1% back on all purchases"]
    },
    {
        "name": "Silver",
        "minSpend": 500,
        "maxSpend": 1999.99,
        "color": "#c0c0c0",
        "benefits": ["Earn 1.5% back on all purchases", "Early access to sales"]
    },
    {
        "name": "Gold",
        "minSpend": 2000,
        "maxSpend": null,
        "color": "#ffd700",
        "benefits": ["Earn 2% back on all purchases", "Early access to sales", "Exclusive offers"]
    }
]


const categories = [
    { "name": "Feed", "description": "Having 10 types of products" },
    { "name": "Maize", "description": "Having 10 types of products" }
]

const products = [
    {
        "name": "B/F",
        "description": "Breakfast",
        "images": ["https://example.com/images/productbf.jpg"],
        "isActive": true,
        "categoryId": "737b2989-5e04-48d8-9506-a98666eb427f",
        "variants": [
            {
                "weightKg": 25,
                "weightLabel": "25kg",
                "price": 250.00,
                "earnValue": 2.50,
                "images": ["https://cdn.cloudflare.com/variants/breakfast-25kg.jpg"],
                "stockQty": 0,
                "lowStockThreshold": 30
            },
            {
                "weightKg": 20,
                "weightLabel": "20kg",
                "price": 200.00,
                "earnValue": 2.00,
                "images": ["https://cdn.cloudflare.com/variants/breakfast-20kg.jpg"],
                "stockQty": 0,
                "lowStockThreshold": 30
            },
            {
                "weightKg": 12.5,
                "weightLabel": "12.5kg",
                "price": 125.00,
                "earnValue": 1.25,
                "images": ["https://cdn.cloudflare.com/variants/breakfast-12_5kg.jpg"],
                "stockQty": 0,
                "lowStockThreshold": 30
            },
            {
                "weightKg": 10,
                "weightLabel": "10kg",
                "price": 100.00,
                "earnValue": 1.00,
                "images": ["https://cdn.cloudflare.com/variants/breakfast-10kg.jpg"],
                "stockQty": 0,
                "lowStockThreshold": 30
            },
            {
                "weightKg": 5,
                "weightLabel": "5kg",
                "price": 50.00,
                "earnValue": 0.50,
                "images": ["https://cdn.cloudflare.com/variants/breakfast-5kg.jpg"],
                "stockQty": 0,
                "lowStockThreshold": 30
            }
        ]
    },
    {
        "name": "B/F ZNS",
        "description": "Breakfast ZNS",
        "images": ["https://example.com/images/productzns.jpg"],
        "isActive": true,
        "categoryId": "737b2989-5e04-48d8-9506-a98666eb427f",
        "variants": [
            {
                "weightKg": 25,
                "weightLabel": "25kg",
                "price": 275.00,
                "earnValue": 2.75,
                "images": ["https://cdn.cloudflare.com/variants/breakfastzns-25kg.jpg"],
                "stockQty": 0,
                "lowStockThreshold": 30
            }
        ]
    },
    {
        "name": "B/F EXP",
        "description": "Breakfast EXP",
        "images": ["https://example.com/images/productexp.jpg"],
        "isActive": true,
        "categoryId": "737b2989-5e04-48d8-9506-a98666eb427f",
        "variants": [
            {
                "weightKg": 25,
                "weightLabel": "25kg",
                "price": 300.00,
                "earnValue": 3.00,
                "images": ["https://cdn.cloudflare.com/variants/breakfastexp-25kg.jpg"],
                "stockQty": 0,
                "lowStockThreshold": 30
            }
        ]
    },
    {
        "name": "Roller",
        "description": "Roller",
        "images": ["https://example.com/images/productroller12_5.jpg"],
        "isActive": true,
        "categoryId": "737b2989-5e04-48d8-9506-a98666eb427f",
        "variants": [
            {
                "weightKg": 25,
                "weightLabel": "25kg",
                "price": 250.00,
                "earnValue": 2.50,
                "images": ["https://cdn.cloudflare.com/variants/breakfastzns-25kg.jpg"],
                "stockQty": 0,
                "lowStockThreshold": 30
            }
        ]
    },
    {
        "name": "Super Roller",
        "description": "Super Roller",
        "images": ["https://example.com/images/productroller12_5.jpg"],
        "isActive": true,
        "categoryId": "737b2989-5e04-48d8-9506-a98666eb427f",
        "variants": [
            {
                "weightKg": 25,
                "weightLabel": "25kg",
                "price": 300.00,
                "earnValue": 3.00,
                "images": ["https://cdn.cloudflare.com/variants/breakfastzns-25kg.jpg"],
                "stockQty": 0,
                "lowStockThreshold": 30
            }
        ]
    },
]

const workers = [
    {
        "name": "agent1",
        "email": "agent1@test.com",
        "image": "https://example.com/images/agent1.jpg",
        "password": "pass1234",
        "role": "agent",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "agent2",
        "email": "agent2@test.com",
        "image": "https://example.com/images/agent2.jpg",
        "password": "pass1234",
        "role": "agent",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "agent3",
        "email": "agent3@test.com",
        "image": "https://example.com/images/agent3.jpg",
        "password": "pass1234",
        "role": "agent",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "agent4",
        "email": "agent4@test.com",
        "image": "https://example.com/images/agent4.jpg",
        "password": "pass1234",
        "role": "agent",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "officer1",
        "email": "officer1@test.com",
        "image": "https://example.com/images/officer1.jpg",
        "password": "pass1234",
        "role": "officer",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "officer2",
        "email": "officer2@test.com",
        "image": "https://example.com/images/officer2.jpg",
        "password": "pass1234",
        "role": "officer",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    }, {
        "name": "officer3",
        "email": "officer3@test.com",
        "image": "https://example.com/images/officer3.jpg",
        "password": "pass1234",
        "role": "officer",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "officer4",
        "email": "officer4@test.com",
        "image": "https://example.com/images/officer4.jpg",
        "password": "pass1234",
        "role": "officer",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "officer5",
        "email": "officer5@test.com",
        "image": "https://example.com/images/officer5.jpg",
        "password": "pass1234",
        "role": "officer",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "customer1",
        "email": "customer1@test.com",
        "image": "https://example.com/images/customer1.jpg",
        "password": "pass1234",
        "role": "customer",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    }
]


