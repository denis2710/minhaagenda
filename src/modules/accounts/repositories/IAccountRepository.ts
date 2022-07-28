import Account from "../models/Account";

interface IAccountRepository {
  create(user: Account): Promise<void>;

  delete(id: string): Promise<void>;

  update(user: Account): Promise<void>;

  findById(id: string): Promise<Account | undefined>;

  findByEmail(email: string): Promise<Account | undefined>;

  findByUsername(username: string): Promise<Account | undefined>;

}

export default IAccountRepository;
