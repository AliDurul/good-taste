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
        "password": "Agent1234",
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

    // Dummy data for dashboards & reports
    await seedDummyData();

}

// =============================================================================
// DUMMY DATA — customers, orders, wallet activity, promotions
// Everything below only ADDS data on top of the base seed above.
// =============================================================================

const dummyCustomers = [
    { name: "Bwalya Mutale", email: "bwalyamutale@gmail.com", city: "Lusaka", address: "Plot 12, Kamwala South" },
    { name: "Chanda Mwansa", email: "chandamwansa@gmail.com", city: "Lusaka", address: "House 45, Chilenje" },
    { name: "Mulenga Phiri", email: "mulengaphiri@gmail.com", city: "Kitwe", address: "Stand 8, Riverside" },
    { name: "Natasha Banda", email: "natashabanda@gmail.com", city: "Ndola", address: "Plot 3, Itawa" },
    { name: "Joseph Tembo", email: "josephtembo@gmail.com", city: "Lusaka", address: "House 102, Matero East" },
    { name: "Mary Zulu", email: "maryzulu@gmail.com", city: "Livingstone", address: "Plot 7, Dambwa North" },
    { name: "Patrick Lungu", email: "patricklungu@gmail.com", city: "Chipata", address: "Stand 21, Moth" },
    { name: "Grace Daka", email: "gracedaka@gmail.com", city: "Lusaka", address: "House 9, Kabwata" },
    { name: "Emmanuel Sakala", email: "emmanuelsakala@gmail.com", city: "Kabwe", address: "Plot 14, Lukanga" },
    { name: "Charity Mumba", email: "charitymumba@gmail.com", city: "Kitwe", address: "House 33, Parklands" },
    { name: "Kennedy Musonda", email: "kennedymusonda@gmail.com", city: "Ndola", address: "Stand 5, Kansenshi" },
    { name: "Beatrice Ngoma", email: "beatricengoma@gmail.com", city: "Lusaka", address: "Plot 67, Avondale" },
    { name: "Moses Kabwe", email: "moseskabwe@gmail.com", city: "Solwezi", address: "House 11, Kyawama" },
    { name: "Esther Chileshe", email: "estherchileshe@gmail.com", city: "Lusaka", address: "Plot 28, Woodlands" },
    { name: "Gift Simukonda", email: "giftsimukonda@gmail.com", city: "Choma", address: "Stand 4, Shampande" },
    { name: "Ruth Nyirenda", email: "ruthnyirenda@gmail.com", city: "Lusaka", address: "House 50, Garden Compound" },
    { name: "Brian Chisenga", email: "brianchisenga@gmail.com", city: "Kitwe", address: "Plot 19, Nkana East" },
    { name: "Agnes Mwape", email: "agnesmwape@gmail.com", city: "Mansa", address: "House 6, Senama" },
    { name: "Davies Mbewe", email: "daviesmbewe@gmail.com", city: "Lusaka", address: "Plot 88, Chelstone" },
    { name: "Lillian Kasonde", email: "lilliankasonde@gmail.com", city: "Ndola", address: "Stand 17, Northrise" },
    { name: "Felix Mwila", email: "felixmwila@gmail.com", city: "Luanshya", address: "House 23, Roan" },
    { name: "Precious Soko", email: "precioussoko@gmail.com", city: "Lusaka", address: "Plot 31, Ibex Hill" },
    { name: "Oscar Hamweemba", email: "oscarhamweemba@gmail.com", city: "Monze", address: "Stand 2, Freedom Compound" },
    { name: "Janet Mulonda", email: "janetmulonda@gmail.com", city: "Mongu", address: "House 15, Lumulunga" },
    { name: "Victor Siame", email: "victorsiame@gmail.com", city: "Kasama", address: "Plot 40, Location" },
]

const lowStockDummyProducts = [
    {
        category: "Feed",
        name: "Village Chicken Mash 25KG",
        description: "Village chicken mash 25 kilogram",
        weightKg: 25, price: 260, earnValue: 2.60, stockQty: 8, lowStockThreshold: 30,
    },
    {
        category: "Feed",
        name: "Sow & Weaner 50KG",
        description: "Sow and weaner meal 50 kilogram",
        weightKg: 50, price: 460, earnValue: 4.60, stockQty: 0, lowStockThreshold: 30,
    },
]

