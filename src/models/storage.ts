import { SerializedModel } from './serialized-model';

export class StorageWrite extends SerializedModel {
  children: StorageWrite[] = [];

  constructor(public code: string, public name: string) {
    super();
  }

  addChild(storage: StorageWrite) {
    this.children.push(storage);
  }
}

export class StorageRead extends SerializedModel {
  type: string;
  attributes: StorageWrite;
}
