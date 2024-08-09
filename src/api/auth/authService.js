import { decode, JWT_EXPIRES_IN, JWT_SECRET, sign } from 'src/utils/jwt';

import { getUser, createUser, me } from './authApi';

class AuthApi {
  async signIn(request) {
    const { email, password } = request;

    const { data } = await getUser(email, password);

    const accessToken = sign({ userId: data.user_id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return { accessToken };
  }

  async signUp(request) {
    const { name, lastname, dni, phone, business_name, ruc, email, password } = request;
    return await createUser(name, lastname, dni, phone, business_name, ruc, email, password);
  }

  async me(request) {
    const { accessToken } = request;
    const decodedToken = decode(accessToken);
    const { userId } = decodedToken;
    const { data } = await me(userId);

    return {
      user_id: data.user_id,
      avatar: data.avatar,
      email: data.email,
      name: data.name,
      lastname: data.lastname,
      role_id: data.role_id,
    };
  }
}

export const authApi = new AuthApi();
