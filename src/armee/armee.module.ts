import { Module } from '@nestjs/common';
import { ArmeeService } from './armee.service';

@Module({
  providers: [ArmeeService]
})
export class ArmeeModule {}
