import { Injectable } from '@nestjs/common';
import { healthResponseSchema, type HealthResponse } from 'schemas';

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return healthResponseSchema.parse({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }
}
