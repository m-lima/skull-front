import { ModelException } from './Exception';

const isCssColor = (color: string) => {
  const style = new Option().style;
  style.color = color;

  return style.color !== '';
};

export interface ISkull {
  id: number;
  name: string;
  color: string;
  icon: string;
  unitPrice: number;
  limit?: number;
}

export interface IQuick {
  id: number;
  skull: number;
  amount: number;
}

export interface IProtoOccurrence {
  skull: number;
  amount: number;
  millis: number;
}

export interface IOccurrence extends IProtoOccurrence {
  id: number;
}

export class SkullId {
  index: number;

  constructor(skull: number | string, skulls: Skull[]) {
    const index =
      typeof skull == 'number'
        ? skulls.findIndex(s => s.id === skull)
        : skulls.findIndex(s => s.name === skull);
    if (index < 0) {
      throw new ModelException(
        'SkullId',
        'skull',
        skull,
        'skull id was not found'
      );
    }
    this.index = index;
  }

  get(skulls: Skull[]) {
    return skulls[this.index];
  }
}

export class Skull {
  id: number;
  name: string;
  color: string;
  icon: string;
  unitPrice: number;
  limit?: number;

  constructor(raw: ISkull) {
    if (raw.id < 0) {
      throw new ModelException(
        'Skull',
        'id',
        raw.id,
        'must be a number greater than zero'
      );
    }

    if (raw.name.length < 0) {
      throw new ModelException(
        'Skull',
        'name',
        raw.name,
        'must be a non-empty string'
      );
    }

    if (!isCssColor(raw.color)) {
      throw new ModelException(
        'Skull',
        'color',
        raw.color,
        'must be a valid CSS color'
      );
    }

    if (raw.icon.length < 0) {
      throw new ModelException(
        'Skull',
        'icon',
        raw.icon,
        'must be a non-empty string'
      );
    }

    if (raw.unitPrice < 0) {
      throw new ModelException(
        'Skull',
        'unitPrice',
        raw.unitPrice,
        'must be a non-negative number'
      );
    }

    this.id = raw.id;
    this.name = raw.name;
    this.color = raw.color;
    this.icon = raw.icon;
    this.unitPrice = raw.unitPrice;

    if (raw.limit && raw.limit >= 0) {
      this.limit = raw.limit;
    }
  }
}

export class Quick {
  id: number;
  skull: SkullId;
  amount: number;

  constructor(raw: IQuick, skulls: Skull[]) {
    if (raw.id < 0) {
      throw new ModelException(
        'Quick',
        'id',
        raw.id,
        'must be a number greater than zero'
      );
    }

    if (raw.skull < 0) {
      throw new ModelException(
        'Quick',
        'skull',
        raw.skull,
        'must be a number greater than zero'
      );
    }

    if (raw.amount < 0) {
      throw new ModelException(
        'Quick',
        'amount',
        raw.amount,
        'must be a number greater than zero'
      );
    }

    this.id = raw.id;
    this.skull = new SkullId(raw.skull, skulls);
    this.amount = raw.amount;
  }
}

export class ProtoOccurrence {
  skull: SkullId;
  amount: number;
  millis: number;

  constructor(raw: IProtoOccurrence, skulls: Skull[]) {
    if (raw.skull < 0) {
      throw new ModelException(
        'Occurrence',
        'skull',
        raw.skull,
        'must be a number greater than zero'
      );
    }

    if (raw.amount < 0) {
      throw new ModelException(
        'Occurrence',
        'amount',
        raw.amount,
        'must be a number greater than zero'
      );
    }

    if (raw.millis < 0) {
      throw new ModelException(
        'Occurrence',
        'millis',
        raw.millis,
        'must be a number greater than zero'
      );
    }

    this.skull = new SkullId(raw.skull, skulls);
    this.amount = raw.amount;
    this.millis = raw.millis;
  }
}

export class Occurrence extends ProtoOccurrence {
  id: number;

  constructor(raw: IOccurrence, skulls: Skull[]) {
    super(raw, skulls);
    if (raw.id < 0) {
      throw new ModelException(
        'Occurrence',
        'id',
        raw.id,
        'must be a number greater than zero'
      );
    }

    this.id = raw.id;
  }
}
