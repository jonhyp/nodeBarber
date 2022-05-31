import { getRepository } from "typeorm";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import auth from "../config/auth";

import AppError from "../errors/AppError";

import User from "../models/User";

interface RequestDTO {
  email: string;
  password: string;
}

interface ResponseDTO {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: RequestDTO): Promise<ResponseDTO> {
    const userRepository = await getRepository(User);

    const user = await userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new AppError("Incorrect email/password combination", 401);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Incorrect email/password combination", 401);
    }

    const { secret, expiresIn } = auth.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: expiresIn,
    });

    return {
      user: user,
      token: token,
    };
  }
}

export default AuthenticateUserService;
