export class SerializedModel {
  protected serializedID: number;

  public get id(): number {
    return this.serializedID;
  }

  public set id(serializedID: number) {
    this.serializedID = serializedID;
  }
}
