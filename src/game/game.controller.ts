import {
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
import { calculateDiscount, CONSTANTS } from './common/util';
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
  @ApiBadRequestResponse({ description: 'Game not found' })
  getGame(@Param('id') id: string): Promise<IGame> {
    return  this.gameService.findOne(id);
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'The publiser was returned successfully' })
  @ApiBadRequestResponse({ description: 'Game not found' })
  @Get('/:id/publisher')
  async getPublisherOfGame(@Param('id') id: string): Promise<IPublisher>  {
    const game = await this.gameService.findOne(id);
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
  @ApiBadRequestResponse({ description: 'Game not found' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiBody({type: UpdateGameDto})
  updateGame(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto): Promise<IGame> {
    return  this.gameService.update(id, updateGameDto);
  }
  
  @Delete('/:id')
  @ApiOkResponse({ description: 'The game was deleted successfully' })
  @ApiBadRequestResponse({ description: 'Game not found' })
  async removeGame(@Param('id') id: string) {
    await  this.gameService.remove(id);
    return "Game successfully removed."
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
