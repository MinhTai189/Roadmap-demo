import { Prisma } from "@prisma/client";
import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDate } from "class-validator";
import { VocabularyModel, UserModel } from "./";

export class TopicModel {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    icon: string;

    @IsNotEmpty()
    @IsString()
    background: string;

    @IsOptional()
    vocabularies: VocabularyModel[];

    @IsOptional()
    @IsNumber()
    userId?: number;

    @IsOptional()
    user?: UserModel;

    @IsNotEmpty()
    @IsDate()
    createdAt: Date;

    @IsNotEmpty()
    @IsDate()
    updatedAt: Date;
}
