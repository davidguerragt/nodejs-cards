USE `cards_db`;

CREATE TABLE `CreditCard` (
  `id` VARCHAR(191) NOT NULL,
  `holderName` VARCHAR(120) NOT NULL,
  `brand` VARCHAR(40) NOT NULL,
  `lastFour` CHAR(4) NOT NULL,
  `expirationMonth` INTEGER NOT NULL,
  `expirationYear` INTEGER NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `CreditCard_holderName_idx` (`holderName`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;