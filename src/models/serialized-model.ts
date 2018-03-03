export class SerializedModel {
  protected _id: number;

  get id(): number {
    return this._id
  }

  set id(_id: number) {
    this._id = _id;
  }
}
