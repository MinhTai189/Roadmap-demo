import { Prisma } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDate } from "class-validator";
import { TopicDto } from "./";

export class UserDto {
    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ required: true, type: () => TopicDto })
    @IsOptional()
    topic: TopicDto[];

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsDate()
    createdAt: Date;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsDate()
    updatedAt: Date;
}
