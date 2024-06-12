import { RequestHandler } from 'express';
import { Logger } from 'winston';
import { SprocketUseCases } from '../domain/use-cases';
import { NotFoundError } from '@core/errors';
import { formatResultResponse } from '@core/format-response';

// NOTE: Using arrow functions for context binding simplicity.
export class SprocketController {
  constructor(
    private readonly useCases: SprocketUseCases,
    private readonly logger: Logger
  ) {}

  getAllPaged: RequestHandler = async (req, res) => {
    const sprockets = await this.useCases.getAllPaged();
    res.send(formatResultResponse(sprockets, 'sprockets', 'query', { details: {} }));
  };

  create: RequestHandler = async (req, res) => {
    const createdSprocket = await this.useCases.create(req.body);
    res.send(formatResultResponse(createdSprocket, 'sprocket', 'mutation', { details: {} }));
  };

  findById: RequestHandler = async (req, res) => {
    const id = req.params['id'];
    const sprocket = await this.useCases.findById(id);

    if (!sprocket) {
      throw new NotFoundError('Resource not found.');
    }

    res.send(formatResultResponse(sprocket, 'sprocket', 'query', { details: {} }));
  };

  updateById: RequestHandler = async (req, res) => {
    const id = req.params['id'];
    const recordsAffected = await this.useCases.updateById(id, req.body);

    if (!recordsAffected) {
      throw new NotFoundError('Resource not found.');
    }

    res.send(formatResultResponse(null, 'sprocket', 'mutation', { details: { recordsAffected } }));
  };
}
