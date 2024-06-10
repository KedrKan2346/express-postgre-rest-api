import { RequestHandler } from 'express';

export const getAllSprockets: RequestHandler = (req, res) => {
  res.send('Hello World');
};
