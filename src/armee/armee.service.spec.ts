import { Test, TestingModule } from '@nestjs/testing';
import { ArmeeService } from './armee.service';

describe('ArmeeService', () => {
  let service: ArmeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArmeeService],
    }).compile();

    service = module.get<ArmeeService>(ArmeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
