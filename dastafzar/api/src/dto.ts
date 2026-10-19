import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

/** DTOs — every request body is validated by the global ValidationPipe (whitelist). */
export class LoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(6) @MaxLength(72) password!: string;
}
export class EventDto {
  @IsString() @MaxLength(40) tool!: string;
  @IsString() @MaxLength(20) action!: string;
}
export class FeedbackDto {
  @IsOptional() @IsString() @MaxLength(80) name?: string;
  @IsOptional() @IsString() @MaxLength(120) contact?: string;
  @IsString() @MinLength(2) @MaxLength(2000) message!: string;
}
export class OccasionDto {
  @IsString() @MinLength(2) @MaxLength(60) title!: string;
  @IsInt() @Min(1) @Max(12) month!: number;
  @IsInt() @Min(1) @Max(31) day!: number;
}
export class ToolToggleDto {
  @IsBoolean() enabled!: boolean;
}
