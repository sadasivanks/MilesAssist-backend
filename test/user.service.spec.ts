import { UserService } from '../src/service/user.service';

describe('UserService', () => {
  it('uses the readable getUsers service method', () => {
    expect(typeof UserService.prototype.getUsers).toBe('function');
    expect(typeof UserService.prototype.getUserById).toBe('function');
    expect(typeof UserService.prototype.createUser).toBe('function');
    expect(typeof UserService.prototype.updateUser).toBe('function');
    expect(typeof UserService.prototype.deleteUser).toBe('function');
  });
});
