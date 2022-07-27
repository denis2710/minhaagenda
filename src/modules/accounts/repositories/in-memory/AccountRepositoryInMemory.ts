import Account from "../../models/Account";
import IAccountRepository from "../IAccountRepository";


class AccountRepositoryInMemory implements IAccountRepository {

  database: Account[] = []

  async create(account: Account): Promise<void> {
    this.database.push(account)
  }

  delete(_id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  update(_account: Account): Promise<void> {
    throw new Error("Method not implemented.");
  }

  findById(_id: string): Promise<Account> {
    throw new Error("Method not implemented.");
  }

  async findByEmail(email: string): Promise<Account> {
    return this.database.find(account => account.email === email)
  }

}

export default AccountRepositoryInMemory;