const cancelReasons = [
    "Customer changed mind",
    "Out of stock",
    "Wrong delivery address",
    "Payment failed",
    "Duplicate order",
]

// Deterministic PRNG so every reseed produces the same dummy data
function mulberry32(seed: number) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const rand = mulberry32(20260611);
const randInt = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)]!;
const chance = (p: number) => rand() < p;
const round2 = (n: number) => parseFloat(n.toFixed(2));
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

function pickPaymentMethod(): "cash" | "mobile_money" | "bank_transfer" | "wallet" {
    const r = rand();
    if (r < 0.45) return "cash";
    if (r < 0.80) return "mobile_money";
    if (r < 0.90) return "bank_transfer";
    return "wallet";
}

function pickStatus(daysAgo: number): "pending" | "confirmed" | "out_for_delivery" | "delivered" | "completed" | "cancelled" {
    // Very recent orders are still moving through the pipeline
    if (daysAgo <= 2) return pick(["pending", "pending", "confirmed", "confirmed", "out_for_delivery", "delivered", "completed"]);
    const r = rand();
    if (daysAgo <= 10) {
        if (r < 0.50) return "completed";
        if (r < 0.65) return "delivered";
        if (r < 0.72) return "confirmed";
        if (r < 0.78) return "out_for_delivery";
        if (r < 0.82) return "pending";
        return "cancelled";
    }
    // Older orders ended up either completed, abandoned at delivered, or cancelled
    if (r < 0.74) return "completed";
    if (r < 0.80) return "delivered";
    return "cancelled";
}

