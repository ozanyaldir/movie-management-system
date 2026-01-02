jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-session-id'),
}));
jest.mock('bcrypt');
jest.mock('src/_model', () => ({
  newJWTPayload: jest.fn(),
}));
