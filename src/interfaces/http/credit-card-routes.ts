import { Router } from "express";
import { CreditCardService } from "../../application/credit-cards/credit-card-service";
import { PrismaCreditCardRepository } from "../../infrastructure/repositories/prisma-credit-card-repository";
import { CreditCardController } from "./credit-card-controller";

const repository = new PrismaCreditCardRepository();
const controller = new CreditCardController(new CreditCardService(repository));
const router = Router();

router.get("/", controller.list);
router.get("/:id", controller.get);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.delete);

export { router as creditCardRoutes };