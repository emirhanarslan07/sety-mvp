import { Paddle, Environment } from '@paddle/paddle-node-sdk';

const apiKey = process.env.PADDLE_API_KEY || '';
const environment = process.env.PADDLE_ENVIRONMENT === 'production' ? Environment.production : Environment.sandbox;

export const paddle = new Paddle(apiKey, {
  environment,
});
