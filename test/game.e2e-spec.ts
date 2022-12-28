import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryServer } from "mongodb-memory-server";
import { Connection, connect, Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { GameService } from '../src/game/game.service';
import { fakeGames } from './fake-games';
import { GameController } from '../src/game/game.controller';
import { Game, GameSchema } from '../src/game/schemas/game.schema';

const fakeGame = fakeGames[0];
const { publisher: mockPublisher } = fakeGame;

const buildMockFn = (successResponse) => {
  return jest
    .fn()
    .mockImplementationOnce(() => successResponse)
    .mockImplementationOnce(() => new Error('Async error'));
};

describe('GameController (e2e)', () => {
  let app: INestApplication;
  const gameService = {
    findAll: buildMockFn(fakeGames),
    findOne: buildMockFn(fakeGame),
    findGamePublisher: buildMockFn(mockPublisher),
    create: buildMockFn(fakeGame),
    update: buildMockFn(fakeGame),
    remove: buildMockFn(fakeGame),
    
  };

  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let gameModel: Model<Game>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    gameModel = mongoConnection.model(Game.name, GameSchema);
    const moduleFixture = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        GameService,
        {provide: getModelToken(Game.name), useValue: gameModel},
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('/games (GET)', () => {
    const req = request(app.getHttpServer());
    req.get('/games').expect(200).expect(gameService.findAll());
    req.get('/games').expect(500).expect('Async error');
  });

  it('/games/:id (GET)', () => {
    const req = request(app.getHttpServer());
    req.get('/games/:id').expect(200).expect(gameService.findOne());
    req.get('/games/:id').expect(500).expect('Async error');
  });

  it('/games/:id/publisher (GET)', () => {
    const req = request(app.getHttpServer());
    req.get('/games/:id/publisher').expect(200).expect(gameService.findGamePublisher());
    req.get('/games/:id/publisher').expect(500).expect('Async error');
  });

  it('/games (POST)', () => {
    const req = request(app.getHttpServer());
    req.post('/games').expect(200).expect(gameService.create());
    req.post('/games').expect(500).expect('Async error');
  });

  it('/games/:id (PATCH)', () => {
    const req = request(app.getHttpServer());
    req.patch('/games/:id').expect(200).expect(gameService.update());
    req.patch('/games/:id').expect(500).expect('Async error');
  });

  it('/games/:id (DELETE)', () => {
    const req = request(app.getHttpServer());
    req.delete('/games/:id').expect(200).expect(gameService.remove());
    req.delete('/games/:id').expect(500).expect('Async error');
  });

});
