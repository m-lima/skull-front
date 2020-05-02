export default class Color {
  color: number[]

  constructor(hex: string) {
    this.color = new Array(4)
    this.color[0] = parseInt(hex.substring(0, 2), 16)
    this.color[1] = parseInt(hex.substring(2, 2), 16)
    this.color[2] = parseInt(hex.substring(4, 2), 16)
    if (hex.length > 6) {
      this.color[3] = parseInt(hex.substring(6, 2), 16)
    } else {
      this.color[3] = 255
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
