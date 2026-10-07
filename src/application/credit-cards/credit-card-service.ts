import type { CreateCreditCard, UpdateCreditCard } from "../../domain/entities/credit-card";
import type { CreditCardRepository } from "../../domain/ports/credit-card-repository";
import { HttpError } from "../../shared/http-error";

export class CreditCardService {
    constructor(private readonly repository: CreditCardRepository) { }

    list() {
        return this.repository.findAll();
    }

    async get(id: string) {
        const card = await this.repository.findById(id);
        if (!card) throw new HttpError(404, "Tarjeta no encontrada");
        return card;
    }

    create(data: CreateCreditCard) {
        return this.repository.create(data);
    }

    async update(id: string, data: UpdateCreditCard) {
        await this.get(id);
        return this.repository.update(id, data);
    }

    async delete(id: string) {
        await this.get(id);
        await this.repository.delete(id);
    }
}