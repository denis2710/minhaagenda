import {v4 as uuidV4} from 'uuid';

class User {

  id: string;
  username: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({
                id = undefined,
                username,
                email,
                password = undefined,
                createdAt = undefined,
                updatedAt = undefined
              }: User) {

    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    if (!id) {
      this.id = uuidV4();
    }
  }


}

export default User;
