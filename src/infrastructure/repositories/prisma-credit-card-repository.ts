import type { CreateCreditCard, UpdateCreditCard } from "../../domain/entities/credit-card";
import type { CreditCardRepository } from "../../domain/ports/credit-card-repository";
import { HttpError } from "../../shared/http-error";
import { prisma } from "../database/prisma-client";

const isRecordNotFound = (error: unknown) =>
    typeof error === "object" && error !== null && "code" in error && error.code === "P2025";

export class PrismaCreditCardRepository implements CreditCardRepository {
    findAll() {
        return prisma.creditCard.findMany({ orderBy: { createdAt: "desc" } });
    }

    findById(id: string) {
        return prisma.creditCard.findUnique({ where: { id } });
    }

    create(data: CreateCreditCard) {
        return prisma.creditCard.create({ data });
    }

    async update(id: string, data: UpdateCreditCard) {
        try {
            return await prisma.creditCard.update({ where: { id }, data });
        } catch (error) {
            if (isRecordNotFound(error)) throw new HttpError(404, "Tarjeta no encontrada");
            throw error;
        }
    }

    async delete(id: string) {
        try {
            await prisma.creditCard.delete({ where: { id } });
        } catch (error) {
            if (isRecordNotFound(error)) throw new HttpError(404, "Tarjeta no encontrada");
            throw error;
        }
    }
}