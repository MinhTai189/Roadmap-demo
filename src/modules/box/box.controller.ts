import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BoxService } from './box.service';
import { ListBoxDto } from './dto/list-topic.dto';
import { ListResourcePayloadDto } from 'src/common/dtos/list-resource.dto';
import { JWTGuard } from '../auth/strategies/jwt.strategy';
import { User } from 'src/common/decorators/user.decorator';
import { ConvertedQuery } from 'src/common/decorators/query.decorator';

@ApiTags('Box')
@Controller('boxes')
export class BoxController {
  constructor(private readonly boxService: BoxService) {}

  @Get()
  @ApiOperation({ summary: 'Get List of Boxes' })
  @ApiCreatedResponse({
    description: 'List of boxes have been returned successfully',
    type: ListBoxDto,
  })
  @UseGuards(JWTGuard)
  get(
    @ConvertedQuery() listRequestDto: ListResourcePayloadDto,
    @User('id') userId: number,
  ) {
    return this.boxService.getAll(listRequestDto, userId);
  }
}
