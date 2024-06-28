export class RegisterUserRequest {
  username: string;
  password: string;
}

export class UserResponse {
  id: string;
  username: string;
  token?: string;
}

export class LoginUserRequest {
  username: string;
  password: string;
}

export class UpdateUserRequest {
  username?: string;
  password?: string;
}
