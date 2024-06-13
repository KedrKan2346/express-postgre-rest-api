import { RequestHandler } from 'express';
import { Logger } from 'winston';
import { SprocketProductionUseCases } from '../domain/use-cases';
import { NotFoundError } from '@core/errors';
import { formatResultResponse } from '@core/format-response';
import { getPageQueryParams } from '@features/shared/presentation/controllers';

// NOTE: Using arrow functions for context binding simplicity.

/**
 * Controllers receive HTTP requests, execute use cases, format and send back responses.
 */
export class SprocketProductionController {
  constructor(
    private readonly useCases: SprocketProductionUseCases,
    private readonly logger: Logger
  ) {}

  /**
   * Get paginated sprocket production data.
   * @param req HTTP request.
   * @param res HTTP response.
   */
  getAllPaged: RequestHandler = async (req, res) => {
    const { take, skip } = getPageQueryParams(req);

    const sprocketProduction = await this.useCases.getAllPaged(take, skip);

    res.send(
      formatResultResponse(sprocketProduction, 'sprocketProduction', 'query', {
        details: { take, skip, count: sprocketProduction.length },
      })
    );
  };

  /**
   * Get paginated sprocket production data filtered by factory id.
   * @param req HTTP request.
   * @param res HTTP response.
   */
  getAllPagedByFactoryId: RequestHandler = async (req, res) => {
    const factoryId = req.params['factory_id'];
    const { take, skip } = getPageQueryParams(req);
    const factorySprocketProduction = await this.useCases.getAllPagedByFactoryId(factoryId, take, skip);

    if (!factorySprocketProduction) {
      throw new NotFoundError('Resource not found.');
    }

    res.send(
      formatResultResponse(factorySprocketProduction, 'sprocketProduction', 'query', {
        details: { take, skip, count: factorySprocketProduction.length },
      })
    );
  };
}
