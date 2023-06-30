import { Prisma } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDate } from "class-validator";
import { UserDto, VocabularyDto } from "./";

export class BoxDto {
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
    description: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    level: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @ApiProperty({ required: false, type: () => UserDto })
    @IsOptional()
    user?: UserDto;

    @ApiProperty({ required: true, type: () => VocabularyDto })
    @IsOptional()
    vocabularies: VocabularyDto[];

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    timeline: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsDate()
    createdAt: Date;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsDate()
    updatedAt: Date;
}
