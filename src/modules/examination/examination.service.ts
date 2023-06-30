import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VocabularyType } from '@prisma/client';
import { find, shuffle } from 'lodash';
import moment from 'moment';
import { AnswerService } from 'src/common/services/answer.service';
import { BoxDto, VocabularyDto } from 'src/generated/dtos';
import { BoxService } from '../box/box.service';
import { VocabularyService } from '../vocabulary/vocabulary.service';
import { ExaminationResult } from './dto/result-examination.dto';
import { ExaminationType } from './interfaces/examination-type.interface';

@Injectable()
export class ExaminationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly boxService: BoxService,
    private readonly vocabularyService: VocabularyService,
    private readonly answerService: AnswerService,
  ) {}

  async get(type: ExaminationType, quantity: number, userId: number) {
    const foundAllBox = await this.getBoxes(userId);

    return this.getVocabularies(foundAllBox, type, quantity);
  }

  async checkAnswers(
    results: ExaminationResult[],
    type: ExaminationType,
    userId: number,
  ) {
    const _result = {
      correct: [],
      wrong: [],
    };
    const mapKey = type === ExaminationType.e2v ? 'meaning' : 'name';

    const vocabIds = results.map((res) => res.id);
    const foundVocabs = await this.vocabularyService.getAll({
      where: {
        id: {
          in: vocabIds,
        },
      },
      include: {
        box: true,
      },
    });
    const updatedVocabs = [];

    results.forEach((res) => {
      const foundVocab = find(foundVocabs.data, ['id', res.id]);

      if (
        res.answer.trim().toLocaleLowerCase() ===
        foundVocab[mapKey].trim().toLocaleLowerCase()
      ) {
        _result.correct.push(foundVocab);
        updatedVocabs.push(this.movingVocab(foundVocab, 'inc', userId));
      } else {
        _result.wrong.push(foundVocab);
        updatedVocabs.push(this.movingVocab(foundVocab, 'dec', userId));
      }
    });

    await Promise.all(updatedVocabs);

    return _result;
  }

  private async movingVocab(
    vocab: VocabularyDto,
    type: 'inc' | 'dec',
    userId: number,
  ) {
    const foundAllBox = await this.getBoxes(userId);
    const { id, box } = vocab;
    let updateBoxId = null;

    switch (type) {
      case 'inc':
        updateBoxId = foundAllBox[box.level]?.id;
        break;
      case 'dec':
        updateBoxId = foundAllBox[box.level - 2]?.id;
        break;
    }

    if (!updateBoxId) return;

    await this.vocabularyService.update(id, {
      box: {
        connect: { id: updateBoxId },
      },
    });
  }

  private getVocabularies(
    boxes: BoxDto[],
    type: ExaminationType,
    quantity: number,
  ) {
    const _vocabularies = [];

    for (let i = 0; i < boxes.length; i++) {
      const { vocabularies, timeline } = boxes[i];

      for (let i = 0; i < vocabularies.length; i++) {
        const vocab = vocabularies[i];

        if (this.isValidVocab(vocab, timeline)) {
          const typedVocab = this.getTypedVocab(vocab, type);

          _vocabularies.push({
            ...typedVocab,
            answers: shuffle(
              typedVocab.answers.concat(
                this.answerService.getRandomAnswers(
                  vocab.types as VocabularyType[],
                  3,
                  type,
                ),
              ),
            ),
            type,
          });
        }

        if (_vocabularies.length === quantity) return _vocabularies;
      }
    }

    return _vocabularies;
  }

  private isValidVocab(voca: VocabularyDto, timeline: number) {
    if (!voca.reviewedAt) return true;

    return moment().isSameOrAfter(
      moment(voca.reviewedAt).add(timeline, 'days'),
      'days',
    );
  }

  private getTypedVocab(vocab, type: ExaminationType) {
    switch (type) {
      case ExaminationType.e2v:
        vocab.answers = [vocab.meaning];
        delete vocab.meaning;
        break;
      case ExaminationType.v2e:
        vocab.answers = [vocab.name];
        delete vocab.name;
        break;
    }

    return vocab;
  }

  private async getBoxes(userId: number) {
    const foundAllBox = await this.boxService.getAll<BoxDto>(
      {
        orderBy: {
          level: 'asc',
        },
        include: {
          vocabularies: true,
        },
      },
      userId,
    );

    return foundAllBox.data;
  }
}
