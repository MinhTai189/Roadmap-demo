import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { JWTGuard } from '../auth/strategies/jwt.strategy';
import { CheckedExamination } from './dto/checked-examination.dto';
import { ListExaminationDto } from './dto/list-examination.dto';
import { ExaminationResult } from './dto/result-examination.dto';
import { ExaminationService } from './examination.service';
import { ExaminationType } from './interfaces/examination-type.interface';

@ApiTags('Examination')
@Controller('examinations')
export class ExaminationController {
  constructor(private readonly examinationService: ExaminationService) {}

  @Get(':quantity/:type')
  @ApiOperation({ summary: 'Get List of Examinations' })
  @ApiCreatedResponse({
    description: 'List of Examinations have been returned successfully',
    type: ListExaminationDto,
  })
  @ApiQuery({
    name: 'type',
    enum: ExaminationType,
  })
  @ApiQuery({
    name: 'quantity',
    type: 'number',
  })
  @UseGuards(JWTGuard)
  get(
    @Param('quantity', ParseIntPipe) quantity: number,
    @Param('type') type: ExaminationType,
    @User('id') userId: number,
  ) {
    return this.examinationService.get(type, quantity, userId);
  }

  @Post('/submit/:type')
  @ApiOperation({ summary: 'Submitting examination' })
  @ApiCreatedResponse({
    description: 'The topic have been created successfully',
    type: CheckedExamination,
  })
  @ApiBody({
    type: ExaminationResult,
    isArray: true,
    description: 'Submitted result',
  })
  @ApiQuery({
    name: 'type',
    enum: ExaminationType,
  })
  @UseGuards(JWTGuard)
  create(
    @Body() results: ExaminationResult[],
    @Param('type') type: ExaminationType,
    @User('id') userId: number,
  ) {
    return this.examinationService.checkAnswers(results, type, userId);
  }
}
