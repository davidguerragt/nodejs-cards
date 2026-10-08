import { z } from "zod";
import type { CreditCardBrand } from "../../domain/services/card-number";
import { getCardNumberDetails } from "../../domain/services/card-number";

const creditCardBrands = ["Visa", "Mastercard", "American Express", "Discover"] as const;

const cardFields = {
    holderName: z.string().trim().min(1).max(120),
    cardNumber: z.string().trim().min(1).refine(
        (value) => getCardNumberDetails(value) !== null,
        "Número de tarjeta inválido: revisa prefijo, longitud y dígito de control"
    ),
    brand: z.enum(creditCardBrands) satisfies z.ZodType<CreditCardBrand>,
    expirationMonth: z.number().int().min(1).max(12),
    expirationYear: z.number().int().min(new Date().getFullYear()).max(9999)
};

const validateBrandMatchesNumber = (
    data: { brand?: CreditCardBrand; cardNumber?: string },
    context: z.RefinementCtx
) => {
    if (!data.brand || !data.cardNumber) return;

    const details = getCardNumberDetails(data.cardNumber);
    if (details && details.brand !== data.brand) {
        context.addIssue({
            code: "custom",
            path: ["brand"],
            message: `La marca indicada no coincide con el número; corresponde a ${details.brand}`
        });
    }
};

export const createCreditCardSchema = z.strictObject(cardFields).superRefine(validateBrandMatchesNumber);
export const createCreditCardWithSecurityCodeSchema = z.strictObject({
    ...cardFields,
    securityCode: z.string().regex(/^\d{3,4}$/, "El código de seguridad debe contener solo dígitos")
}).superRefine((data, context) => {
    validateBrandMatchesNumber(data, context);

    const expectedLength = data.brand === "American Express" ? 4 : 3;
    if (data.securityCode.length !== expectedLength) {
        context.addIssue({
            code: "custom",
            path: ["securityCode"],
            message: `El código de seguridad para ${data.brand} debe tener ${expectedLength} dígitos`
        });
    }
});

export const updateCreditCardSchema = z.strictObject(cardFields).partial().superRefine((data, context) => {
    if (Object.keys(data).length === 0) {
        context.addIssue({ code: "custom", message: "Debe enviar al menos un campo para actualizar" });
        return;
    }

    if (data.cardNumber && !data.brand) {
        context.addIssue({ code: "custom", path: ["brand"], message: "La marca es obligatoria al cambiar el número" });
    }
    if (data.brand && !data.cardNumber) {
        context.addIssue({ code: "custom", path: ["cardNumber"], message: "El número es obligatorio al cambiar la marca" });
    }

    validateBrandMatchesNumber(data, context);
});