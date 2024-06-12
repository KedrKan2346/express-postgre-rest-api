import { RequestHandler } from 'express';
import { Logger } from 'winston';
import { SprocketUseCases } from '../domain/use-cases';
import { NotFoundError } from '@core/errors';
import { formatResultResponse } from '@core/format-response';
import { tryGetNumericValue } from '@core/utils';

// NOTE: Using arrow functions for context binding simplicity.
export class SprocketController {
  constructor(
    private readonly useCases: SprocketUseCases,
    private readonly logger: Logger
  ) {}

  getAllPaged: RequestHandler = async (req, res) => {
    // Return 50 sprockets by default.
    const take = tryGetNumericValue(req.query.take) ?? 50;
    // Returns the first page by default.
    const skip = tryGetNumericValue(req.query.skip) ?? 0;
    // Fulfil use case which retrieves page of data
    const sprockets = await this.useCases.getAllPaged(take, skip);
    // Format and send http response
    res.send(
      formatResultResponse(sprockets, 'sprockets', 'query', {
        details: { take, skip, count: sprockets.length },
      })
    );
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
