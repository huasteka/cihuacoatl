import { SerializedModel } from '../serialized-model';

export class StorageWrite extends SerializedModel {
  public children: StorageWrite[] = [];

  constructor(public code: string, public name: string) {
    super();
  }

  public static createStorage(source: StorageRead): StorageWrite {
    const target = source.attributes;
    target.id = source.id;
    return target;
  }

  public addChild(storage: StorageWrite): void {
    this.children.push(storage);
  }
}

export class StorageRead extends SerializedModel {
  constructor(public type: string, public attributes: StorageWrite) {
    super();
  }
}
