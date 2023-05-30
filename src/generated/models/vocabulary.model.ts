import { Prisma } from "@prisma/client";
import { IsNumber, IsNotEmpty, IsString, IsEnum, IsOptional, IsDate } from "class-validator";
import { TopicModel } from "./";
import { VocabularyType } from "../enums";

export class VocabularyModel {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    ipa: string;

    @IsNotEmpty()
    @IsEnum(VocabularyType)
    types: VocabularyType[];

    @IsNotEmpty()
    examples: Prisma.JsonValue;

    @IsNotEmpty()
    @IsString()
    imageUrl: string;

    @IsNotEmpty()
    @IsString()
    audioUrl: string;

    @IsNotEmpty()
    @IsNumber()
    rememberCount: number;

    @IsNotEmpty()
    @IsString()
    Meaning: string;

    @IsOptional()
    @IsNumber()
    topicId?: number;

    @IsOptional()
    topic?: TopicModel;

    @IsNotEmpty()
    @IsDate()
    createdAt: Date;

    @IsNotEmpty()
    @IsDate()
    updatedAt: Date;
}
