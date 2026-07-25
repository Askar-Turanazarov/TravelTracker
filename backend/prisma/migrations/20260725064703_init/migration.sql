-- CreateEnum
CREATE TYPE "Role" AS ENUM ('traveler', 'admin');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(60) NOT NULL,
    "display_name" VARCHAR(100) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'traveler',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries_reference" (
    "code" CHAR(2) NOT NULL,
    "name_en" VARCHAR(100) NOT NULL,
    "name_ru" VARCHAR(100) NOT NULL,
    "region" VARCHAR(50) NOT NULL,
    "centroid_lat" DECIMAL(9,6) NOT NULL,
    "centroid_lng" DECIMAL(9,6) NOT NULL,

    CONSTRAINT "countries_reference_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "cities_reference" (
    "id" SERIAL NOT NULL,
    "country_code" CHAR(2) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "population" INTEGER,

    CONSTRAINT "cities_reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visited_countries" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "country_code" CHAR(2) NOT NULL,
    "added_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visited_countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visited_cities" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "city_id" INTEGER NOT NULL,
    "country_code" CHAR(2) NOT NULL,
    "visit_date" DATE,
    "note" VARCHAR(500),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visited_cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "token_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("token_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "cities_reference_country_code_idx" ON "cities_reference"("country_code");

-- CreateIndex
CREATE INDEX "visited_countries_user_id_idx" ON "visited_countries"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "visited_countries_user_id_country_code_key" ON "visited_countries"("user_id", "country_code");

-- CreateIndex
CREATE INDEX "visited_cities_user_id_idx" ON "visited_cities"("user_id");

-- CreateIndex
CREATE INDEX "visited_cities_country_code_idx" ON "visited_cities"("country_code");

-- CreateIndex
CREATE UNIQUE INDEX "visited_cities_user_id_city_id_key" ON "visited_cities"("user_id", "city_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- AddForeignKey
ALTER TABLE "cities_reference" ADD CONSTRAINT "cities_reference_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "countries_reference"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visited_countries" ADD CONSTRAINT "visited_countries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visited_countries" ADD CONSTRAINT "visited_countries_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "countries_reference"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visited_cities" ADD CONSTRAINT "visited_cities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visited_cities" ADD CONSTRAINT "visited_cities_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities_reference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visited_cities" ADD CONSTRAINT "visited_cities_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "countries_reference"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
