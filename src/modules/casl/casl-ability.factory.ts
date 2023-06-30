import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Actions } from 'src/enums/action.enum';
import { UserDto } from 'src/generated/dtos';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserDto) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    can(Actions.Manage, 'Topic', { userId: user.id });
    can(Actions.Manage, 'Box', { userId: user.id });
    can(Actions.Manage, 'Vocabulary', { userId: user.id });

    return build();
  }
}
