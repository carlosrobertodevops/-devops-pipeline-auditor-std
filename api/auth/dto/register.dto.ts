import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ example: 'dev@mondada.com' })
  @IsEmail()
  email!: string

  @ApiProperty({ example: 'Carlos Roberto' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password!: string
}
