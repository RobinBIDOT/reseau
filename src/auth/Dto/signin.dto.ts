import {IsEmail, IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SigninDto {
    @ApiProperty()
    @IsEmail()
    readonly email : string
    @ApiProperty()
    @IsNotEmpty()
    readonly password : string
}