import { Controller } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';

@Controller()
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}
}
