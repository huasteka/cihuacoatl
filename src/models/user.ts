import { SerializedModel } from './serialized-model';

export class User extends SerializedModel {
  constructor(public name: string, public email: string) {
    super();
  }

  static createUser(userId: number, name: string, email: string) {
    const user = new User(name, email);
    user.id = userId;
    return user;
  }
}

export class UserCredentials {
  constructor(public password: string, public passwordConfirmation: string) {
  }
}
