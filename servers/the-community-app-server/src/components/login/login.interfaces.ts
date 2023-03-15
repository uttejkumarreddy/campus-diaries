export interface LoginInterface {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  _id: string;
  user_name: string;
  roll_number: string;
  activated: boolean;
  verified: boolean;
  locked_out: boolean;
  deactivated: boolean;
  password: string;
}