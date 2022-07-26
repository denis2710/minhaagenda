import CreateUserUseCase from './CreateUserUseCase';
import ICreateUserDTO from "../../dtos/ICreateUserDTO";
import UserRepositoryInMemory from "../../../repositories/in-memory/UserRepositoryInMemory";
import IUserRepository from "../../../repositories/IUserRepository";
import {validate as uuidValidate} from 'uuid';
import {AppError} from "../../../../shared/errors/AppError";

let createUserUseCase: CreateUserUseCase;
let userRepository: IUserRepository;
let newUser: ICreateUserDTO;

describe('Create User', () => {
  beforeEach(() => {
    userRepository = new UserRepositoryInMemory()
    createUserUseCase = new CreateUserUseCase(userRepository);

    newUser = {
      username: 'fakeUserName',
      userEmail: 'fakeUser@email.com',
      userPassword: 'fakeUserPassword',
      userConfirmPassword: 'fakeUserPassword',
    }
  })


  it('should create a user', async () => {
    await createUserUseCase.execute(newUser)

    const userSaved = await userRepository.findByEmail(newUser.userEmail)

    expect(userSaved.username).toBe(newUser.username)
    expect(userSaved.email).toBe(newUser.userEmail)
  });

  it('should received a valid uuid when create a user', async () => {
    await createUserUseCase.execute(newUser)

    const userSaved = await userRepository.findByEmail(newUser.userEmail)

    expect(userSaved).toHaveProperty('id')
    expect(uuidValidate(userSaved.id)).toBe(true)
  })

  it('should throws an error if the user already exists', async () => {
    await createUserUseCase.execute(newUser)

    await expect(async () => {
      await createUserUseCase.execute(newUser)
    }).rejects.toBeInstanceOf(AppError)

  });

  it.todo('should return an error if the user is invalid');
  it.todo('should return an error if the user is not provided');
  it.todo('should return an error if the email is not provided');
  it.todo('should return an error if the email is invalid');
  it.todo('should return an error if the password is not provided');
  it.todo('should return an error if the password is invalid');
  it.todo('should encpript the password');
})
