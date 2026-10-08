import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "../../shared/http-error";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    if (error instanceof ZodError) {
        const errors = error.issues.map(({ code, path, message }) => ({ code, path, message }));
        response.status(400).json({ message: "Datos inválidos", errors });
        return;
    }

    if (error instanceof HttpError) {
        response.status(error.statusCode).json({ message: error.message });
        return;
    }

    console.error(error);
    response.status(500).json({ message: "Error interno del servidor" });
};