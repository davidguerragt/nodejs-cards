import type { CreateCreditCard, CreditCard, UpdateCreditCard } from "../entities/credit-card";

export interface CreditCardRepository {
    findAll(): Promise<CreditCard[]>;
    findById(id: string): Promise<CreditCard | null>;
    create(data: CreateCreditCard): Promise<CreditCard>;
    update(id: string, data: UpdateCreditCard): Promise<CreditCard>;
    delete(id: string): Promise<void>;
}