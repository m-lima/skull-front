import { IRegisteredValue } from './model/ISkullValue'

export const normalizeDate = (value: IRegisteredValue): IRegisteredValue => {
  const date = new Date(value.millis)
  if (date.getHours() < 5) {
    date.setTime(date.getTime() - 24 * 60 * 60 * 1000)
  }
  date.setHours(0)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return { type: value.type, amount: value.amount, millis: date.getTime() }
}

export const mapMonthToName = (month: number) => {
  switch (month) {
    case 0: return 'Jan'
    case 1: return 'Feb'
    case 2: return 'Mar'
    case 3: return 'Apr'
    case 4: return 'May'
    case 5: return 'Jun'
    case 6: return 'Jul'
    case 7: return 'Aug'
    case 8: return 'Sep'
    case 9: return 'Oct'
    case 10: return 'Nov'
    case 11: return 'Dec'
  }
  return '???'
}

export const mapMonthToNumber = (month: number) => {
  return addLeadingZero(month + 1)
}

export const addLeadingZero = (value: number) => {
  return (value < 10 ? '0' : '') + value
}

export const getColorFromType = (type: string) => {
  const prime = 16777619
  const offset = 2166136261
  const desaturation = 0.6

  let color = offset
  for (let i = 0; i < type.length; i++) {
    color *= prime
    color ^= type.charCodeAt(i)
  }

  color %= 16581375
  const r = (color & 0xFF0000) >> 16
  const g = (color & 0xFF00) >> 8
  const b = color & 0xFF
  const length = 0.3 * r + 0.6 * g + 0.1 * b

  return '#' + ((((r + desaturation * (length - r)) << 16) & 0xff0000)
    | (((g + desaturation * (length - g)) << 8) & 0xff00)
      | ((b + desaturation * (length - b)) & 0xff)).toString(16)
}

