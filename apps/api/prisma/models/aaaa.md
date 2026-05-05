// =============================================================================
// Good Taste Ltd — Prisma Schema (PostgreSQL)
// ORM: Prisma | DB: PostgreSQL | Storage: Cloudflare URLs | Chat: WebSockets
// =============================================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// =============================================================================
// ENUMS
// =============================================================================

enum Role {
  customer
  agent
  admin
}

enum OrderStatus {
  pending
  confirmed
  out_for_delivery
  delivered
  cancelled
}

enum OrderPlacedBy {
  customer
  agent
}

enum PointsTransactionType {
  earned
  redeemed
  expired
  bonus_referral
  bonus_promotion
  manual_adjustment
}

enum TierName {
  Bronze
  Silver
  Gold
}

enum TierChangeReason {
  upgrade
  downgrade
  initial
}

enum PromotionType {
  double_points
  percentage_discount
  fixed_discount
  free_delivery
  bundle
}

enum ReferralStatus {
  pending
  completed
}

enum NotificationType {
  order_update
  points_earned
  points_expiry
  promotion
  flash_sale
  birthday
  tier_upgrade
  tier_downgrade
  referral_success
  low_stock_alert
  general
}

enum CampaignStatus {
  draft
  scheduled
  sent
  failed
}

enum OtpPurpose {
  password_reset
  phone_verify
}

enum SenderRole {
  customer
  agent
  admin
}

// =============================================================================
// AUTH & USERS
// =============================================================================

model User {
  id            String   @id @default(uuid())
  name          String
  email         String   @unique
  phone         String
  password      String                          // bcrypt hashed
  role          Role
  isActive      Boolean  @default(true)
  birthday      DateTime?                       // used for birthday push notifications

  // Location (entered at registration by customer or agent)
  address       String
  city          String?
  country       String?
  lat           Float?
  lng           Float?

  // FCM token for push notifications (latest device token)
  fcmToken      String?

  // ── Customer-only fields ──────────────────────────────
  referralCode  String?  @unique                // generated on registration
  pointsBalance Int      @default(0)
  totalSpend    Float    @default(0)            // cumulative spend, drives tier logic

  // Relations
  assignedAgentId String?
  assignedAgent   User?   @relation("AgentCustomers", fields: [assignedAgentId], references: [id])
  customers       User[]  @relation("AgentCustomers")

  referredById  String?
  referredBy    User?   @relation("Referrals", fields: [referredById], references: [id])
  referrals     User[]  @relation("Referrals")

  tierId        String?
  tier          LoyaltyTier? @relation(fields: [tierId], references: [id])

  // Auth relations
  refreshTokens RefreshToken[]
  otps          OTP[]

  // Order relations
  ordersAsCustomer  Order[]        @relation("CustomerOrders")
  ordersAsAgent     Order[]        @relation("AgentOrders")

  // Loyalty relations
  pointsTransactions PointsTransaction[]
  tierHistories      TierHistory[]
  redemptionLogs     RedemptionLog[]

  // Referral relations
  referralsSent     Referral[]  @relation("ReferrerReferrals")
  referralReceived  Referral?   @relation("ReferredReferral")

  // Notification relations
  notifications  Notification[]
  campaigns      Campaign[]

  // Chat relations
  conversationsAsCustomer Conversation[] @relation("CustomerConversations")
  conversationsAsAgent    Conversation[] @relation("AgentConversations")
  messagesSent            Message[]

  // QR codes generated for agent's deliveries
  qrCodesAsAgent    QRCode[] @relation("AgentQRCodes")
  qrCodesAsCustomer QRCode[] @relation("CustomerQRCodes")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([role])
  @@index([assignedAgentId])
  @@index([referralCode])
  @@index([tierId])
}

model RefreshToken {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  isRevoked Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId])
}

model OTP {
  id        String     @id @default(uuid())
  userId    String
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  code      String                              // 6-digit code
  purpose   OtpPurpose
  isUsed    Boolean    @default(false)
  isExpired Boolean    @default(false)          // set by cron job when expiresAt is past
  expiresAt DateTime                            // 10 minutes from creation
  createdAt DateTime   @default(now())

  @@index([userId, purpose])
}

// =============================================================================
// CATALOGUE & STOCK
// =============================================================================

