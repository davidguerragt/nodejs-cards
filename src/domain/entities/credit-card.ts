export interface CreditCard {
    id: string;
    holderName: string;
    brand: string;
    lastFour: string;
    expirationMonth: number;
    expirationYear: number;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateCreditCard = Omit<CreditCard, "id" | "createdAt" | "updatedAt">;
export type UpdateCreditCard = Partial<CreateCreditCard>;