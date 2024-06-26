import { RequestHandler } from 'express';
import { Logger } from 'winston';
import { NotFoundError } from '@core/errors';
import { formatResultResponse } from '@core/format-response';
import { getPageQueryParams } from '@features/shared/presentation/controllers';
import { SprocketUseCases } from '../domain/use-cases';

// NOTE: Using arrow functions for context binding simplicity.

/**
 * Controllers receive HTTP requests, execute use cases, format and send back responses.
 */
export class SprocketController {
  constructor(
    private readonly useCases: SprocketUseCases,
    private readonly logger: Logger
  ) {}

  /**
   * Get paginated sprockets.
   * @param req HTTP request.
   * @param res HTTP response.
   */
  getAllPaged: RequestHandler = async (req, res) => {
    const { take, skip } = getPageQueryParams(req);

    const sprockets = await this.useCases.getAllPaged(take, skip);

    res.send(
      formatResultResponse(sprockets, 'sprockets', 'query', {
        details: { take, skip, count: sprockets.length },
      })
    );
  };

  /**
   * Create new sprocket.
   * @param req HTTP request.
   * @param res HTTP response.
   */
  create: RequestHandler = async (req, res) => {
    const createdSprocket = await this.useCases.create(req.body);
    res.send(formatResultResponse(createdSprocket, 'sprocket', 'mutation', { details: {} }));
  };

  /**
   * Get sprocket by id.
   * @param req HTTP request.
   * @param res HTTP response.
   */
  findById: RequestHandler = async (req, res) => {
    const id = req.params['id'];
    const sprocket = await this.useCases.findById(id);

    if (!sprocket) {
      throw new NotFoundError('Resource not found.');
    }

    res.send(formatResultResponse(sprocket, 'sprocket', 'query', { details: {} }));
  };

  /**
   * Update sprocket by id.
   * @param req HTTP request.
   * @param res HTTP response.
   */
  updateById: RequestHandler = async (req, res) => {
    const id = req.params['id'];
    const recordsAffected = await this.useCases.updateById(id, req.body);

    if (!recordsAffected) {
      throw new NotFoundError('Resource not found.');
    }

    res.send(formatResultResponse(null, 'sprocket', 'mutation', { details: { recordsAffected } }));
  };
}
