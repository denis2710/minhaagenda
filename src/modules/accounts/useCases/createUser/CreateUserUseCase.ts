import ICreateUserDTO from "../../dtos/ICreateUserDTO";
import IUserRepository from "../../repositories/IUserRepository";
import User from "../../models/User";
import {validateEmail} from "../../../../shared/utils/validateEmail";
import {AppError} from "../../../../shared/errors/AppError";
import {hash} from "bcryptjs";
import {generateUserToken} from "../../shared/utils/generateUserToken";

interface ICreateUserUseCaseResponse {
  user: User;
  token: string;
}


class CreateUserUseCase {

  constructor(private userRepository: IUserRepository) {
  }


  async execute(user: ICreateUserDTO): Promise<ICreateUserUseCaseResponse> {

    const {username, userEmail, userPassword, userConfirmPassword} = user;

    await this.doCreateUserValidations(username, userEmail, userPassword, userConfirmPassword);

    const passwordHash = await hash(userPassword, 8);

    const newUser = new User({
      id: undefined,
      username,
      email: userEmail,
      password: passwordHash,
    })

    await this.userRepository.create(newUser);

    const token = generateUserToken(newUser);

    delete newUser.password

    return {
      user: newUser,
      token
    }


  }

  async doCreateUserValidations(username: string, userEmail: string, userPassword: string, userPasswordConfirmation: string): Promise<void> {
    const isValidEmail = validateEmail(userEmail);
    if (!isValidEmail) {
      throw new AppError('User email is invalid', 400);
    }

    if (!username) {
      throw new AppError('Username is invalid', 400);
    }

    const userAlreadyExists = await this.userRepository.findByEmail(userEmail);


    if (userAlreadyExists) {
      throw new AppError('User already exists', 409);
    }

    if (!userPassword) {
      throw new AppError('User password is invalid', 400);
    }

    if (userPassword !== userPasswordConfirmation) {
      throw new AppError('User password not match with confirmation password', 400);
    }

    if (!this.validatePasswordStrength(userPassword)) {
      throw new AppError('User password is not strong enough', 400);
    }


  }

  /**
   * Password must be:
   *    The password is at least 8 characters long (?=.{8,}).
   *    The password has at least one uppercase letter (?=.*[A-Z]).
   *    The password has at least one lowercase letter (?=.*[a-z]).
   *    The password has at least one digit (?=.*[0-9]).
   *    The password has at least one special character ([^A-Za-z0-9]).
   * @param password
   */
  validatePasswordStrength(password: string): boolean {
    const re = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
    return re.test(String(password));
  }

}


export default CreateUserUseCase;
