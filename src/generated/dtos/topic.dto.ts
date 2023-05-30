import { Prisma } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDate } from "class-validator";
import { VocabularyDto, UserDto } from "./";

export class TopicDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    icon: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    background: string;

    @ApiProperty({ required: true, type: () => VocabularyDto })
    @IsOptional()
    vocabularies: VocabularyDto[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    userId?: number;

    @ApiProperty({ required: false, type: () => UserDto })
    @IsOptional()
    user?: UserDto;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsDate()
    createdAt: Date;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsDate()
    updatedAt: Date;
}
