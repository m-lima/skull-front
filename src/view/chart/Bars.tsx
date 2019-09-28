import React, { Component } from 'react'
import { ScaleLinear, ScaleTime } from 'd3'

import { IRegisteredValue } from '../../model/ISkullValue'

interface IProps<T> {
  svg: SVGSVGElement | null,
  data: T[],
  clip?: string,
  types: string[],
  domain: ScaleTime<number, number>,
  range: ScaleLinear<number, number>,
  colorMapper: (type: string) => string,
}

export default class Bars<T extends IRegisteredValue> extends Component<IProps<T>> {
  render() {
    const dayWidth = (this.props.domain(new Date(0, 0, 1).getTime()) - this.props.domain(new Date(0, 0, 0).getTime()))
    const typeWidth = dayWidth / this.props.types.length
    const scaledZero = this.props.range(0)

    return <g>
      {this.props.data.map((datum, index) =>
          <rect
              key={index}
              x={this.props.domain(datum.millis) + this.props.types.indexOf(datum.type) * typeWidth}
              width={typeWidth}
              y={this.props.range(datum.amount)}
              height={scaledZero - this.props.range(datum.amount)}
              clipPath={this.props.clip}
              fill={this.props.colorMapper(datum.type)}
          />
      )}
    </g>
  }
}