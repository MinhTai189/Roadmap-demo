#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const Command = require('commander').Command;
const chalk = require('chalk');
const readXlsxFile = require('read-excel-file/node');
const writeXlsxFile = require('write-excel-file/node');
const { camelCase, headerCase } = require('change-case');
const { PrismaClient } = require('@prisma/client');
const pkg = require('lodash');
const cliProgress = require('cli-progress');
const colors = require('ansi-colors');

const prisma = new PrismaClient();
const { intersection, pick, flatten } = pkg;
const bar = new cliProgress.SingleBar({
  format: 'Progress |' + colors.cyan('{bar}') + '| {percentage}%\n',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
});

const REQUIRED_FIELDS = ['name', 'ipa', 'types', 'meaning', 'topic'];
const HEADER_FIELDS = [
  'name',
  'ipa',
  'types',
  'examples',
  'meaning',
  'topic',
  'user',
];
const SPLIT_FIELDS = ['types', 'examples'];
const RELATION_FIELDS = ['topic'];

const program = new Command();

const error = (error) => {
  console.log(chalk.bold.red(error));
};

const success = (message) => {
  console.log(chalk.bold.blue(message));
};

const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const isValidPath = (path, isFolder = false) => {
  const pathRegex = /^[a-z]:((\\|\/)[a-z0-9\s_@\-^!#$%&+={}\[\]\.]+)+$/gi;
  const folderPathRegex = /^[a-z]:((\\|\/)[a-z0-9\s_@\-^!#$%&+={}\[\]]+)+$/gi;

  return (isFolder ? folderPathRegex : pathRegex).test(path);
};

const isPathValid = (path) => {
  const excelExtensionRegex = /^.+\.xlsx$/;

  if (!isValidPath(path)) {
    error('The path is not a valid');

    return false;
  }

  if (!excelExtensionRegex.test(path)) {
    error('The file extension is not a valid. Only accept .xlsx extension');

    return false;
  }

  return true;
};

const getConvertedFields = (rows) => {
  const _converted = rows.map((row) => camelCase(row));

  if (
    intersection(REQUIRED_FIELDS, _converted).length !== REQUIRED_FIELDS.length
  ) {
    throw new Error(
      `The format of the data in your file is incorrect. Require to have ${REQUIRED_FIELDS.map(
        (e) => headerCase(e),
      )} fields`,
    );
  }

  return _converted;
};

const getConvertedData = (rows) => {
  const splitRegex = /-|,|\n/;
  const _fields = getConvertedFields(rows.splice(0, 1)[0]);

  return rows.map((row) => {
    return row.reduce((acc, value, index) => {
      if (SPLIT_FIELDS.includes(_fields[index])) {
        value = value.split(splitRegex);
      }

      acc[_fields[index]] = value;

      return acc;
    }, {});
  });
};

const getUserIds = async (value) => {
  if (value === 'all') {
    return (
      await prisma.user.findMany({
        select: {
          id: true,
        },
      })
    ).map(({ id }) => id);
  } else {
    const userIds = value.split('-').map((n) => Number.parseInt(n));

    const foundUsers = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (foundUsers.length !== userIds.length) {
      throw new Error(
        `List of user id is not valid. Currently, Only have these user ids: ${foundUsers.map(
          ({ id }) => id,
        )}`,
      );
    }

    return userIds;
  }
};

const getRelationDto = async (key, value, userId) => {
  if (key === 'topic') {
    let foundTopic = await prisma.topic.findFirst({
      where: {
        userId: userId,
        name: {
          equals: value,
          mode: 'insensitive',
        },
      },
    });

    if (!foundTopic) {
      foundTopic = await prisma.topic.create({
        data: {
          name: value,
          background: getRandomColor(),
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }

    return {
      connect: {
        id: foundTopic.id,
      },
    };
  }
};

const getDto = async (data, userId) => {
  const _data = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    const relationsFields = Object.entries(pick(item, RELATION_FIELDS));
    const relationDto = {};

    for (let i = 0; i < relationsFields.length; i++) {
      const [key, value] = relationsFields[i];

      relationDto[key] = await getRelationDto(key, value, userId);
    }

    _data.push({
      ...item,
      ...relationDto,
    });
  }

  const foundBox = await prisma.box.findUnique({
    where: {
      level_userId: {
        level: 1,
        userId,
      },
    },
  });

  return _data.map((d) => ({
    ...d,
    box: {
      connect: {
        id: foundBox.id,
      },
    },
  }));
};

const createVocabulary = async (data, userIds) => {
  const createVocabularyDtos = await Promise.all(
    userIds.map(async (userId) => await getDto(data, userId)),
  );

  await Promise.all(
    flatten(createVocabularyDtos).map((dto) =>
      prisma.vocabulary.create({ data: dto }),
    ),
  );
};

program
  .name('import-export-vocab')
  .description('CLI to import and export vocabularies')
  .version('1.0.0');

program
  .command('import')
  .description('Importing vocabularies with Excel file')
  .argument('<path>', 'The path of the file that use want to import')
  .requiredOption(
    '-u, --user <user>',
    'The list of user id that you want to assign vocabularies for(eg. 1-2-3). \nInputting "all" if you want to assign for all users.',
  )
  .action(async (path, options) => {
    if (isPathValid(path)) {
      try {
        bar.start(100, 0);
        const rows = await readXlsxFile(path);
        bar.update(30);
        const userIds = await getUserIds(options.user);
        bar.update(60);
        const data = getConvertedData(rows);

        await createVocabulary(data, userIds);
        bar.update(100);

        bar.stop();
        success('Import successfully');
      } catch (err) {
        bar.stop();
        bar.removeAllListeners();
        error(err.message);
      }
    }
  });

const getConvertedVocabulary = (vocabulary) => {
  return HEADER_FIELDS.map((key) => {
    let value = vocabulary[key];

    if (key === 'types') {
      value = value.join(',');
    } else if (key === 'examples') {
      value = value.reduce((acc, text, index) => {
        if (index !== 0) {
          acc += '\n';
        }

        return acc + text;
      }, '');
    } else if (key == 'topic') {
      value = value.name;
    } else if (key === 'user') {
      value = `${vocabulary.topic.user.firstName} ${vocabulary.topic.user.lastName}`;
    }

    return {
      type: String,
      value,
    };
  });
};

const getExportVocabularies = async (userId) => {
  const foundVocabularies = await prisma.vocabulary.findMany({
    where: {
      topic: {
        userId,
      },
    },
    include: {
      topic: {
        select: {
          name: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  return foundVocabularies.map((vocab) => getConvertedVocabulary(vocab));
};

const getExportData = async (userIds) => {
  const headerRow = HEADER_FIELDS.map((h) => ({
    value: headerCase(h),
    fontWeight: 'bold',
  }));

  const data = await Promise.all(
    userIds.map(async (userId) => await getExportVocabularies(userId)),
  );

  return [headerRow, ...flatten(data)];
};

program
  .command('export')
  .description('Exporting vocabularies')
  .argument(
    '<path>',
    'The path of the file that use want to place after exporting',
  )
  .requiredOption(
    '-u, --user <user>',
    'The list of user id that you want to assign vocabularies for(eg. 1-2-3). \nInputting "all" if you want to assign for all users.',
  )
  .action(async (path, options) => {
    if (isValidPath(path, true)) {
      try {
        bar.start(100, 0);
        const userIds = await getUserIds(options.user);
        bar.update(30);
        const data = await getExportData(userIds);
        bar.update(60);

        const filePath = `${path}/vocabulary-${new Date().getTime()}.xlsx`;

        await writeXlsxFile(data, {
          filePath,
        });
        bar.update(100);

        bar.stop();
        success(`The file exported at ${filePath}`);
      } catch (err) {
        bar.stop();
        bar.removeAllListeners();
        error(err.message);
      }
    } else {
      error('The path is not a valid');
    }
  });

program.parse();
