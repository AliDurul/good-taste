const adminUser = {
    name: 'Developer Admin',
    email: 'alidrl@gmail.com',
    password: 'Goodtaste2021.,?',
    role: 'admin',
    phone: '0970732144',
    birthday: '1998-07-13'
}

const walletConfig = {
    "key": "global",
    "earnRatePercent": 0.01, // 1% of purchase price
    "expiryMonths": 12, // Points expire after 12 months
    "referralBonusReferrer": 5.00, // Referrer gets K5 for each successful referral
    "referralBonusReferred": 2.50 // Referred user gets K2.50 for signing up with referral code
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
        "earnMultiplier": 1.0,
        "color": "#c0c0c0",
        "benefits": ["Earn 1.5% back on all purchases", "Early access to sales"]
    },
    {
        "name": "Gold",
        "minSpend": 2000,
        "maxSpend": null,
        "earnMultiplier": 1.0,
        "color": "#ffd700",
        "benefits": ["Earn 2% back on all purchases", "Early access to sales", "Exclusive offers"]
    }
]

const categories = [
    { "name": "Maize", "description": "Having 10 types of products" },
    { "name": "Feed", "description": "Having 10 types of products" }
]

const products = [
    // BREAKFAST
    {
        "category": "Maize",
        "name": "B/F 5KG",
        "description": "Breakfast 5 kilogram",
        "isActive": true,
        "image": "",
        "weightKg": 5,
        "price": 42,
        "earnValue": 0.42,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Maize",
        "name": "B/F 10KG",
        "description": "Breakfast 10 kilogram",
        "isActive": true,
        "image": "https://8ucle32btw.ufs.sh/f/nkmTKdLr0IJptchkeNTIKWjQu6Xn2faUBtvCP09wOgJ43eoY",
        "weightKg": 10,
        "price": 84,
        "earnValue": 0.84,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Maize",
        "name": "B/F 12.5KG",
        "description": "Breakfast 12.5 kilogram",
        "isActive": true,
        "image": "https://8ucle32btw.ufs.sh/f/nkmTKdLr0IJp0EGFTaVr8wqYJN1SBAaUGyxMDb3unRZPj4LF",
        "weightKg": 12.5,
        "price": 103,
        "earnValue": 1.03,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Maize",
        "name": "B/F 20KG",
        "description": "Breakfast 20 kilogram",
        "isActive": true,
        "image": "",
        "weightKg": 20,
        "price": 161,
        "earnValue": 1.61,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Maize",
        "name": "B/F 25KG",
        "description": "Breakfast 25 kilogram",
        "isActive": true,
        "image": "https://8ucle32btw.ufs.sh/f/nkmTKdLr0IJpQX0jKfhuZXtbhTiN89C0MJs6f1O35cjvzByY",
        "weightKg": 25,
        "price": 205,
        "earnValue": 2.05,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Maize",
        "name": "B/F 25KG - EXP",
        "description": "Breakfast 25 kilogram - Export",
        "isActive": true,
        "image": "https://8ucle32btw.ufs.sh/f/nkmTKdLr0IJpQFjOhVuZXtbhTiN89C0MJs6f1O35cjvzByYp",
        "weightKg": 25,
        "price": 200,
        "earnValue": 2.00,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Maize",
        "name": "B/F 25KG - ZNS",
        "description": "Breakfast 25 kilogram - ZNS",
        "isActive": true,
        "image": "",
        "weightKg": 25,
        "price": 200,
        "earnValue": 2.00,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    // ROLLER
    {
        "category": "Maize",
        "name": "Roller 25KG",
        "description": "Roller 25 kilogram",
        "isActive": true,
        "image": "",
        "weightKg": 25,
        "price": 135,
        "earnValue": 1.35,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Maize",
        "name": "Roller 25KG - ZNS",
        "description": "Roller 25 kilogram - ZNS",
        "isActive": true,
        "image": "",
        "weightKg": 25,
        "price": 175,
        "earnValue": 1.75,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Maize",
        "name": "Super Roller 25KG",
        "description": "Super Roller 25 kilogram",
        "isActive": true,
        "image": "https://8ucle32btw.ufs.sh/f/nkmTKdLr0IJpBxBZ6RPn1zYJDkpahZmxQ5rgvV72K9RlITOb",
        "weightKg": 25,
        "price": 175,
        "earnValue": 1.75,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Feed",
        "name": "Broiler Starter 50KG",
        "description": "Broiler Starter 50 kilogram",
        "isActive": true,
        "image": "",
        "weightKg": 50,
        "price": 580,
        "earnValue": 5.80,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Feed",
        "name": "Broiler Starter EXP - 50KG",
        "description": "Broiler Starter Export - 50 kilogram",
        "isActive": true,
        "image": "https://8ucle32btw.ufs.sh/f/nkmTKdLr0IJpTBdVP1EsMJXatB08E9VYSyZukAQ1PnCrx4Ll",
        "weightKg": 50,
        "price": 0.00,
        "earnValue": 2.50,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Feed",
        "name": "Broiler Grower 50KG",
        "description": "Broiler Grower 50 kilogram",
        "isActive": true,
        "image": "https://8ucle32btw.ufs.sh/f/nkmTKdLr0IJpXHuoxwfsk6XPEimDbuKpw0RaeBO9GdJ3nzMc",
        "weightKg": 50,
        "price": 550,
        "earnValue": 5.50,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Feed",
        "name": "Broiler Finisher 50KG",
        "description": "Broiler Finisher 50 kilogram",
        "isActive": true,
        "image": "https://8ucle32btw.ufs.sh/f/nkmTKdLr0IJphEsACwtGVUHqxgL6cI7psN49RWhTuBbl5ECF",
        "weightKg": 50,
        "price": 520,
        "earnValue": 5.20,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Feed",
        "name": "Broiler Grower EXP - 50KG",
        "description": "Broiler Grower Export - 50 kilogram",
        "isActive": true,
        "image": "https://8ucle32btw.ufs.sh/f/nkmTKdLr0IJp0A7ml8tVr8wqYJN1SBAaUGyxMDb3unRZPj4L",
        "weightKg": 50,
        "price": 0.00,
        "earnValue": 2.50,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Feed",
        "name": "Pullet Grower 50KG",
        "description": "Pullet Grower 50 kilogram",
        "isActive": true,
        "image": "https://8ucle32btw.ufs.sh/f/nkmTKdLr0IJpTmoezCEsMJXatB08E9VYSyZukAQ1PnCrx4Ll",
        "weightKg": 50,
        "price": 500,
        "earnValue": 5.00,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    // LAYER
    {
        "category": "Feed",
        "name": "Layer 95 - 50KG",
        "description": "Layer 95 - 50 kilogram",
        "isActive": true,
        "image": "https://8ucle32btw.ufs.sh/f/nkmTKdLr0IJpFDDk00CwSd91xsm0AZcfbnw7XWYOi6RI23PV",
        "weightKg": 50,
        "price": 420,
        "earnValue": 4.20,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Feed",
        "name": "Layer 95 Concentrate - 50KG",
        "description": "Layer 95 Concentrate - 50 kilogram",
        "isActive": true,
        "image": "https://8ucle32btw.ufs.sh/f/nkmTKdLr0IJpiF5030LvD49R2JVHfEKAwW5n0Su3mklbrgIX",
        "weightKg": 50,
        "price": 550,
        "earnValue": 5.50,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Feed",
        "name": "Pig Grower - 50KG",
        "description": "Pig Grower - 50 kilogram",
        "isActive": true,
        "image": "https://8ucle32btw.ufs.sh/f/nkmTKdLr0IJpz73jtf2xRp0TIvDYSrCF7hbumWVBUXQfqJGl",
        "weightKg": 50,
        "price": 430,
        "earnValue": 4.30,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Feed",
        "name": "Pig Grower Concentrate - 50KG",
        "description": "Pig Grower Concentrate - 50 kilogram",
        "isActive": true,
        "image": "https://8ucle32btw.ufs.sh/f/nkmTKdLr0IJpM2BeecJcPnegaVpkz8RxTQNiL5jY61Cl3mBE",
        "weightKg": 50,
        "price": 570,
        "earnValue": 5.70,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    },
    {
        "category": "Feed",
        "name": "Pig Grower EXP - 50KG",
        "description": "Pig Grower Export - 50 kilogram",
        "isActive": true,
        "image": "https://8ucle32btw.ufs.sh/f/nkmTKdLr0IJpcNYVY3HJxVOlPqWMX6wG9KvhUoIFbDLmARZg",
        "weightKg": 50,
        "price": 0.00,
        "earnValue": 2.50,
        "stockQty": 100000000,
        "lowStockThreshold": 30
    }
]

const workers = [
    {
        "name": "Hakan Demir Director",
        "email": "hakandemir@gmail.com",
        "password": "Admin1234",
        "role": "admin",
        "phone": "1234567890",
        "birthday": "1998-07-13"
    },
    {
        "name": 'Baha Mihoglu Project Manager',
        "email": 'bahamihoglu@gmail.com',
        "password": 'Admin1234',
        "role": 'admin',
        "phone": '1234567890',
        "birthday": '1990-01-01'
    },
    {
        "name": "Thomas Sanyati",
        "email": "thomassanyati@gmail.com",
        "password": "Admin1234",
        "role": "agent",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "Mervis Factory",
        "email": "mervisfactory@gmail.com",
        "password": "Agent1234",
        "role": "agent",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "Given Lewa",
        "email": "givenlewa@gmail.com",
        "password": "Agent1234",
        "role": "agent",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "Steward Kangwa",
        "email": "stewardkangwa@gmail.com",
        "password": "Agent1234",
        "role": "agent",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    }, {
        "name": "Chilufya Katangwe",
        "email": "chilufyakatangwe@gmail.com",
        "password": "Agent1234",
        "role": "agent",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "Mwendabai Sinyinda",
        "email": "mwendabaisinyinda@gmail.com",
        "password": "Agent1234",
        "role": "agent",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "Chiwemwe",
        "email": "chiwemwe@gmail.com",
        "password": "Officer1234",
        "role": "officer",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    },
    {
        "name": "Morgan Ngosa",
        "email": "morganngosa@gmail.com",
        "password": "Officer1234",
        "role": "officer",
        "phone": "1234567890",
        "birthday": "1990-01-01"
    }
]

import { hashPassword } from "better-auth/crypto";
import { prisma } from "../src/lib/prisma"

async function eraseDatabase() {
    // Delete in reverse dependency order
    await prisma.promotionTargetCategory.deleteMany({});
    await prisma.promotionTargetTier.deleteMany({});
    await prisma.promotion.deleteMany({});
    await prisma.tierHistory.deleteMany({});
    await prisma.loyaltyTier.deleteMany({});
    await prisma.walletConfig.deleteMany({});
    await prisma.walletTransaction.deleteMany({});
    await prisma.qRCode.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.verification.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.user.deleteMany({});
}

async function main() {

    try {
        await eraseDatabase();
        console.log('Database erased');
    } catch (e) {
        console.error('Error erasing database:', e);
    }

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
                const createdProduct = await prisma.product.create({
                    data: {
                        name: product.name,
                        description: product.description,
                        isActive: product.isActive,
                        image: product.image,
                        categoryId: createdCategory.id,
                        weightKg: product.weightKg,
                        price: product.price,
                        earnValue: product.earnValue,
                        stockQty: product.stockQty,
                        lowStockThreshold: product.lowStockThreshold,
                    }
                });
                console.log(`Product '${createdProduct.name}' created`);
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