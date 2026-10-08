import type { NextFunction, Request, Response } from "express";
import { CreditCardService } from "../../application/credit-cards/credit-card-service";
import { getCardNumberDetails } from "../../domain/services/card-number";
import { HttpError } from "../../shared/http-error";
import { createCreditCardWithSecurityCodeSchema, updateCreditCardSchema } from "./credit-card-schemas";

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
            const input = createCreditCardWithSecurityCodeSchema.parse(request.body);
            const { cardNumber, brand, securityCode: _securityCode, ...fields } = input;
            const details = getCardNumberDetails(cardNumber);
            if (!details || details.brand !== brand) throw new HttpError(400, "El número no corresponde con la marca indicada");

            response.status(201).json(await this.service.create({ ...fields, brand, lastFour: details.lastFour }));
        } catch (error) {
            next(error);
        }
    };

    update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const input = updateCreditCardSchema.parse(request.body);
            const { cardNumber, brand, ...fields } = input;
            const details = cardNumber ? getCardNumberDetails(cardNumber) : null;
            if (cardNumber && (!details || details.brand !== brand)) {
                throw new HttpError(400, "El número no corresponde con la marca indicada");
            }

            response.json(await this.service.update(getCardId(request), {
                ...fields,
                ...(details && brand ? { brand, lastFour: details.lastFour } : {})
            }));
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