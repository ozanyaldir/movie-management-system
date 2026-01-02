import { ForbiddenException, ExecutionContext } from '@nestjs/common';
import { ManagerGuard } from './manager.guard';
import { UserType } from 'src/_repository/_entity';

describe('ManagerGuard', () => {
  let guard: ManagerGuard;

  const mockHttpContext = (user: any): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
        getResponse: () => ({}),
        getNext: () => ({}),
      }),
    } as any);

  beforeEach(() => {
    guard = new ManagerGuard();
  });

  it('allows access when user is Manager', () => {
    const ctx = mockHttpContext({
      type: UserType.Manager,
    });

    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('throws ForbiddenException when user is Customer', () => {
    const ctx = mockHttpContext({
      type: UserType.Customer,
    });

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when user is missing', () => {
    const ctx = mockHttpContext(undefined);

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
