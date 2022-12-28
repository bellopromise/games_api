import {  BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from 'mongoose';
import { Messages } from './common/util';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './schemas/game.schema';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private readonly gameModel: Model<Game>) {}

  findAll() {
    return this.gameModel.find().exec();
  }

  async findOne(id: string) {
   return await this.gameModel.findById(id).exec();
  } 

  async findByReleaseDateLowerThan(date: Date) {
    return await this.gameModel.find({ releaseDate: { $lte: date } }).exec();
  }

  async findByReleaseDateBetween(startDate: Date, endDate: Date) {
    return await this.gameModel
      .find({ releaseDate: { $gte: startDate, $lte: endDate } })
      .exec();
  }

  

  async create(createGameDto: CreateGameDto) {
    return await this.gameModel.create(createGameDto);
  }

  async update(id: string, updateGameDto: UpdateGameDto)  {
    if(!Types.ObjectId.isValid(id))
      throw new BadRequestException(Messages.errorInvalidId);
    const game  = await this.gameModel.findById(id);
    if(!game)
      throw new BadRequestException(Messages.errorGameNotFound);
    return await this.gameModel.findByIdAndUpdate(id, updateGameDto, {new: true}).exec();
    
  }

  async remove(id: string) {
    try {
      if(!Types.ObjectId.isValid(id))
        throw new BadRequestException(Messages.errorInvalidId);
      const game  = await this.gameModel.findById(id);
      if(!game)
        throw new BadRequestException(Messages.errorGameNotFound);
      return await this.gameModel.findByIdAndRemove(id).exec();
    }
    catch(error)
    {
      return error
    }
    
  }

  async removeAll(ids: string[]) {
    try{
      const gamesExists  = await this.gameModel.exists({ _id: [ids] });
        if(!gamesExists)
          throw new BadRequestException(Messages.errorGamesNotFound);
        return this.gameModel.deleteMany({ id: [ids] });
   }
    catch(error)
    {
      return error
    }
    
  }
  
  
}
