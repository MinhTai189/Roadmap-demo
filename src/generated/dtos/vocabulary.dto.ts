import { Prisma } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsString, IsEnum, IsOptional, IsDate } from "class-validator";
import { TopicDto } from "./";
import { VocabularyType } from "../enums";

export class VocabularyDto {
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
    ipa: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsEnum(VocabularyType)
    types: VocabularyType[];

    @ApiProperty({ required: true })
    @IsNotEmpty()
    examples: Prisma.JsonValue;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    imageUrl: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    audioUrl: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    rememberCount: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    Meaning: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    topicId?: number;

    @ApiProperty({ required: false, type: () => TopicDto })
    @IsOptional()
    topic?: TopicDto;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsDate()
    createdAt: Date;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsDate()
    updatedAt: Date;
}
