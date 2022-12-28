import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameService } from './game.service';
import { BadRequestException } from '@nestjs/common';
import { Messages } from './common/util';


describe('GameService', () => {
  let service: GameService;

  const fakeExists = jest
    .fn()
    .mockResolvedValueOnce(true)
    .mockResolvedValueOnce(true)
    .mockResolvedValueOnce(true)
    .mockResolvedValueOnce(false)
    .mockResolvedValueOnce(false)
    .mockResolvedValueOnce(false);

  const fakeGameProvider = {
    create: jest.fn(),
    find: jest.fn().mockImplementation(() => ({ exec: jest.fn() })),
    findById: jest.fn().mockImplementation(() => ({ exec: jest.fn() })),
    findByIdAndUpdate: jest.fn().mockImplementation(() => ({ exec: jest.fn() })),
    findByIdAndRemove: jest.fn().mockImplementation(() => ({ exec: jest.fn() })),
    deleteMany: jest.fn(),
    exists: fakeExists,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getModelToken('Game'),
        useValue: fakeGameProvider },
        GameService,
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be able to call findAll function', () => {
    const spy = jest.spyOn(service, 'findAll');
    service.findAll();
    expect(spy).toHaveBeenCalled();
    expect(fakeGameProvider.find).toHaveBeenCalled();
  });

  it('should be able to call create function with expected parameter', () => {
    const spy = jest.spyOn(service, 'create');
    const createGameDto = new CreateGameDto();
    service.create(createGameDto);
    expect(spy).toHaveBeenCalledWith(createGameDto);
    expect(fakeGameProvider.create).toHaveBeenCalled();
  });


  it('should be able to call findOne function with expected parameter', () => {
    try
    {
      const spy = jest.spyOn(service, 'findOne');
      const id = '63a8bf8d67c14ffece6ef351';
      service.findOne(id);
      expect(spy).toHaveBeenCalledWith(id);
      expect(fakeGameProvider.findById).toHaveBeenCalled();
    }
    catch(err)
    {
      expect(err).toEqual(new BadRequestException(Messages.errorGameNotFound));
    }
    
  });

  it('should call update function with expected param', async () => {
    const spy = jest.spyOn(service, 'update');
    const id = '63a8e13d092441012106c85b';
    const updateGameDto = new UpdateGameDto();
    await service.update(id, updateGameDto);
    expect(spy).toHaveBeenCalledWith(id, updateGameDto);
    expect(fakeGameProvider.findByIdAndUpdate).toHaveBeenCalled();
  });

  it('should call remove function with expected parameter', async () => {
    const spy = jest.spyOn(service, 'remove');
    const id = '63a8bf8d67c14ffece6ef351';
    await service.remove(id);
    expect(spy).toHaveBeenCalledWith(id);
    expect(fakeGameProvider.findByIdAndRemove).toHaveBeenCalled();
  });

  it('should call removeAll function with expected parameter', async () => {
    const spy = jest.spyOn(service, 'removeAll');
    const ids = ['63a8bf8d67c14ffece6ef351', '63a8e13d092441012106c85b'];
    await service.removeAll(ids);
    expect(spy).toHaveBeenCalledWith(ids);
    expect(fakeGameProvider.deleteMany).toHaveBeenCalled();
  });

  it('should be able to throw error for game not found on findOne', async () => {
    const id = '63a8e13d092441012106c85b';
    try {
      await service.findOne(id);
    } catch (err) {
      expect(err.message).toMatch(
        `Game not found`,
      );
    }
  });


  it('should be able to throw error for game not found on update', async () => {
    const id = '63a8e13d092441012106c85b';
    try {
      await service.update(id, new UpdateGameDto());
    } catch (err) {
      expect(err.message).toMatch(
        `Game not found`,
      );
    }
  });

  it('should be able to throw error for game not found on remove', async () => {
    const id = '63a8e13d092441012106c85b';
    try {
      await service.remove(id);
    } catch (err) {
      expect(err.message).toMatch(
        `Game not found`,
      );
    }
  });

  it('should throw error for game not found on removeAll', async () => {
    const ids = ['63a8e13d092441012106c85b', '63a8bf8d67c14ffece6ef351'];
    try {
      await service.removeAll(ids);
    } catch (err) {
      expect(err.message).toMatch(
        `Game(s) not found`,
      );
    }
  });

  it('should be able to call findByReleaseDateBetween function with expected parameter', () => {
    const spy = jest.spyOn( service,  'findByReleaseDateBetween');
    const startDate = new Date();
    const endDate = new Date();

    service.findByReleaseDateBetween(startDate, endDate);

    expect(spy).toHaveBeenCalledWith(startDate,  endDate,);
    expect(fakeGameProvider.find).toHaveBeenCalled();
  });

  it('should be able call findByReleaseDateLowerThan function with expected parameter', () => {
    const spy = jest.spyOn(service, 'findByReleaseDateLowerThan');
    const date = new Date();

    service.findByReleaseDateLowerThan(date);

    expect(spy).toHaveBeenCalledWith(date);
    expect(fakeGameProvider.find).toHaveBeenCalled();
  });
});
