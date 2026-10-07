import type { NextFunction, Request, Response } from "express";
import { CreditCardService } from "../../application/credit-cards/credit-card-service";
import { generateCardNumber } from "../../domain/services/card-number";
import { HttpError } from "../../shared/http-error";
import { createCreditCardSchema, updateCreditCardSchema } from "./credit-card-schemas";

const getCardId = (request: Request) => {
    const id = request.params.id;
    if (typeof id !== "string") throw new HttpError(400, "Identificador inválido");
    return id;
};

export class CreditCardController {
    constructor(private readonly service: CreditCardService) { }

    list = async (_request: Request, response: Response, next: NextFunction) => {
        try {
            console.log("Entrando en consulta");
            response.json(await this.service.list());
        } catch (error) {
            next(error);
        }
    };

    get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            response.json(await this.service.get(getCardId(request)));
        } catch (error) {
            next(error);
        }
    };

    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const input = createCreditCardSchema.parse(request.body);
            const generated = generateCardNumber(input.brand);
            const { cardNumber, brand, lastFour } = generated;
            const card = await this.service.create({ ...input, brand, lastFour });
            response.status(201).json({ ...card, cardNumber, testOnly: true });
        } catch (error) {
            next(error);
        }
    };

    update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const input = updateCreditCardSchema.parse(request.body);
            const { brand, ...fields } = input;
            const generated = brand ? generateCardNumber(brand) : undefined;
            const card = await this.service.update(getCardId(request), {
                ...fields,
                ...(generated ? { brand: generated.brand, lastFour: generated.lastFour } : {})
            });
            response.json(generated ? { ...card, cardNumber: generated.cardNumber, testOnly: true } : card);
        } catch (error) {
            next(error);
        }
    };

    delete = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.service.delete(getCardId(request));
            response.status(204).end();
        } catch (error) {
            next(error);
        }
    };
}