async function seedDummyData() {

    const existingOrders = await prisma.order.count();
    if (existingOrders > 0) {
        console.log("Dummy data already exists, skipping");
        return;
    }

    console.log("Seeding dummy data...");

    const now = new Date();
    const agents = await prisma.user.findMany({ where: { role: "agent" } });
    const officers = await prisma.user.findMany({ where: { role: "officer" } });
    const tiers = await prisma.loyaltyTier.findMany({ orderBy: { minSpend: "asc" } });
    const feedCategory = await prisma.category.findFirst({ where: { name: "Feed" } });

    // ── Extra low-stock products (so the low-stock dashboard widget has data)
    if (feedCategory) {
        for (const product of lowStockDummyProducts) {
            await prisma.product.create({
                data: {
                    name: product.name,
                    description: product.description,
                    isActive: true,
                    image: "",
                    categoryId: feedCategory.id,
                    weightKg: product.weightKg,
                    price: product.price,
                    earnValue: product.earnValue,
                    stockQty: product.stockQty,
                    lowStockThreshold: product.lowStockThreshold,
                },
            });
        }
        console.log(`${lowStockDummyProducts.length} low-stock dummy products created`);
    }

    // ── Customers ─────────────────────────────────────────────────────────
    const customerHashedPassword = await hashPassword("Customer1234");
    // Spend profile drives order frequency/size so tiers spread across Bronze/Silver/Gold
    type SpendProfile = "small" | "medium" | "large";
    const customers: { id: string; createdAt: Date; assignedAgentId: string; profile: SpendProfile }[] = [];

    for (let i = 0; i < dummyCustomers.length; i++) {
        const c = dummyCustomers[i]!;
        const agent = agents[i % agents.length]!;
        const profile: SpendProfile = i % 3 === 0 ? "large" : i % 3 === 1 ? "medium" : "small";
        // Most customers joined 2–14 months ago; the last few are brand new (this month)
        const ageDays = i < 20 ? randInt(60, 420) : randInt(2, 25);
        const createdAt = new Date(now.getTime() - ageDays * DAY);

        const customer = await prisma.user.create({
            data: {
                name: c.name,
                email: c.email,
                role: "customer",
                phone: `09${randInt(50, 97)}${randInt(100000, 999999)}`,
                birthday: new Date(randInt(1965, 2003), randInt(0, 11), randInt(1, 28)),
                address: c.address,
                city: c.city,
                country: "Zambia",
                referralCode: `GT-${String(i + 1).padStart(4, "0")}`,
                assignedAgentId: agent.id,
                createdAt,
            },
        });
        await prisma.account.create({
            data: {
                accountId: customer.email,
                providerId: "credential",
                userId: customer.id,
                password: customerHashedPassword,
            },
        });
        customers.push({ id: customer.id, createdAt, assignedAgentId: agent.id, profile });
    }
    console.log(`${customers.length} dummy customers created`);

    // ── Orders (~300 over the last 12 months, weighted toward recent) ─────
    const sellableProducts = await prisma.product.findMany({ where: { price: { gt: 0 } } });
    const cheapProducts = sellableProducts.filter((p) => p.price <= 210);

    // Heavy buyers place most of the orders; small buyers order occasionally
    const weightedCustomers = customers.flatMap((c) =>
        Array(c.profile === "large" ? 6 : c.profile === "medium" ? 3 : 1).fill(c) as typeof customers
    );

    type CompletedInfo = {
        orderId: string
        customerId: string
        walletEarned: number
        walletRedeemed: number
        finalAmount: number
        completedAt: Date
        deliveredAt: Date
        agentId: string
        totalAmount: number
        itemsSummary: { name: string; qty: number; subtotal: number }[]
    }
    const completedOrders: CompletedInfo[] = [];
    let orderCount = 0;
    let qrCount = 0;

    for (let i = 0; i < 300; i++) {
        const customer = pick(weightedCustomers);
        const customerAgeDays = Math.floor((now.getTime() - customer.createdAt.getTime()) / DAY);
        if (customerAgeDays < 1) continue;

        // Quadratic weighting → more orders in recent weeks, history thins out
        let daysAgo = Math.floor(365 * Math.pow(rand(), 2.2));
        daysAgo = Math.min(daysAgo, customerAgeDays - 1);
        const createdAt = new Date(now.getTime() - daysAgo * DAY - randInt(0, 12) * HOUR);

        // Basket size follows the customer's spend profile
        const itemCount = customer.profile === "large" ? randInt(1, 3) : customer.profile === "medium" ? randInt(1, 2) : 1;
        const maxQty = customer.profile === "large" ? 5 : customer.profile === "medium" ? 2 : 1;
        const productPool = customer.profile === "small" ? cheapProducts : sellableProducts;
        const chosen = new Map<string, { product: (typeof sellableProducts)[number]; quantity: number }>();
        for (let j = 0; j < itemCount; j++) {
            const product = pick(productPool);
            if (!chosen.has(product.id)) chosen.set(product.id, { product, quantity: randInt(1, maxQty) });
        }

        let totalAmount = 0;
        let walletEarned = 0;
        const items = [...chosen.values()].map(({ product, quantity }) => {
            const subtotal = round2(product.price * quantity);
            totalAmount += subtotal;
            walletEarned += product.earnValue * quantity;
            return {
                productId: product.id,
                productName: product.name,
                productPrice: product.price,
                earnValue: product.earnValue,
                quantity,
                subtotal,
            };
        });
        totalAmount = round2(totalAmount);
        walletEarned = round2(walletEarned);

        const status = pickStatus(daysAgo);
        const discountAmount = chance(0.15) ? round2(totalAmount * (randInt(5, 10) / 100)) : 0;
        const walletRedeemed = status === "completed" && chance(0.12) ? round2(Math.min(randInt(5, 20), totalAmount - discountAmount)) : 0;
        const finalAmount = round2(totalAmount - discountAmount - walletRedeemed);
        const placedByRoll = rand();
        const placedBy = placedByRoll < 0.6 ? "customer" : placedByRoll < 0.9 ? "agent" : "officer";
        const paymentMethod = pickPaymentMethod();

        // Lifecycle timestamps consistent with the final status
        const confirmedAt = new Date(createdAt.getTime() + randInt(1, 24) * HOUR);
        const outForDeliveryAt = new Date(confirmedAt.getTime() + randInt(2, 24) * HOUR);
        const deliveredAt = new Date(outForDeliveryAt.getTime() + randInt(4, 48) * HOUR);
        const completedAt = new Date(deliveredAt.getTime() + randInt(1, 20) * HOUR);
        const cancelledAt = new Date(createdAt.getTime() + randInt(2, 48) * HOUR);

        const reached = {
            confirmed: ["confirmed", "out_for_delivery", "delivered", "completed"].includes(status),
            outForDelivery: ["out_for_delivery", "delivered", "completed"].includes(status),
            delivered: ["delivered", "completed"].includes(status),
            completed: status === "completed",
            cancelled: status === "cancelled",
        };

        const paymentStatus = reached.completed
            ? "paid"
            : reached.cancelled
                ? (chance(0.3) ? "failed" : "pending")
                : (reached.delivered && chance(0.5) ? "paid" : "pending");

        const order = await prisma.order.create({
            data: {
                customerId: customer.id,
                agentId: customer.assignedAgentId,
                status,
                placedBy,
                paymentStatus,
                paymentMethod,
                totalAmount,
                discountAmount,
                finalAmount,
                isFreeDelivery: chance(0.08),
                walletEarned: reached.cancelled ? 0 : walletEarned,
                walletRedeemed,
                deliveryAddress: dummyCustomers[customers.indexOf(customer)]?.address ?? null,
                notes: chance(0.2) ? pick(["Call on arrival", "Deliver after 14:00", "Leave at the gate", "Customer prefers morning delivery"]) : null,
                confirmedAt: reached.confirmed ? confirmedAt : null,
                outForDeliveryAt: reached.outForDelivery ? outForDeliveryAt : null,
                deliveredAt: reached.delivered ? deliveredAt : null,
                completedAt: reached.completed ? completedAt : null,
                paymentConfirmedAt: reached.delivered ? deliveredAt : null,
                paidAt: paymentStatus === "paid" ? (reached.completed ? completedAt : deliveredAt) : null,
                cancelledAt: reached.cancelled ? cancelledAt : null,
                cancelReason: reached.cancelled ? pick(cancelReasons) : null,
                createdAt,
                items: { create: items },
            },
        });
        orderCount++;

        const itemsSummary = items.map((item) => ({ name: item.productName, qty: item.quantity, subtotal: item.subtotal }));

        // QR codes: active for freshly delivered orders, used for a sample of completed ones
        if (status === "delivered" || (status === "completed" && chance(0.25))) {
            await prisma.qRCode.create({
                data: {
                    code: `gt_dummy_${order.id.slice(0, 8)}_${i}`,
                    orderId: order.id,
                    customerId: customer.id,
                    agentId: customer.assignedAgentId,
                    isUsed: status === "completed",
                    usedAt: status === "completed" ? completedAt : null,
                    expiresAt: new Date(deliveredAt.getTime() + 24 * HOUR),
                    amountToCredit: walletEarned,
                    totalAmount,
                    orderReference: `GT${order.id.slice(0, 8).toUpperCase()}`,
                    itemsSummary: JSON.stringify(itemsSummary),
                },
            });
            qrCount++;
        }

        if (reached.completed) {
            completedOrders.push({
                orderId: order.id,
                customerId: customer.id,
                walletEarned,
                walletRedeemed,
                finalAmount,
                completedAt,
                deliveredAt,
                agentId: customer.assignedAgentId,
                totalAmount,
                itemsSummary,
            });
        }
    }
    console.log(`${orderCount} dummy orders created (${completedOrders.length} completed, ${qrCount} QR codes)`);

    // ── Wallet transactions, balances, tiers ──────────────────────────────
    const tierFor = (totalSpend: number) =>
        [...tiers].reverse().find((t) => totalSpend >= t.minSpend) ?? tiers[0]!;

    let txCount = 0;
    for (let i = 0; i < customers.length; i++) {
        const customer = customers[i]!;
        const myOrders = completedOrders
            .filter((o) => o.customerId === customer.id)
            .sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime());

        let balance = 0;
        let totalSpend = 0;
        let currentTier = tierFor(0);

        // Initial tier history at registration
        await prisma.tierHistory.create({
            data: {
                customerId: customer.id,
                fromTierId: null,
                toTierId: currentTier.id,
                reason: "initial",
                changedAt: customer.createdAt,
            },
        });

        // A few customers got a referral bonus shortly after joining
        if (i < 5) {
            balance = round2(balance + 5.0);
            await prisma.walletTransaction.create({
                data: {
                    customerId: customer.id,
                    type: "bonus_referral",
                    amount: 5.0,
                    balance,
                    description: "Referral bonus — invited a friend",
                    expiresAt: new Date(customer.createdAt.getTime() + 365 * DAY),
                    createdAt: new Date(customer.createdAt.getTime() + randInt(1, 5) * DAY),
                },
            });
            txCount++;
        }

        for (const order of myOrders) {
            if (order.walletRedeemed > 0) {
                balance = round2(balance - order.walletRedeemed);
                await prisma.walletTransaction.create({
                    data: {
                        customerId: customer.id,
                        type: "redeemed",
                        amount: -order.walletRedeemed,
                        balance,
                        description: `Wallet redeemed for order #${order.orderId}`,
                        orderId: order.orderId,
                        createdAt: order.completedAt,
                    },
                });
                txCount++;
            }

            balance = round2(balance + order.walletEarned);
            await prisma.walletTransaction.create({
                data: {
                    customerId: customer.id,
                    type: "earned",
                    amount: order.walletEarned,
                    balance,
                    description: `Points earned for GT${order.orderId.slice(0, 8).toUpperCase()}`,
                    orderId: order.orderId,
                    expiresAt: new Date(order.completedAt.getTime() + 365 * DAY),
                    createdAt: order.completedAt,
                },
            });
            txCount++;

            totalSpend = round2(totalSpend + order.finalAmount);
            const newTier = tierFor(totalSpend);
            if (newTier.id !== currentTier.id) {
                await prisma.tierHistory.create({
                    data: {
                        customerId: customer.id,
                        fromTierId: currentTier.id,
                        toTierId: newTier.id,
                        reason: "upgrade",
                        changedAt: order.completedAt,
                    },
                });
                currentTier = newTier;
            }
        }

        await prisma.user.update({
            where: { id: customer.id },
            data: {
                walletBalance: balance,
                totalSpend,
                tierId: currentTier.id,
            },
        });
    }
    console.log(`${txCount} wallet transactions created, customer balances & tiers updated`);

    // ── Promotions ────────────────────────────────────────────────────────
    const goldTier = tiers.find((t) => t.name === "Gold");
    const maizeCategory = await prisma.category.findFirst({ where: { name: "Maize" } });

    const doublePoints = await prisma.promotion.create({
        data: {
            name: "Gold Member Double Points",
            description: "Gold tier members earn 2x wallet points on every purchase",
            type: "double_points",
            isActive: true,
            discountValue: 2,
            startsAt: new Date(now.getTime() - 30 * DAY),
            endsAt: new Date(now.getTime() + 60 * DAY),
            usageCount: 14,
        },
    });
    if (goldTier) {
        await prisma.promotionTargetTier.create({ data: { promotionId: doublePoints.id, tierId: goldTier.id } });
    }

    const maizeDiscount = await prisma.promotion.create({
        data: {
            name: "Maize Madness 10% Off",
            description: "10% off all maize products this season",
            type: "percentage_discount",
            isActive: true,
            discountValue: 10,
            startsAt: new Date(now.getTime() - 14 * DAY),
            endsAt: new Date(now.getTime() + 30 * DAY),
            usageLimit: 200,
            usageCount: 38,
        },
    });
    if (maizeCategory) {
        await prisma.promotionTargetCategory.create({ data: { promotionId: maizeDiscount.id, categoryId: maizeCategory.id } });
    }

    await prisma.promotion.create({
        data: {
            name: "Independence Free Delivery",
            description: "Free delivery on all orders during independence week",
            type: "free_delivery",
            isActive: false,
            startsAt: new Date(now.getTime() - 240 * DAY),
            endsAt: new Date(now.getTime() - 233 * DAY),
            usageCount: 52,
        },
    });
    console.log("3 dummy promotions created");

    console.log("Dummy data seeding complete");
}


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });