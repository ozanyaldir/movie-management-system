export class AuthResourceDTO {
  token: string;
}

export function newAuthResource(token: string): AuthResourceDTO {
  return {
    token,
  } as AuthResourceDTO;
}
