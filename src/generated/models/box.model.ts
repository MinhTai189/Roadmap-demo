import { Prisma } from "@prisma/client";
import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDate } from "class-validator";
import { UserModel, VocabularyModel } from "./";

export class BoxModel {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    level: number;

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsOptional()
    user?: UserModel;

    @IsOptional()
    vocabularies: VocabularyModel[];

    @IsNotEmpty()
    @IsNumber()
    timeline: number;

    @IsNotEmpty()
    @IsDate()
    createdAt: Date;

    @IsNotEmpty()
    @IsDate()
    updatedAt: Date;
}
