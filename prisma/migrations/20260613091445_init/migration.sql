-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "ProductTier" AS ENUM ('READY_TO_WEAR', 'BESPOKE', 'MADE_TO_ORDER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "JournalBlockType" AS ENUM ('PARAGRAPH', 'HEADING', 'QUOTE', 'IMAGE', 'DIVIDER');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('BESPOKE_FITTING', 'COLLECTION_PREVIEW', 'PERSONALISATION', 'GENERAL_ENQUIRY');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "hero_slides" (
    "id" TEXT NOT NULL,
    "imagePublicId" TEXT NOT NULL,
    "imageSrc" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "imagePosition" TEXT NOT NULL DEFAULT 'center',
    "headline" TEXT,
    "subheadline" TEXT,
    "ctaLabel" TEXT NOT NULL DEFAULT '',
    "ctaHref" TEXT NOT NULL DEFAULT '/ready-to-wear',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_feature_links" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "href" TEXT NOT NULL,
    "imagePublicId" TEXT NOT NULL,
    "imageSrc" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "imagePosition" TEXT NOT NULL DEFAULT 'center',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_feature_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "categorySlug" TEXT NOT NULL,
    "tier" "ProductTier" NOT NULL DEFAULT 'READY_TO_WEAR',
    "description" TEXT,
    "material" TEXT,
    "careInstructions" TEXT,
    "priceKobo" INTEGER NOT NULL,
    "comparePriceKobo" INTEGER,
    "tags" TEXT[],
    "available" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "imagePublicId" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "imagePosition" TEXT NOT NULL DEFAULT 'center',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "sku" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentReference" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "shippingAddress" JSONB,
    "itemCount" INTEGER NOT NULL DEFAULT 0,
    "subtotal" INTEGER NOT NULL,
    "shippingCost" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "notes" TEXT,
    "fulfilledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT,
    "productName" TEXT NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lookbooks" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "season" TEXT,
    "description" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "coverImagePublicId" TEXT,
    "coverImageSrc" TEXT,
    "coverImageAlt" TEXT NOT NULL DEFAULT '',
    "heroImagePublicId" TEXT,
    "heroImageSrc" TEXT,
    "heroImageAlt" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lookbooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lookbook_looks" (
    "id" TEXT NOT NULL,
    "lookbookId" TEXT NOT NULL,
    "lookNumber" TEXT,
    "title" TEXT,
    "category" TEXT,
    "description" TEXT,
    "imagePublicId" TEXT NOT NULL,
    "imageSrc" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "imagePosition" TEXT NOT NULL DEFAULT 'center',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lookbook_looks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lookbook_gallery_images" (
    "id" TEXT NOT NULL,
    "lookbookId" TEXT NOT NULL,
    "imagePublicId" TEXT NOT NULL,
    "imageSrc" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "imagePosition" TEXT NOT NULL DEFAULT 'center',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "lookbook_gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_articles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "category" TEXT,
    "author" TEXT,
    "excerpt" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "coverImagePublicId" TEXT,
    "coverImageSrc" TEXT,
    "coverImageAlt" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journal_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_blocks" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "type" "JournalBlockType" NOT NULL,
    "content" TEXT,
    "imagePublicId" TEXT,
    "imageSrc" TEXT,
    "imageAlt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "journal_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_gallery_images" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "imagePublicId" TEXT NOT NULL,
    "imageSrc" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "journal_gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "house_content" (
    "id" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL DEFAULT 'The House',
    "heroSubtitle" TEXT,
    "heroImagePublicId" TEXT,
    "heroImageSrc" TEXT,
    "heroImageAlt" TEXT NOT NULL DEFAULT '',
    "overviewTitle" TEXT,
    "overviewBody" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "house_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "house_sections" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "body" TEXT NOT NULL,
    "imagePublicId" TEXT,
    "imageSrc" TEXT,
    "imageAlt" TEXT,
    "imagePosition" TEXT NOT NULL DEFAULT 'center',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "house_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "craft_content" (
    "id" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL DEFAULT 'Craft & Legacy',
    "heroSubtitle" TEXT,
    "heroImagePublicId" TEXT,
    "heroImageSrc" TEXT,
    "heroImageAlt" TEXT NOT NULL DEFAULT '',
    "introHeading" TEXT,
    "introBody" TEXT,
    "principlesHeading" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "craft_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "craft_editorial_images" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "imagePublicId" TEXT NOT NULL,
    "imageSrc" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL DEFAULT '',
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "craft_editorial_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "craft_principles" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "craft_principles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientPhone" TEXT,
    "type" "AppointmentType" NOT NULL,
    "scheduledAt" TIMESTAMP(3),
    "message" TEXT,
    "adminNotes" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'Sam''Aila',
    "siteTagline" TEXT,
    "siteDescription" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "instagramUrl" TEXT,
    "twitterUrl" TEXT,
    "facebookUrl" TEXT,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "maintenanceMessage" TEXT,
    "appointmentsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "ordersEnabled" BOOLEAN NOT NULL DEFAULT true,
    "logoPublicId" TEXT,
    "logoSrc" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE INDEX "products_categorySlug_idx" ON "products"("categorySlug");

-- CreateIndex
CREATE INDEX "products_available_idx" ON "products"("available");

-- CreateIndex
CREATE INDEX "products_featured_idx" ON "products"("featured");

-- CreateIndex
CREATE INDEX "product_images_productId_idx" ON "product_images"("productId");

-- CreateIndex
CREATE INDEX "product_variants_productId_idx" ON "product_variants"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_paymentStatus_idx" ON "orders"("paymentStatus");

-- CreateIndex
CREATE INDEX "orders_customerEmail_idx" ON "orders"("customerEmail");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "lookbooks_slug_key" ON "lookbooks"("slug");

-- CreateIndex
CREATE INDEX "lookbooks_isPublished_idx" ON "lookbooks"("isPublished");

-- CreateIndex
CREATE INDEX "lookbook_looks_lookbookId_idx" ON "lookbook_looks"("lookbookId");

-- CreateIndex
CREATE INDEX "lookbook_gallery_images_lookbookId_idx" ON "lookbook_gallery_images"("lookbookId");

-- CreateIndex
CREATE UNIQUE INDEX "journal_articles_slug_key" ON "journal_articles"("slug");

-- CreateIndex
CREATE INDEX "journal_articles_published_idx" ON "journal_articles"("published");

-- CreateIndex
CREATE INDEX "journal_blocks_articleId_idx" ON "journal_blocks"("articleId");

-- CreateIndex
CREATE INDEX "journal_gallery_images_articleId_idx" ON "journal_gallery_images"("articleId");

-- CreateIndex
CREATE INDEX "house_sections_contentId_idx" ON "house_sections"("contentId");

-- CreateIndex
CREATE INDEX "craft_editorial_images_contentId_idx" ON "craft_editorial_images"("contentId");

-- CreateIndex
CREATE INDEX "craft_principles_contentId_idx" ON "craft_principles"("contentId");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lookbook_looks" ADD CONSTRAINT "lookbook_looks_lookbookId_fkey" FOREIGN KEY ("lookbookId") REFERENCES "lookbooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lookbook_gallery_images" ADD CONSTRAINT "lookbook_gallery_images_lookbookId_fkey" FOREIGN KEY ("lookbookId") REFERENCES "lookbooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_blocks" ADD CONSTRAINT "journal_blocks_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "journal_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_gallery_images" ADD CONSTRAINT "journal_gallery_images_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "journal_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "house_sections" ADD CONSTRAINT "house_sections_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "house_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "craft_editorial_images" ADD CONSTRAINT "craft_editorial_images_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "craft_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "craft_principles" ADD CONSTRAINT "craft_principles_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "craft_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
