export class SerializedModel {
  protected serializedIdentity: number;

  public get id(): number {
    return this.serializedIdentity;
  }

  public set id(serializedIdentity: number) {
    this.serializedIdentity = serializedIdentity;
  }
}
