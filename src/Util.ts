import { IRegisteredValue } from './model/ISkullValue'

export const normalizeDate = (value: IRegisteredValue): IRegisteredValue => {
  const date = new Date(value.millis)
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
