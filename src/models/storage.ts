import { SerializedModel } from './serialized-model';

export class StorageWrite extends SerializedModel {
  children: StorageWrite[] = [];

  constructor(public code: string, public name: string) {
    super();
  }

  addChild(storage: StorageWrite) {
    this.children.push(storage);
  }

  static createStorage(source: StorageRead) {
    let target = source.attributes;
    target.id = source.id;
    return target;
  }
}

export class StorageRead extends SerializedModel {
  constructor(public type: string, public attributes: StorageWrite) {
    super();
  }
}
