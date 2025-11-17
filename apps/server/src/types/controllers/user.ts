export interface RegisterPayload {
  fullName: string;
  password: string;
  email: string;
}
export interface LoginPayload {
  password: string;
  email: string;
}