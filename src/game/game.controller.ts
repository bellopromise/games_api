import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subMonths } from 'date-fns';
import { Messages } from './common/util';
import { calculateDiscount, CONSTANTS } from './common/util';
import { Types, Model } from 'mongoose';
import { IGame } from './interfaces/game.interface';
import { IPublisher } from './interfaces/publisher.interface';

@ApiTags("Games")
@Controller("games")
export class GameController {
  constructor(private readonly gameService: GameService) {}
  
  
  @Get('/')
  @ApiOkResponse({ description: 'The games were returned successfully' })
  getGames(): Promise<IGame[]> {
    return this.gameService.findAll();
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'The game was returned successfully' })
  @ApiNotFoundResponse({ description: 'Game not found' })
  async getGame(@Param('id') id: string): Promise<IGame> {
    if(!Types.ObjectId.isValid(id))
      throw new BadRequestException(Messages.errorInvalidId);
    const game =  await this.gameService.findOne(id);
    if(!game)
      throw new BadRequestException(Messages.errorGameNotFound);
    return game;
  }

  @Get('/:id/publisher')
  @ApiOkResponse({ description: 'The publiser was returned successfully' })
  @ApiNotFoundResponse({ description: 'Game not found' })
  async getPublisherOfGame(@Param('id') id: string): Promise<IPublisher>  {
    if(!Types.ObjectId.isValid(id))
      throw new BadRequestException(Messages.errorInvalidId);
    const game =  await this.gameService.findOne(id);
    if(!game)
      throw new BadRequestException(Messages.errorGameNotFound);
    const { publisher } = game;
    return publisher;
  }

  @Post('/')
  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiBody({type: CreateGameDto})
  createGame(@Body() createGameDto: CreateGameDto): Promise<IGame> {
    return  this.gameService.create(createGameDto);
  }

  @Patch('/:id')
  @ApiOkResponse({ description: 'The game was updated successfully' })
  @ApiNotFoundResponse({ description: 'Game not found' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiBody({type: UpdateGameDto})
  updateGame(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto): Promise<IGame> {
    return  this.gameService.update(id, updateGameDto);
  }
  
  @Delete('/:id')
  @ApiOkResponse({ description: 'The game was deleted successfully' })
  @ApiNotFoundResponse({ description: 'Game not found' })
  async removeGame(@Param('id') id: string) {
    return await  this.gameService.remove(id);
  }

  

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async TakeDiscount() {
    try {
      console.log('TakeDiscount() starts');

      const currentDate = new Date();

      const startDate = subMonths(currentDate, CONSTANTS.endMonths);
      const endDate = subMonths(currentDate, CONSTANTS.startMonths);

      const gamesForDiscount = await this.gameService.findByReleaseDateBetween( startDate,  endDate);

      console.log(`TakeDiscount(): ID of games found- ${gamesForDiscount.map(({ _id }) => _id)}`);

      gamesForDiscount.forEach((game) =>{
        let disCountedPrice: number = calculateDiscount(game.price, CONSTANTS.discount);
        this.gameService.update(game._id, { ...game,  price: disCountedPrice})
      });

      console.log('TakeDiscount(): done');
    } catch (err) {
      console.error(`TakeDiscount(): error: (${err}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async RemoveOldGames() {
    try {
      console.log('RemoveOldGames():  starts');

      const date = subMonths(new Date(), 18);
      const gamesToRemove = await this.gameService.findByReleaseDateLowerThan(date);

      console.log( `RemoveOldGames(): ID of games found- ${gamesToRemove.map(({ _id }) => _id)}`);

      if (gamesToRemove.length)
        this.gameService.removeAll(gamesToRemove.map(({ _id }) => _id));

      console.log('RemoveOldGames(): done');

    } catch (err) {
      console.error(`RemoveOldGames(): error: ${err}`);
    }
  }

  
}
