import { Test, TestingModule } from '@nestjs/testing';
import { isAfter, isBefore, subMonths } from 'date-fns';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { fakeGames } from '../../test/fake-games';
import { CONSTANTS } from './common/util';

describe('GameController', () => {
  let controller: GameController;

  const fakeFindByReleaseDateLowerThan = jest
    .fn()
    .mockImplementation(async () => {
      const date = subMonths(new Date(), 18);
      return fakeGames.filter((game) =>
        isBefore(new Date(game.releaseDate), date),
      );
    });

  const fakeByReleaseDateBetween = jest.fn().mockImplementation(async () => {
    const currentDate = new Date();

    const startDate = subMonths(currentDate, CONSTANTS.endMonths);
    const endDate = subMonths(currentDate, CONSTANTS.startMonths);

    return fakeGames.filter((game) => {
      const releaseDate = new Date(game.releaseDate);

      return (isAfter(releaseDate, startDate) &&  isBefore(releaseDate, endDate));
    });
  });

  const fakeGameService = {
    create: jest.fn(),
    findAll: jest.fn().mockReturnValue(fakeGames),
    findByReleaseDateBetween: fakeByReleaseDateBetween,
    findByReleaseDateLowerThan: fakeFindByReleaseDateLowerThan,
    findOne: jest.fn().mockReturnValue(fakeGames[1]),
    update: jest.fn(),
    remove: jest.fn(),
    removeAll: jest.fn(),
  };

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date());
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [{ provide: GameService, useValue: fakeGameService }],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  it('should be able to call the getGames function', () => {
    controller.getGames();
    expect(fakeGameService.findAll).toHaveBeenCalled();
  });

  it('should be able to call the createGame function', () => {
    const createGameDto: CreateGameDto = new CreateGameDto();
    controller.createGame(createGameDto);
    expect(fakeGameService.create).toHaveBeenCalledWith(createGameDto);
  });

  it('should be able to call getGame function', () => {
    const id = '63a8bf8d67c14ffece6ef351';
    controller.getGame(id);
    expect(fakeGameService.findOne).toHaveBeenCalledWith(id);
  });

  it('should be able to call getPublisherOfGame function', async () => {
    const id = '63a8bf8d67c14ffece6ef351';
    const res = await controller.getPublisherOfGame(id);
    expect(fakeGameService.findOne).toHaveBeenCalledWith(id);
    expect(res).toBe(fakeGames[1].publisher);
  });

  

  it('should be able to call updateGame function', () => {
    const id = '63a8bf8d67c14ffece6ef351';
    const updateGameDto: UpdateGameDto = new UpdateGameDto();
    controller.updateGame(id, updateGameDto);
    expect(fakeGameService.update).toHaveBeenCalledWith(id, updateGameDto);
  });

  it('should be able to call removeGame function', () => {
    const id = '63a8bf8d67c14ffece6ef351';
    controller.removeGame(id);
    expect(fakeGameService.remove).toHaveBeenCalledWith(id);
  });

  it('should be able to call the TakeDiscount() function', async () => {
    const currentDate = new Date();
    const startDate = subMonths(currentDate, CONSTANTS.endMonths);
    const endDate = subMonths(currentDate, CONSTANTS.startMonths);

    await controller.TakeDiscount();

    expect(fakeGameService.findByReleaseDateBetween).toHaveBeenCalledWith(
      startDate,
      endDate,
    );

    const game = fakeGames[0]; 

    expect(fakeGameService.update).toHaveBeenCalledWith(game._id, {
      ...game, price: game.price - game.price * CONSTANTS.discount,
    });

  });

  it('should be able to call the RemoveOldGames function', async () => {
    const date = subMonths(new Date(), 18);

    await controller.RemoveOldGames();
    expect(fakeGameService.findByReleaseDateLowerThan).toHaveBeenCalledWith(
      date,
    );
    expect(fakeGameService.removeAll).toHaveBeenCalledWith([fakeGames[1]._id, fakeGames[2]._id]);
  });
  
  afterAll(() => {
    jest.useRealTimers();
  });
});
