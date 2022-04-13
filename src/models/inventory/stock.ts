/* eslint-disable @typescript-eslint/naming-convention */
import { SerializedModel } from '../serialized-model';

export enum StockType {
  storageDeposit = 'deposit',
  storageWithdraw = 'withdraw',
}

export interface StockStorageRead {
  id: number;
  name: string;
  code: string;
}

export interface StockItemRead {
  id: number;
  name: string;
  code: string;
}

export interface StockRead {
  id: number;
  minimum_quantity?: number;
  storage: StockStorageRead;
  item: StockItemRead;
}

export interface StockReadAttributes {
  operation_type: StockType;
  stock: StockRead;
  quantity: number;

  created_at: Date;
}

export class OperationStockRead extends SerializedModel {
  constructor(public type: number, public attributes: StockReadAttributes) {
    super();
  }
}

export interface OperationReadRelationshipData {
  id: number;
  type: string;
}

export interface OperationReadRelationship {
  storage: OperationReadRelationshipData;
  item: OperationReadRelationshipData;
}

export interface OperationReadAttributes {
  quantity: number;
  minimum_quantity?: number;
}

export class OperationRead extends SerializedModel {
  constructor(
    public type: number,
    public attributes: OperationReadAttributes,
    public relationships: OperationReadRelationship
  ) {
    super();
  }
}

export class OperationWrite {
  constructor(public storage_id: number, public item_id: number, public quantity: number) { }

  public static createOperation(operation: OperationRead): OperationWrite {
    const { attributes, relationships } = operation;
    return new OperationWrite(relationships.storage.id, relationships.item.id, attributes.quantity);
  }

  public static createOperationFromStock(operation: OperationStockRead): OperationWrite {
    const { attributes: { stock, quantity } } = operation;
    return new OperationWrite(stock.storage.id, stock.item.id, quantity);
  }
}
