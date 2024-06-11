import { RequestHandler } from 'express';
import { Logger } from 'winston';
import { SprocketUseCases } from '../domain/use-cases';

// NOTE: Using arrow functions for context binding simplicity.
export class SprocketController {
  constructor(
    private readonly useCases: SprocketUseCases,
    private readonly logger: Logger
  ) {}

  getAllPaged: RequestHandler = async (req, res) => {
    const sprockets = await this.useCases.getAllPaged();
    res.send(sprockets);
  };

  create: RequestHandler = async (req, res) => {
    const newSprocket = await this.useCases.create(req.body);
    res.send(newSprocket);
  };

  findById: RequestHandler = async (req, res) => {
    const id = req.params['id'];
    const newSprocket = await this.useCases.findById(id);
    res.send(newSprocket);
  };

  updateById: RequestHandler = async (req, res) => {
    const id = req.params['id'];
    const recordsAffected = await this.useCases.updateById(id, req.body);
    res.send({ recordsAffected });
  };
}
