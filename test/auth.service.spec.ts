import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../src/service/auth.service';

describe('AuthService', () => {
  it('rejects an invalid login', async () => {
    const repository: any = {
      createQueryBuilder: () => ({
        addSelect() { return this; },
        where() { return this; },
        getOne: async () => null,
      }),
    };
    const jwtService: any = {};
    const service = new AuthService(repository, jwtService);
    await expect(service.loginAdmin({ email: 'wrong@example.com', password: 'bad' })).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
