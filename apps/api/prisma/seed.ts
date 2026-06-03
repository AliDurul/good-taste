const adminUser = {
    name: 'admin',
    email: 'admin@test.com',
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
        "earnMultiplier": 1.0,
        "color": "#cd7f32",
        "benefits": ["Earn 1% back on all purchases"]
    },
    {
        "name": "Silver",
        "minSpend": 500,
        "maxSpend": 1999.99,
        "earnMultiplier": 1.5,
        "color": "#c0c0c0",
        "benefits": ["Earn 1.5% back on all purchases", "Early access to sales"]
    },
    {
        "name": "Gold",
        "minSpend": 2000,
        "maxSpend": null,
        "earnMultiplier": 2.0,
        "color": "#ffd700",
        "benefits": ["Earn 2% back on all purchases", "Early access to sales", "Exclusive offers"]
    }
]

const categories = [
    { "name": "Maize", "description": "Having 10 types of products" },
    { "name": "Feed", "description": "Having 10 types of products" }
]

const products = [
    {
        "category": "Maize",
        "name": "B/F",
        "description": "Breakfast",
        "isActive": true,
        "variants": [
            {
                "weightKg": 25,
                "weightLabel": "25kg",
                "price": 250.00,
                "earnValue": 2.50,
                "stockQty": 0,
                "lowStockThreshold": 30
            },
            {
                "weightKg": 20,
                "weightLabel": "20kg",
                "price": 200.00,
                "earnValue": 2.00,
                "stockQty": 0,
                "lowStockThreshold": 30
            },
            {
                "weightKg": 12.5,
                "weightLabel": "12.5kg",
                "price": 125.00,
                "earnValue": 1.25,
                "stockQty": 0,
                "lowStockThreshold": 30
            },
            {
                "weightKg": 10,
                "weightLabel": "10kg",
                "price": 100.00,
                "earnValue": 1.00,
                "stockQty": 0,
                "lowStockThreshold": 30
            },
            {
                "weightKg": 5,
                "weightLabel": "5kg",
                "price": 50.00,
                "earnValue": 0.50,
                "stockQty": 0,
                "lowStockThreshold": 30
            }
        ]
    },
    {
        "category": "Maize",
        "name": "B/F ZNS",
        "description": "Breakfast ZNS",
        "isActive": true,
        "variants": [
            {
                "weightKg": 25,
                "weightLabel": "25kg",
                "price": 275.00,
                "earnValue": 2.75,
                "stockQty": 0,
                "lowStockThreshold": 30
            }
        ]
    },
    {
        "category": "Maize",
        "name": "B/F EXP",
        "description": "Breakfast EXP",
        "isActive": true,
        "variants": [
            {
                "weightKg": 25,
                "weightLabel": "25kg",
                "price": 300.00,
                "earnValue": 3.00,
                "stockQty": 0,
                "lowStockThreshold": 30
            }
        ]
    },
    {
        "category": "Maize",
        "name": "Roller",
        "description": "Roller",
        "isActive": true,
        "variants": [
            {
                "weightKg": 25,
                "weightLabel": "25kg",
                "price": 250.00,
                "earnValue": 2.50,
                "stockQty": 0,
                "lowStockThreshold": 30
            }
        ]
    },
    {
        "category": "Maize",
        "name": "Super Roller",
        "description": "Super Roller",
        "isActive": true,
        "variants": [
            {
                "weightKg": 25,
                "weightLabel": "25kg",
                "price": 300.00,
                "earnValue": 3.00,
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
        "password": "pass1234",
        "role": "agent",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "agent2",
        "email": "agent2@test.com",
        "password": "pass1234",
        "role": "agent",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "agent3",
        "email": "agent3@test.com",
        "password": "pass1234",
        "role": "agent",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "agent4",
        "email": "agent4@test.com",
        "password": "pass1234",
        "role": "agent",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "officer1",
        "email": "officer1@test.com",
        "password": "pass1234",
        "role": "officer",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "officer2",
        "email": "officer2@test.com",
        "password": "pass1234",
        "role": "officer",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    }, {
        "name": "officer3",
        "email": "officer3@test.com",
        "password": "pass1234",
        "role": "officer",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "officer4",
        "email": "officer4@test.com",
        "password": "pass1234",
        "role": "officer",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "officer5",
        "email": "officer5@test.com",
        "password": "pass1234",
        "role": "officer",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "customer1",
        "email": "customer1@test.com",
        "password": "pass1234",
        "role": "customer",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    }
]

import { hashPassword } from "better-auth/crypto";
import { prisma } from "../src/lib/prisma"

async function main() {
    console.log('Seeding database...');

    let admin = await prisma.user.findFirst({ where: { email: adminUser.email } });
    if (!admin) {
        const hashedPassword = await hashPassword(adminUser.password);

        admin = await prisma.user.create({
            data: {
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role,
                phone: adminUser.phone,
                birthday: new Date(adminUser.birthday),
            }
        });

        await prisma.account.create({
            data: {
                accountId: admin.email,
                providerId: "credential",
                userId: admin.id,
                password: hashedPassword,
            }
        });


        console.log('Admin user created');

    } else {
        console.log('Admin user already exists');
    }

    // Seed wallet config
    const existingConfig = await prisma.walletConfig.findFirst({ where: { key: walletConfig.key } });
    if (!existingConfig) {
        await prisma.walletConfig.create({
            data: walletConfig
        });
        console.log('Wallet config created');
    } else {
        console.log('Wallet config already exists');
    }

    // Seed loyalty tiers
    for (const tier of loyaltyTiers) {
        const existingTier = await prisma.loyaltyTier.findFirst({ where: { name: { equals: tier.name as any } } });
        if (!existingTier) {
            await prisma.loyaltyTier.create({
                data: {
                    name: tier.name as any,
                    minSpend: tier.minSpend,
                    maxSpend: tier.maxSpend,
                    "earnMultiplier": tier.earnMultiplier,
                    color: tier.color,
                    benefits: tier.benefits,
                }
            });
            console.log(`Loyalty tier '${tier.name}' created`);
        } else {
            console.log(`Loyalty tier '${tier.name}' already exists`);
        }
    }

    // Seed categories
    for (const category of categories) {
        const existingCategory = await prisma.category.findFirst({ where: { name: category.name } });
        if (!existingCategory) {
            const createdCategory = await prisma.category.create({
                data: category
            });

            console.log(`Category '${createdCategory.name}' created`);

            // add products for this category
            const categoryProducts = products.filter(p => p.category === category.name);

            for (const product of categoryProducts) {
                const createdProductWithVariants = await prisma.product.create({
                    data: {
                        name: product.name,
                        description: product.description,
                        isActive: product.isActive,
                        categoryId: createdCategory.id,
                        variants: {
                            create: product.variants.map((v) => ({
                                weightLabel: v.weightLabel,
                                weightKg: v.weightKg,
                                price: v.price,
                                earnValue: v.earnValue,
                                stockQty: v.stockQty,
                                lowStockThreshold: v.lowStockThreshold,
                            }))
                        }
                    }
                });
                console.log(`Product '${createdProductWithVariants.name}' created`);
            }

        } else {
            console.log(`Category '${existingCategory.name}' already exists`);
        }
    }


    // Seed workers
    for (const worker of workers) {
        const existingWorker = await prisma.user.findFirst({ where: { email: worker.email } });
        if (!existingWorker) {
            const hashedPassword = await hashPassword(worker.password);
            const createdWorker = await prisma.user.create({
                data: {
                    name: worker.name,
                    email: worker.email,
                    role: worker.role,
                    phone: worker.phone,
                    birthday: new Date(worker.birthday),
                }
            });
            await prisma.account.create({
                data: {
                    accountId: worker.email,
                    providerId: "credential",
                    userId: createdWorker.id,
                    password: hashedPassword,
                }
            });
            console.log(`Worker '${createdWorker.name}' created`);
        } else {
            console.log(`Worker '${existingWorker.name}' already exists`);
        }
    }

}


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });