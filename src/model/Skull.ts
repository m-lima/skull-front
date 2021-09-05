import { ModelException } from './Exception'

const isCssColor = (color: string) => {
  const style = new Option().style;
  style.color = color;

  return style.color !== ''
}

export class Skull {
  id: number
  name: string
  color: string
  icon: string
  unitPrice: number
  limit?: number

  constructor(raw: any) {
    if (raw.id as number === undefined || raw.id < 0) {
      throw new ModelException('skull', 'id', raw.id, 'must be a number greater than zero')
    }

    if (raw.name as string === undefined || raw.name.length < 0) {
      throw new ModelException('skull', 'name', raw.name, 'must be a non-empty string')
    }

    if (raw.color as string === undefined || !isCssColor(raw.color)) {
      throw new ModelException('color', 'color', raw.color, 'must be a valid CSS color')
    }

    if (raw.icon as string === undefined || raw.icon.length < 0) {
      throw new ModelException('skull', 'icon', raw.icon, 'must be a non-empty string')
    }

    if (raw.unitPrice as number === undefined || raw.unitPrice < 0) {
      throw new ModelException('skull', 'unitPrice', raw.unitPrice, 'must be a non-negative number')
    }

    this.id = raw.id
    this.name = raw.name
    this.color = raw.color
    this.icon = raw.icon
    this.unitPrice = raw.unitPrice

    if (raw.limit as number !== undefined && raw.limit >= 0) {
      this.limit = raw.limit
    }
  }
}

export class RawValuedSkull {
  skull: number
  amount: number

  constructor(raw: any) {
    if (raw.skull as number === undefined || raw.skull < 0) {
      throw new ModelException('RawValuedSkull', 'skull', raw.skull, 'must be a number greater than zero')
    }

    if (raw.amount as number === undefined || raw.amount < 0) {
      throw new ModelException('RawValuedSkull', 'amount', raw.amount, 'must be a number greater than zero')
    }

    this.skull = raw.skull
    this.amount = raw.amount
  }
}

export class RawOccurrence extends RawValuedSkull {
  id: number
  date: Date

  constructor(raw: any) {
    super(raw);

    if (raw.id as number === undefined || raw.id < 0) {
      throw new ModelException('RawOccurrence', 'id', raw.id, 'must be a number greater than zero')
    }

    if (raw.millis as string === undefined || raw.millis.length < 0) {
      throw new ModelException('RawOccurrence', 'millis', raw.millis, 'must be a number greater than zero')
    }

    this.id = raw.id
    this.date = new Date(raw.millis)
  }
}

export class ValuedSkull {
  skull: Skull
  amount: number

  constructor(rawValuedSkull: RawValuedSkull, skulls: Skull[]) {
    const skull  = skulls.find(s => s.id === rawValuedSkull.skull)
    if (skull === undefined) {
      throw new ModelException('ValuedSkull', 'skull', rawValuedSkull.skull, 'skull entry not found')
    }
    this.skull = skull
    this.amount = rawValuedSkull.amount
  }
}

export class ProtoOccurrence extends ValuedSkull {
  date: Date

  constructor(rawValuedSkull: RawValuedSkull, skulls: Skull[], date?: Date) {
    super(rawValuedSkull, skulls)
    this.date = date ? date : new Date()
  }
}

export class Occurrence extends ProtoOccurrence {
  id: number

  constructor(rawOccurrence: RawOccurrence, skulls: Skull[]) {
    super(rawOccurrence, skulls)
    this.id = rawOccurrence.id
    this.date = rawOccurrence.date
  }
}
