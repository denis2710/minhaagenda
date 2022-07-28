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

  async update(account: Account): Promise<void> {
    const accountIndex = this.database.findIndex(a => a.id === account.id)

    if (accountIndex === -1) {
      throw new Error("Account not found")
    }

    this.database[accountIndex] = account

  }

  async findById(id: string): Promise<Account> {
    return this.database.find(account => account.id === id)
  }

  async findByEmail(email: string): Promise<Account> {
    return this.database.find(account => account.email === email)
  }

  async findByUsername(username: string): Promise<Account | undefined> {
    return this.database.find(account => account.username === username)
  }

}

export default AccountRepositoryInMemory;
