import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*\p{L})(?=.*\d).{8,100}$/u, {
    message: "Password must be 8–100 characters and include a letter and a number.",
  })
  readonly password!: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  readonly userName!: string;
}
