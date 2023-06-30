import { Prisma } from "@prisma/client";
import { IsNumber, IsNotEmpty, IsString, IsEnum, IsOptional, IsDate } from "class-validator";
import { TopicModel, BoxModel } from "./";
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

    @IsOptional()
    examples?: Prisma.JsonValue;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsString()
    audioUrl?: string;

    @IsNotEmpty()
    @IsNumber()
    rememberCount: number;

    @IsNotEmpty()
    @IsString()
    meaning: string;

    @IsOptional()
    @IsNumber()
    topicId?: number;

    @IsOptional()
    topic?: TopicModel;

    @IsOptional()
    @IsNumber()
    boxId?: number;

    @IsOptional()
    box?: BoxModel;

    @IsNotEmpty()
    @IsDate()
    createdAt: Date;

    @IsNotEmpty()
    @IsDate()
    updatedAt: Date;

    @IsOptional()
    @IsDate()
    reviewedAt?: Date;
}
