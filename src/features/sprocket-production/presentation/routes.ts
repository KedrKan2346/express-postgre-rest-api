import { Router } from 'express';
import { Logger } from 'winston';
import { DataSource } from 'typeorm';
import { SprocketProductionController } from './controllers';
import { SprocketProductionUseCases } from '../domain/use-cases';
import { TypeOrmSprocketProductionPersistenceService } from '../infrastructure';
import {
  createPathParamsValidator,
  createQueryParamsValidator,
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
export function initSprocketProductionRouters(dataSource: DataSource, logger: Logger) {
  const sprocketProductionMainRouter = Router();
  const sprocketProductionRouters = Router();
  const sprocketProductionPersistenceService = new TypeOrmSprocketProductionPersistenceService(
    dataSource,
    logger
  );
  const sprocketProductionUseCases = new SprocketProductionUseCases(
    sprocketProductionPersistenceService,
    logger
  );
  const sprocketProductionController = new SprocketProductionController(sprocketProductionUseCases, logger);

  sprocketProductionRouters.get(
    '/',
    createQueryParamsValidator(pageQueryParamsSchema),
    sprocketProductionController.getAllPaged
  );

  sprocketProductionRouters.get(
    '/:factory_id',
    createPathParamsValidator(createParamIdPathSchema('factory_id')),
    createQueryParamsValidator(pageQueryParamsSchema),
    sprocketProductionController.getAllPagedByFactoryId
  );

  sprocketProductionMainRouter.use('/sprocket-productions', sprocketProductionRouters);

  return sprocketProductionMainRouter;
}
