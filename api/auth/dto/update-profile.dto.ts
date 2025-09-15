import { IsOptional, IsString, MinLength } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Carlos Roberto' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ example: 'novaSenhaForte123' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string
}
