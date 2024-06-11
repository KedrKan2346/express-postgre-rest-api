import { Router } from 'express';
import { Logger } from 'winston';
import { DataSource } from 'typeorm';
import { SprocketController } from './controller';
import { SprocketUseCases } from '../domain/use-cases';
import { TypeOrmSprocketPersistenceService } from '../infrastructure';

export function initSprocketRouters(dataSource: DataSource, logger: Logger) {
  const sprocketMainRouter = Router();
  const sprocketRouters = Router();
  const sprocketPersistenceService = new TypeOrmSprocketPersistenceService(dataSource, logger);
  const sprocketUseCases = new SprocketUseCases(sprocketPersistenceService, logger);
  const sprocketController = new SprocketController(sprocketUseCases, logger);

  sprocketRouters.get('/', sprocketController.getAllPaged);

  sprocketRouters.get('/:id', sprocketController.findById);

  sprocketRouters.post('/', sprocketController.create);

  sprocketRouters.put('/:id', sprocketController.updateById);

  sprocketMainRouter.use('/sprockets', sprocketRouters);

  return sprocketMainRouter;
}
