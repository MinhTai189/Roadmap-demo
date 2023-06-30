import { ApiProperty } from '@nestjs/swagger';
import { VocabularyDto } from 'src/generated/dtos';

export class CheckedExamination {
  @ApiProperty({ name: 'correct', isArray: true, type: VocabularyDto })
  correct: VocabularyDto[];

  @ApiProperty({ name: 'wrong', isArray: true, type: VocabularyDto })
  wrong: VocabularyDto[];
}
