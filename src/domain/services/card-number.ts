import { randomInt } from "node:crypto";

export type CreditCardBrand = "Visa" | "Mastercard" | "American Express" | "Discover";

export interface CardNumberDetails {
    brand: CreditCardBrand;
    lastFour: string;
}

export interface GeneratedCardNumber extends CardNumberDetails {
    cardNumber: string;
}

const passesLuhn = (digits: string) => {
    let sum = 0;
    let doubleDigit = false;

    for (let index = digits.length - 1; index >= 0; index -= 1) {
        let digit = Number(digits[index]);
        if (doubleDigit) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        doubleDigit = !doubleDigit;
    }

    return sum % 10 === 0;
};

const startsWithRange = (digits: string, length: number, minimum: number, maximum: number) => {
    const prefix = Number(digits.slice(0, length));
    return digits.length >= length && prefix >= minimum && prefix <= maximum;
};

const detectBrand = (digits: string): CreditCardBrand | null => {
    if (digits.startsWith("4") && [13, 16, 19].includes(digits.length)) return "Visa";

    if (
        digits.length === 16 &&
        (startsWithRange(digits, 2, 51, 55) || startsWithRange(digits, 4, 2221, 2720))
    ) {
        return "Mastercard";
    }

    if (digits.length === 15 && (digits.startsWith("34") || digits.startsWith("37"))) {
        return "American Express";
    }

    const isDiscoverPrefix =
        digits.startsWith("6011") ||
        digits.startsWith("65") ||
        startsWithRange(digits, 3, 644, 649) ||
        startsWithRange(digits, 6, 622126, 622925);

    if (isDiscoverPrefix && digits.length >= 16 && digits.length <= 19) return "Discover";

    return null;
};

export const getCardNumberDetails = (input: string): CardNumberDetails | null => {
    const digits = input.replace(/[\s-]/g, "");
    if (!/^\d+$/.test(digits) || !passesLuhn(digits)) return null;

    const brand = detectBrand(digits);
    return brand ? { brand, lastFour: digits.slice(-4) } : null;
};

const getLuhnCheckDigit = (digits: string) => {
    let sum = 0;
    let doubleDigit = true;

    for (let index = digits.length - 1; index >= 0; index -= 1) {
        let digit = Number(digits[index]);
        if (doubleDigit) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        doubleDigit = !doubleDigit;
    }

    return String((10 - (sum % 10)) % 10);
};

const randomDigits = (length: number) =>
    Array.from({ length }, () => String(randomInt(0, 10))).join("");

const getPrefix = (brand: CreditCardBrand) => {
    switch (brand) {
        case "Visa":
            return "4";
        case "Mastercard":
            return randomInt(0, 2) === 0
                ? String(randomInt(51, 56))
                : String(randomInt(2221, 2721));
        case "American Express":
            return randomInt(0, 2) === 0 ? "34" : "37";
        case "Discover":
            return "6011";
    }
};

const getNumberLength = (brand: CreditCardBrand) =>
    brand === "American Express" ? 15 : 16;

export const generateCardNumber = (brand: CreditCardBrand): GeneratedCardNumber => {
    const prefix = getPrefix(brand);
    const partialNumber = prefix + randomDigits(getNumberLength(brand) - prefix.length - 1);
    const cardNumber = partialNumber + getLuhnCheckDigit(partialNumber);

    return { cardNumber, brand, lastFour: cardNumber.slice(-4) };
};