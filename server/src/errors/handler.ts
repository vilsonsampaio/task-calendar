import { ErrorRequestHandler } from 'express';
import { ValidationError } from 'yup';

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  console.error(error);

  if (error instanceof ValidationError) {
    return response.status(400).json({ message: 'Erro de validação', errors: error.errors });
  }

  return response.status(500).json({ message: 'Erro interno no servidor' });
};

export default errorHandler;