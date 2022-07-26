import ICreateUserDTO from "../../dtos/ICreateUserDTO";
import IUserRepository from "../../../repositories/IUserRepository";
import User from "../../models/User";

class CreateUserUseCase {

  constructor(private userRepository: IUserRepository) {
  }


  async execute(user: ICreateUserDTO): Promise<void> {

    const {username, userEmail, userPassword} = user;

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
