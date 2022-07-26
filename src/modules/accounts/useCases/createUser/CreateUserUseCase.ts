import ICreateUserDTO from "../../dtos/ICreateUserDTO";
import IUserRepository from "../../../repositories/IUserRepository";
import User from "../../models/User";
import {AppError} from "../../../../shared/errors/AppError";

class CreateUserUseCase {

  constructor(private userRepository: IUserRepository) {
  }


  async execute(user: ICreateUserDTO): Promise<void> {

    const {username, userEmail, userPassword} = user;

    const userAlreadyExists = await this.userRepository.findByEmail(userEmail);

    if (userAlreadyExists) {
      throw new AppError('User already exists', 409);
    }
    
    const newUser = new User({
      id: undefined,
      username,
      email: userEmail,
      password: userPassword,
    })

    await this.userRepository.create(newUser);


  }
}

export default CreateUserUseCase;
