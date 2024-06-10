import { Router } from 'express';
import { getAllSprockets } from './controller';

export function initSprocketRouters() {
  const sprocketMainRouter = Router();
  const sprocketRouters = Router();

  sprocketRouters.get('/', getAllSprockets);

  sprocketMainRouter.use('/sprockets', sprocketRouters);

  return sprocketMainRouter;
}
