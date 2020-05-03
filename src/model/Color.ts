import { ModelException } from './Exception'

export default class Color {
  color: number[]

  constructor(hex: string) {
    if (hex.length !== 6 && hex.length !== 8) {
      throw new ModelException('color', 'hex', hex, 'string mus be 6 or 8 digits long')
    }

    try {
      this.color = new Array(4)
      this.color[0] = parseInt(hex.substring(0, 2), 16)
      this.color[1] = parseInt(hex.substring(2, 2), 16)
      this.color[2] = parseInt(hex.substring(4, 2), 16)
      if (hex.length > 6) {
        this.color[3] = parseInt(hex.substring(6, 2), 16)
      } else {
        this.color[3] = 255
      }
    } catch (e) {
      throw new ModelException('color', 'hex', hex, `invalid hex string: ${e}`)
    }
  }

  r(): number {
    return this.color[0]
  }

  g(): number {
    return this.color[1]
  }

  b(): number {
    return this.color[2]
  }

  a(): number {
    return this.color[3]
  }

  toHexString(): string {
    return '#' + this.color[0].toString(16) + this.color[1].toString(16) + this.color[2].toString(16) + this.color[3].toString(16)
  }

  toRgbString(includeAlpha: boolean = false): string {
    return `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.color[3]})`;
  }
}
