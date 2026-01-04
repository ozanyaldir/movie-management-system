import { NestFactory } from '@nestjs/core';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

jest.mock('@nestjs/swagger', () => {
  const noop = () => () => {};
  return {
    ApiTags: noop,
    ApiOkResponse: noop,
    ApiCreatedResponse: noop,
    ApiBadRequestResponse: noop,
    ApiUnauthorizedResponse: noop,
    ApiNotFoundResponse: noop,
    ApiBearerAuth: noop,
    ApiServiceUnavailableResponse: noop,
    ApiForbiddenResponse: noop,
    ApiConflictResponse: noop,
    ApiInternalServerErrorResponse: noop,
    SwaggerModule: {
      createDocument: jest.fn().mockReturnValue({}),
      setup: jest.fn(),
    },
    DocumentBuilder: jest.fn().mockImplementation(() => ({
      setTitle: () => ({
        setDescription: () => ({
          setVersion: () => ({
            addBearerAuth: () => ({
              build: () => ({}),
            }),
          }),
        }),
      }),
    })),
  };
});

const listenMock = jest.fn();
const registerMock = jest.fn();
const useGlobalPipesMock = jest.fn();
const enableCorsMock = jest.fn();
const useGlobalFiltersMock = jest.fn();
const getHttpAdapterMock = jest.fn();
const getInstanceMock = jest.fn();
const addHookMock = jest.fn();

describe('bootstrap (main.ts)', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    (NestFactory.create as jest.Mock).mockResolvedValue({
      register: registerMock,
      useGlobalPipes: useGlobalPipesMock,
      enableCors: enableCorsMock,
      useGlobalFilters: useGlobalFiltersMock,
      getHttpAdapter: getHttpAdapterMock.mockReturnValue({
        getInstance: getInstanceMock.mockReturnValue({
          addHook: addHookMock,
        }),
        getType: () => 'fastify',
      }),
      listen: listenMock,
    });
  });

  it('should create app and start server', async () => {
    jest.isolateModules(() => {
      require('./main');
    });

    await new Promise(setImmediate);

    expect(NestFactory.create).toHaveBeenCalled();

    const adapter = (NestFactory.create as jest.Mock).mock.calls[0][1];
    expect(adapter.constructor.name).toBe('FastifyAdapter');

    expect(useGlobalPipesMock).toHaveBeenCalled();
    expect(enableCorsMock).toHaveBeenCalled();
    expect(useGlobalFiltersMock).toHaveBeenCalled();
    expect(addHookMock).toHaveBeenCalled();
    expect(listenMock).toHaveBeenCalledWith(3000, '0.0.0.0');
  });
});
