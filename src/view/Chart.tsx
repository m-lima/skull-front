import React, { Component } from 'react'
import * as d3 from 'd3'
import './css/Chart.css'

import * as Message from './Message'
import Access from '../control/Access'
import Fetch from '../control/Fetch'
import IQueryState from '../model/IQueryState'
import Status from '../model/Status'
import { ApiException } from '../model/Exception'
import ISkullValue, { IRegisteredValue } from '../model/ISkullValue'

const getColorFromType = (type: string, desaturation = 0.6) => {
  const prime = 16777619
  const offset = 2166136261

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

  return d3.rgb(r + desaturation * (length - r), g + desaturation * (length - g), b + desaturation * (length - b)).hex()
}

const getColorFromSkull = (skull: ISkullValue) => {
  return getColorFromType(skull.type)
}

interface IState extends IQueryState {
  skullValues: IRegisteredValue[]
}

class MinMax {
  min = Number.MAX_VALUE
  max = Number.MIN_VALUE

  update(value: number) {
    this.min = value < this.min ? value : this.min
    this.max = value > this.max ? value : this.max
  }

  static update(minMax: MinMax, value: number): MinMax {
    minMax.update(value)
    return minMax
  }
}

export default class Chart extends Component<{}, IState> {
  private svgRef = React.createRef<SVGSVGElement>()

  constructor(props: {}) {
    super(props)
    this.handleException = this.handleException.bind(this)
    this.updateChart = this.updateChart.bind(this)
  }

  handleException(ex: any) {
    if (ex instanceof ApiException) {
      if (ex.status === Status.UNAUTHORIZED) {
        Access.login()
        return
      }
      console.error('HTTP error status: ' + ex.httpStatus)
      this.setState({ skullValues: [], status: ex.status })
    } else {
      console.error(ex)
      this.setState({ skullValues: [], status: Status.ERROR })
    }
  }

  load() {
    this.setState({ skullValues: [], status: Status.LOADING })
    Fetch.registeredValues()
      .then(r => this.setState({
        skullValues: r,
        status: (r.length > 0 ? Status.OK : Status.EMPTY),
      }))
      .then(this.updateChart)
      .catch(this.handleException)
  }

  componentDidMount() {
    this.load()
  }

  updateChart() {
    if (!this.state.skullValues || this.state.skullValues.length < 1) {
      return
    }

    const axisSize = 20
    const minMaxAmount = this.state.skullValues
        .map(skull => skull.amount)
        .reduce(MinMax.update, new MinMax())
    const minMaxMillis = this.state.skullValues
        .map(skull => skull.millis)
        .reduce(MinMax.update, new MinMax())
    const width = this.svgRef.current!.clientWidth
    const height = this.svgRef.current!.clientHeight

    const chart = d3.select(this.svgRef.current)
    const amountAxis = d3.scaleLinear().domain([0, minMaxAmount.max]).range([height - axisSize, 0]).nice()
    const timeAxis = d3.scaleTime().domain([minMaxMillis.min, minMaxMillis.max]).range([axisSize, width - axisSize]).nice()

    chart.append('g')
        .classed('x', true)
        .classed('axis', true)
        .attr('transform', `translate(${0}, ${height - axisSize})`)
        .call(d3.axisBottom(timeAxis))

    // this.state.skullValues
    //     .reduce((map, value) => {
    //       const list = map.get(value.type)
    //       if (list) {
    //         list.push(value)
    //       } else {
    //         map.set(value.type, [value])
    //       }
    //       return map
    //     }, new Map<string, IRegisteredValue[]>())
    //     .forEach((data, type) => {
    //         const color = getColorFromType(type)
    //         const line = d3.line<IRegisteredValue>().x(d => timeAxis(d.millis)).y(d => amountAxis(d.amount))
    //       chart
    //           .append('path')
    //           .datum(data)
    //           .attr('fill', 'none')
    //           .attr('stroke', color)
    //           .attr('d', line)
    //     })

    chart
      .selectAll('rect')
      .data(this.state.skullValues)
      .enter()
      .append('rect')
      .classed('Chart-Bar', true)
      .attr('x', d => timeAxis(d.millis))
      .attr('y', () => amountAxis(0))
      .attr('width', 4)
      .attr('height', () => 0)
      .attr('fill', getColorFromSkull)
      .transition()
      .duration(750)
      .attr('y', d => amountAxis(d.amount))
      .attr('height', d => height - axisSize - amountAxis(d.amount))
  }

  render() {
    if (!this.state) {
      return <Message.Loading />
    }

    switch (this.state.status) {
      case Status.LOADING:
        return <Message.Loading />
      case Status.OK:
        return (<svg className='Chart' ref={this.svgRef} />)
      case Status.EMPTY:
        return <Message.Empty />
      case Status.FORBIDDEN:
        return <Message.Unauthorized />
      case Status.ERROR:
        return <Message.Error />
    }
  }
}
