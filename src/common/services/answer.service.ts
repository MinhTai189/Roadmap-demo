import { VocabularyType } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import { generateRandomNumbers } from '../utils/random-numbers';
import { ExaminationType } from 'src/modules/examination/interfaces/examination-type.interface';

export class AnswerService {
  viAnswers = {};
  enAnswer = {};

  constructor() {
    const viPath = join(__dirname, '../../../static/word.vie.json');
    const enPath = join(__dirname, '../../../static/word.eng.json');

    this.viAnswers = JSON.parse(readFileSync(viPath, 'utf8'));
    this.enAnswer = JSON.parse(readFileSync(enPath, 'utf8'));
  }

  getRandomAnswers(
    types: VocabularyType[],
    quantity = 3,
    lang: ExaminationType,
  ) {
    const answers: any =
      lang === ExaminationType.e2v ? this.viAnswers : this.enAnswer;
    const combinedAnswers = types.reduce((acc, type) => {
      return acc.concat(answers.data[type] ?? []);
    }, []);

    const randomIndexes = generateRandomNumbers(
      0,
      combinedAnswers.length,
      quantity,
    );

    return randomIndexes.map((index) => combinedAnswers[index]);
  }
}
