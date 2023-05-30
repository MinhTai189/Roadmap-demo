import { Prisma } from "@prisma/client";
import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDate } from "class-validator";
import { TopicModel } from "./";

export class UserModel {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    topic: TopicModel[];

    @IsNotEmpty()
    @IsDate()
    createdAt: Date;

    @IsNotEmpty()
    @IsDate()
    updatedAt: Date;
}
