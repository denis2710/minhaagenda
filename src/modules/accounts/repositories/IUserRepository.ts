import User from "../models/User";

interface IUserRepository {
  create(user: User): Promise<void>;

  delete(id: string): Promise<void>;

  update(user: User): Promise<void>;

  findById(id: string): Promise<User | undefined>;

  findByEmail(email: string): Promise<User | undefined>;
}

export default IUserRepository;
