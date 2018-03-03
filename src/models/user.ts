import { SerializedModel } from './serialized-model';

export class User extends SerializedModel {
  constructor(public name: string, public email: string) {
    super();
  }
}
