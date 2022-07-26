import User from "../../accounts/models/User";
import IUserRepository from "../IUserRepository";

class UserRepositoryInMemory implements IUserRepository {
  create(_user: User): Promise<void> {
    throw new Error("Method not implemented.");
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

  findByEmail(_email: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

}

export default UserRepositoryInMemory;
