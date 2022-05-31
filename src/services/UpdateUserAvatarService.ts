import { getRepository } from "typeorm";
import path from "path";
import fs from "fs";
import uploadConfig from "../config/upload";
import AppError from "../errors/AppError";

import User from "../models/User";

interface RequestDTO {
  user_id: string;
  avatarFileName: string;
}

export class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: RequestDTO): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError(
        "Only authenticated users can change their avatar",
        401
      );
    }

    if (user.avatar) {
      //criando variavel para ter o caminho do avatar que ja existe, do usuario
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      //o .stat tras o status de um arquivo, porem so se ele existir
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        //deletando o arquivo
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;

    await userRepository.save(user);

    return user;
  }
}
