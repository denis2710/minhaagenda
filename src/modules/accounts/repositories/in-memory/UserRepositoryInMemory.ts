import User from "../../models/User";
import IUserRepository from "../IUserRepository";


class UserRepositoryInMemory implements IUserRepository {

  database: User[] = []

  async create(user: User): Promise<void> {
    this.database.push(user)
  }

  delete(_id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  update(_user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }

  findById(_id: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  async findByEmail(email: string): Promise<User> {
    return this.database.find(user => user.email === email)
  }

}

export default UserRepositoryInMemory;
