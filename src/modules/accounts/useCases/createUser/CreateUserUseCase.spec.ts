import CreateUserUseCase from './CreateUserUseCase';
import ICreateUserDTO from "../../dtos/ICreateUserDTO";
import UserRepositoryInMemory from "../../repositories/in-memory/UserRepositoryInMemory";
import IUserRepository from "../../repositories/IUserRepository";
import {validate as uuidValidate} from 'uuid';
import {AppError} from "../../../../shared/errors/AppError";
import './../../../../shared/utils/loadEnvVars';
import {verify} from "jsonwebtoken";

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
      userPassword: 'F4k3#U$3r#P4$$w0rd',
      userConfirmPassword: 'F4k3#U$3r#P4$$w0rd',
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

    try {
      await createUserUseCase.execute(newUser)
    } catch (e) {
      expect(e.message).toBe('User already exists')
      expect(e.statusCode).toBe(409)
    }

  });
  it('should return an error if the user is not provided', async () => {
    const newUserInvalid = {...newUser}

    newUserInvalid.username = ''

    await expect(async () => {
      await createUserUseCase.execute(newUserInvalid)
    }).rejects.toBeInstanceOf(AppError)

    try {
      await createUserUseCase.execute(newUserInvalid)
    } catch (e) {
      expect(e.message).toBe('Username is invalid')
      expect(e.statusCode).toBe(400)
    }
  });

  it('should return an error if the userEmail is invalid', async () => {
    const newUserInvalid = {...newUser}

    newUserInvalid.userEmail = 'invalidEmail'

    await expect(async () => {
      await createUserUseCase.execute(newUserInvalid)
    }).rejects.toBeInstanceOf(AppError)

    try {
      await createUserUseCase.execute(newUserInvalid)
    } catch (e) {
      expect(e.message).toBe('User email is invalid')
      expect(e.statusCode).toBe(400)
    }
  });
  it('should return an error if the email is not provided', async () => {
    const newUserInvalid = {...newUser}

    delete newUserInvalid.userEmail

    await expect(async () => {
      await createUserUseCase.execute(newUserInvalid)
    }).rejects.toBeInstanceOf(AppError)

    try {
      await createUserUseCase.execute(newUserInvalid)
    } catch (e) {
      expect(e.message).toBe('User email is invalid')
      expect(e.statusCode).toBe(400)
    }
  })
  it('should return an error if the email is empty string', async () => {
    const newUserInvalid = {...newUser}

    newUserInvalid.userEmail = ''

    await expect(async () => {
      await createUserUseCase.execute(newUserInvalid)
    }).rejects.toBeInstanceOf(AppError)

    try {
      await createUserUseCase.execute(newUserInvalid)
    } catch (e) {
      expect(e.message).toBe('User email is invalid')
      expect(e.statusCode).toBe(400)
    }
  })

  it('should return an error if the password is not provided', async () => {
    const newUserInvalid = {...newUser}

    delete newUserInvalid.userPassword

    await expect(async () => {
      await createUserUseCase.execute(newUserInvalid)
    }).rejects.toBeInstanceOf(AppError)

    try {
      await createUserUseCase.execute(newUserInvalid)
    } catch (e) {
      expect(e.message).toBe('User password is invalid')
      expect(e.statusCode).toBe(400)
    }
  })
  it('should return an error if the password do not match with confirmation password', async () => {
    const newUserInvalid = {...newUser}

    newUserInvalid.userConfirmPassword = 'invalidPassword'

    await expect(async () => {
      await createUserUseCase.execute(newUserInvalid)
    }).rejects.toBeInstanceOf(AppError);

    try {
      await createUserUseCase.execute(newUserInvalid)
    } catch (e) {
      expect(e.message).toBe('User password not match with confirmation password')
      expect(e.statusCode).toBe(400)
    }
  });
  it('should return an error if the password do is not strong enough', async () => {
    const newUserInvalid = {...newUser}

    newUserInvalid.userPassword = 'weakPassword'
    newUserInvalid.userConfirmPassword = 'weakPassword'

    await expect(async () => {
      await createUserUseCase.execute(newUserInvalid)
    }).rejects.toBeInstanceOf(AppError);

    try {
      await createUserUseCase.execute(newUserInvalid)
    } catch (e) {
      expect(e.message).toBe('User password is not strong enough')
      expect(e.statusCode).toBe(400)
    }
  });
  it('should encrypt the password', async () => {
    await createUserUseCase.execute(newUser)

    const userSaved = await userRepository.findByEmail(newUser.userEmail)

    expect(userSaved.password).not.toBe(newUser.userPassword)
  });

  it('should return a valid token when user is created', async () => {
    const {token} = await createUserUseCase.execute(newUser)
    const secretKey = process.env.JWT_KEY

    expect(() => verify(token, secretKey)).not.toThrow()
  });

  it('should return a token with expiration date valid', async () => {
    const {token} = await createUserUseCase.execute(newUser)
    const secretKey = process.env.JWT_KEY

    const {exp} = verify(token, secretKey) as { sub: string, exp: number }


    const expirationDatetimeInSeconds = exp * 1000;

    expect(Date.now() < expirationDatetimeInSeconds).toBe(true)
  });

  it('should return a token with user id information', async () => {
    const {token} = await createUserUseCase.execute(newUser)
    const secretKey = process.env.JWT_KEY

    const {sub} = verify(token, secretKey) as { sub: string, exp: number }
    const userSaved = await userRepository.findByEmail(newUser.userEmail)

    expect(sub).toBe(userSaved.id)
  });

})