model Category {
  id          String    @id @default(uuid())
  name        String    @unique
  description String?
  image       String?                           // Cloudflare URL
  isActive    Boolean   @default(true)
  products    Product[]
  promotions  PromotionCategory[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Product {
  id           String    @id @default(uuid())
  name         String
  description  String?
  price        Float
  images       String[]                         // Cloudflare URLs
  isActive     Boolean   @default(true)
  pointsValue  Int       @default(1)            // base points earned per unit ordered

  // Stock
  stockQty          Int     @default(0)
  lowStockThreshold Int     @default(10)
  isOutOfStock      Boolean @default(false)     // updated on every stock change
  lastRestockedAt   DateTime?

  categoryId  String
  category    Category   @relation(fields: [categoryId], references: [id])

  orderItems  OrderItem[]
  bundleItems PromotionBundleItem[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([categoryId])
  @@index([isActive])
  @@index([isOutOfStock])
}

// =============================================================================
// ORDERS & DELIVERY
// =============================================================================

model Order {
  id          String      @id @default(uuid())

  customerId  String
  customer    User        @relation("CustomerOrders", fields: [customerId], references: [id])

  agentId     String
  agent       User        @relation("AgentOrders", fields: [agentId], references: [id])

  status      OrderStatus @default(pending)
  placedBy    OrderPlacedBy

  totalAmount    Float
  discountAmount Float    @default(0)
  finalAmount    Float
  isFreeDelivery Boolean  @default(false)

  pointsEarned   Int      @default(0)
  pointsRedeemed Int      @default(0)

  deliveryAddress String?
  notes           String?

  cashConfirmedAt DateTime?
  deliveredAt     DateTime?
  cancelledAt     DateTime?
  cancelReason    String?

  // Relations
  items             OrderItem[]
  appliedPromotion  AppliedPromotion?
  qrCode            QRCode?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([customerId])
  @@index([agentId])
  @@index([status])
  @@index([createdAt(sort: Desc)])
}

model OrderItem {
  id           String  @id @default(uuid())
  orderId      String
  order        Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId    String
  product      Product @relation(fields: [productId], references: [id])

  // Price snapshot at time of order
  productName  String
  productPrice Float
  quantity     Int
  subtotal     Float

  @@index([orderId])
}

model AppliedPromotion {
  id               String    @id @default(uuid())
  orderId          String    @unique
  order            Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  promotionId      String?
  promotion        Promotion? @relation(fields: [promotionId], references: [id])

  // Snapshot at time of order
  promotionName    String
  type             PromotionType
  discountAmount   Float     @default(0)
  pointsMultiplier Float     @default(1)
}

model QRCode {
  id             String   @id @default(uuid())
  orderId        String   @unique
  order          Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)

  customerId     String
  customer       User     @relation("CustomerQRCodes", fields: [customerId], references: [id])

  agentId        String
  agent          User     @relation("AgentQRCodes", fields: [agentId], references: [id])

  code           String   @unique                // UUID or signed token
  expiresAt      DateTime
  isExpired      Boolean  @default(false)        // set by cron when expiresAt is past
  isUsed         Boolean  @default(false)
  usedAt         DateTime?

  pointsToCredit Int                             // pre-calculated on generation

  createdAt      DateTime @default(now())

  @@index([code])
  @@index([orderId])
  @@index([expiresAt])
}

// =============================================================================
// LOYALTY — POINTS, TIERS, REWARDS
// =============================================================================

model PointsTransaction {
  id          String                @id @default(uuid())
  customerId  String
  customer    User                  @relation(fields: [customerId], references: [id])
  type        PointsTransactionType
  amount      Int                               // positive = credit, negative = debit
  balance     Int                               // customer balance AFTER this transaction
  description String?
  orderId     String?
  expiresAt   DateTime?                         // set for 'earned' transactions
  isExpired   Boolean               @default(false) // set by cron when expiresAt is past
  createdAt   DateTime              @default(now())

  @@index([customerId, createdAt(sort: Desc)])
  @@index([customerId, expiresAt])
  @@index([isExpired, expiresAt])
}

// Singleton table — always one row with key = 'global'
model PointsConfig {
  id                   String   @id @default(uuid())
  key                  String   @unique @default("global")
  pointsPerCurrencyUnit Float   @default(1)
  expiryMonths         Int      @default(12)
  referralBonusReferrer Int     @default(50)
  referralBonusReferred Int     @default(25)
  updatedAt            DateTime @updatedAt
}

model LoyaltyTier {
  id               String    @id @default(uuid())
  name             TierName  @unique
  minPoints        Int
  maxPoints        Int?                          // null for Gold (no ceiling)
  pointsMultiplier Float     @default(1.0)
  color            String?                       // hex color for UI badge

  benefits  TierBenefit[]
  users     User[]

  fromTierHistories TierHistory[] @relation("FromTier")
  toTierHistories   TierHistory[] @relation("ToTier")

  promotionTiers PromotionTier[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model TierBenefit {
  id          String      @id @default(uuid())
  tierId      String
  tier        LoyaltyTier @relation(fields: [tierId], references: [id], onDelete: Cascade)
  description String

  @@index([tierId])
}

model TierHistory {
  id         String            @id @default(uuid())
  customerId String
  customer   User              @relation(fields: [customerId], references: [id])
  fromTierId String?
  fromTier   LoyaltyTier?      @relation("FromTier", fields: [fromTierId], references: [id])
  toTierId   String
  toTier     LoyaltyTier       @relation("ToTier",   fields: [toTierId],   references: [id])
  reason     TierChangeReason
  changedAt  DateTime          @default(now())

  @@index([customerId, changedAt(sort: Desc)])
}

model Reward {
  id          String   @id @default(uuid())
  name        String
  description String?
  pointsCost  Int
  image       String?                           // Cloudflare URL
  isActive    Boolean  @default(true)
  stock       Int?                              // null = unlimited

  redemptionLogs RedemptionLog[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model RedemptionLog {
  id          String   @id @default(uuid())
  customerId  String
  customer    User     @relation(fields: [customerId], references: [id])
  rewardId    String
  reward      Reward   @relation(fields: [rewardId], references: [id])
  rewardName  String                            // snapshot
  pointsSpent Int
  redeemedAt  DateTime @default(now())

  @@index([customerId, redeemedAt(sort: Desc)])
}

// =============================================================================
// REFERRALS
// =============================================================================

model Referral {
  id         String         @id @default(uuid())

  referrerId String
  referrer   User           @relation("ReferrerReferrals", fields: [referrerId], references: [id])

  referredId String         @unique               // one person can only be referred once
  referred   User           @relation("ReferredReferral", fields: [referredId], references: [id])

  status     ReferralStatus @default(pending)

  firstOrderId    String?                         // set when status → completed
  completedAt     DateTime?
  referrerPoints  Int?                            // points awarded to referrer
  referredPoints  Int?                            // points awarded to referred

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([referrerId])
  @@index([status])
}

// =============================================================================
// PROMOTIONS
// =============================================================================

model Promotion {
  id          String        @id @default(uuid())
  name        String
  description String?
  type        PromotionType
  value       Float?                             // discount amount or percentage
  pointsMultiplier Float    @default(1)

  startsAt    DateTime
  endsAt      DateTime
  isActive    Boolean       @default(false)      // toggled by scheduler
  usageLimit  Int?                               // null = unlimited
  usageCount  Int           @default(0)

  createdById String?
  // (no relation back to User to keep it simple — just store the admin id)

  // Targeting
  targetTiers      PromotionTier[]
  targetCategories PromotionCategory[]
  bundleItems      PromotionBundleItem[]
  appliedOrders    AppliedPromotion[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([isActive])
  @@index([startsAt, endsAt])
}

// Join table: Promotion ↔ LoyaltyTier
model PromotionTier {
  promotionId String
  promotion   Promotion   @relation(fields: [promotionId], references: [id], onDelete: Cascade)
  tierId      String
  tier        LoyaltyTier @relation(fields: [tierId], references: [id], onDelete: Cascade)

  @@id([promotionId, tierId])
}

// Join table: Promotion ↔ Category
model PromotionCategory {
  promotionId String
  promotion   Promotion @relation(fields: [promotionId], references: [id], onDelete: Cascade)
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([promotionId, categoryId])
}

// Bundle items for bundle-type promotions
model PromotionBundleItem {
  id          String    @id @default(uuid())
  promotionId String
  promotion   Promotion @relation(fields: [promotionId], references: [id], onDelete: Cascade)
  productId   String
  product     Product   @relation(fields: [productId], references: [id])
  quantity    Int

  @@index([promotionId])
}

// =============================================================================
// NOTIFICATIONS
// =============================================================================

model Notification {
  id     String           @id @default(uuid())
  userId String
  user   User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  title  String
  body   String
  type   NotificationType

  // Deep-link data as key-value JSON (passed to mobile app)
  data   Json?

  isRead Boolean   @default(false)
  readAt DateTime?

  createdAt DateTime @default(now())

  @@index([userId, createdAt(sort: Desc)])
  @@index([userId, isRead])
}

model Campaign {
  id    String   @id @default(uuid())
  title String
  body  String
  type  NotificationType @default(general)

  // Targeting — empty = broadcast to all
  targetTiers CampaignTier[]
  targetRoles Role[]

  scheduledAt     DateTime?
  sentAt          DateTime?
  status          CampaignStatus @default(draft)
  recipientCount  Int            @default(0)

  createdById String?
  createdBy   User?   @relation(fields: [createdById], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([status, scheduledAt])
}

// Join table: Campaign ↔ LoyaltyTier
model CampaignTier {
  campaignId String
  campaign   Campaign    @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  tierId     String

  @@id([campaignId, tierId])
}

// =============================================================================
// CHAT
// =============================================================================

model Conversation {
  id         String  @id @default(uuid())

  customerId String
  customer   User    @relation("CustomerConversations", fields: [customerId], references: [id])

  agentId    String
  agent      User    @relation("AgentConversations", fields: [agentId], references: [id])

  lastMessage      String?
  lastMessageAt    DateTime?
  lastMessageById  String?

  unreadByCustomer Int     @default(0)
  unreadByAgent    Int     @default(0)

  isActive  Boolean  @default(true)
  messages  Message[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([customerId, agentId])           // one conversation per customer-agent pair
  @@index([customerId, lastMessageAt(sort: Desc)])
  @@index([agentId,    lastMessageAt(sort: Desc)])
}

model Message {
  id             String       @id @default(uuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  senderId   String
  sender     User       @relation(fields: [senderId], references: [id])
  senderRole SenderRole

  body   String

  isRead Boolean   @default(false)
  readAt DateTime?

  // Optional: attach an order reference to a message
  attachedOrderId String?

  createdAt DateTime @default(now())

  @@index([conversationId, createdAt(sort: Asc)])
}
