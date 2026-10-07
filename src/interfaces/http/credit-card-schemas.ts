import { z } from "zod";
import type { CreditCardBrand } from "../../domain/services/card-number";

const creditCardBrands = ["Visa", "Mastercard", "American Express", "Discover"] as const;

const cardFields = {
    holderName: z.string().trim().min(1).max(120),
    brand: z.enum(creditCardBrands) satisfies z.ZodType<CreditCardBrand>,
    expirationMonth: z.number().int().min(1).max(12),
    expirationYear: z.number().int().min(new Date().getFullYear()).max(9999)
};

export const createCreditCardSchema = z.strictObject(cardFields);
export const updateCreditCardSchema = z.strictObject(cardFields).partial().refine(
    (data) => Object.keys(data).length > 0,
    "Debe enviar al menos un campo para actualizar"
);