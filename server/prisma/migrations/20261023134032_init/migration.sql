-- CreateTable
CREATE TABLE "hosts" (
    "id" SERIAL NOT NULL,
    "airbnbId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pictureUrl" TEXT,
    "isSuperhost" BOOLEAN NOT NULL DEFAULT false,
    "since" DATE,

    CONSTRAINT "hosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" SERIAL NOT NULL,
    "airbnbId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "pictureUrl" TEXT,
    "neighbourhood" TEXT,
    "neighbourhoodGroup" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "propertyType" TEXT NOT NULL,
    "roomType" TEXT NOT NULL,
    "accommodates" INTEGER NOT NULL,
    "bathroomsText" TEXT NOT NULL,
    "bedrooms" INTEGER,
    "beds" INTEGER,
    "amenities" TEXT[],
    "price" DECIMAL(10,2),
    "minimumNights" INTEGER NOT NULL DEFAULT 1,
    "rating" DOUBLE PRECISION,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "hostId" INTEGER NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "airbnbId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "reviewerName" TEXT NOT NULL,
    "comments" TEXT,
    "listingId" INTEGER NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_days" (
    "date" DATE NOT NULL,
    "available" BOOLEAN NOT NULL,
    "price" DECIMAL(10,2),
    "listingId" INTEGER NOT NULL,

    CONSTRAINT "calendar_days_pkey" PRIMARY KEY ("listingId","date")
);

-- CreateIndex
CREATE UNIQUE INDEX "hosts_airbnbId_key" ON "hosts"("airbnbId");

-- CreateIndex
CREATE UNIQUE INDEX "listings_airbnbId_key" ON "listings"("airbnbId");

-- CreateIndex
CREATE INDEX "listings_neighbourhoodGroup_idx" ON "listings"("neighbourhoodGroup");

-- CreateIndex
CREATE INDEX "listings_price_idx" ON "listings"("price");

-- CreateIndex
CREATE INDEX "listings_rating_idx" ON "listings"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_airbnbId_key" ON "reviews"("airbnbId");

-- CreateIndex
CREATE INDEX "reviews_listingId_date_idx" ON "reviews"("listingId", "date");

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "hosts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_days" ADD CONSTRAINT "calendar_days_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
