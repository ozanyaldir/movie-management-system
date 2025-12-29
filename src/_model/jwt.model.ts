import { UserType } from 'src/_repository/_entity';

export interface JWTPayload {
  sub: string;
  user_type: UserType;
  session_id: string;
}

export function newJWTPayload(
  sub: string,
  userType: UserType,
  sessionId: string,
): JWTPayload {
  return {
    sub,
    user_type: userType,
    session_id: sessionId,
  } as JWTPayload;
}
