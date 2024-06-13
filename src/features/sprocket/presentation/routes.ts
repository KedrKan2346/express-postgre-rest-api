import { Router } from 'express';
import { Logger } from 'winston';
import { DataSource } from 'typeorm';
import { SprocketController } from './controllers';
import { SprocketUseCases } from '../domain/use-cases';
import { TypeOrmSprocketPersistenceService } from '../infrastructure';
import { sprocketCreateOrUpdateDtoSchema } from './validators';
import {
  createPathParamsValidator,
  createQueryParamsValidator,
  createRequestBodyValidator,
  pageQueryParamsSchema,
  createParamIdPathSchema,
} from '@features/shared/presentation/validators';

/**
 * Routes are main entry point of a feature (business entity) where all classes are initialized.
 */

/**
 * Initialize HTTP endpoint paths, persistence, and controllers.
 * @param dataSource Initialized and connected to database TypeORM data source.
 * @param logger Service logger.
 * @returns undefined.
 */
export function initSprocketRouters(dataSource: DataSource, logger: Logger) {
  const sprocketMainRouter = Router();
  const sprocketRouters = Router();
  const sprocketPersistenceService = new TypeOrmSprocketPersistenceService(dataSource, logger);
  const sprocketUseCases = new SprocketUseCases(sprocketPersistenceService, logger);
  const sprocketController = new SprocketController(sprocketUseCases, logger);

  sprocketRouters.get('/', createQueryParamsValidator(pageQueryParamsSchema), sprocketController.getAllPaged);

  sprocketRouters.get(
    '/:id',
    createPathParamsValidator(createParamIdPathSchema('id')),
    sprocketController.findById
  );

  sprocketRouters.post(
    '/',
    createRequestBodyValidator(sprocketCreateOrUpdateDtoSchema),
    sprocketController.create
  );

  sprocketRouters.put(
    '/:id',
    createPathParamsValidator(createParamIdPathSchema('id')),
    createRequestBodyValidator(sprocketCreateOrUpdateDtoSchema),
    sprocketController.updateById
  );

  sprocketMainRouter.use('/sprockets', sprocketRouters);

  return sprocketMainRouter;
}
