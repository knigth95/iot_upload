import { request } from "http";

export const Register = (data: {
  username: string;
  password: string;
  email: string;
}) => {
  return request.post('/api/v1/auth/register', data);
};