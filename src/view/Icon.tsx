import React from 'react'

interface IProps {
  icon: string
  [propName: string]: any
}

export const Icon = (props: IProps) => {
  return <i className={props.icon} {...props} />
}

export default Icon
