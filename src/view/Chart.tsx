import React, { Component } from 'react'
import * as d3 from 'd3'
import './css/Chart.css'

import * as Message from './Message'
import Access from '../control/Access'
import Fetch from '../control/Fetch'
import IQueryState from '../model/IQueryState'
import Status from '../model/Status'
import { ApiException } from '../model/Exception'
import { IRegisteredValue } from '../model/ISkullValue'

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

const getColorFromSkull = (skull: IRegisteredValue) => {
  return getColorFromType(skull.type)
}

const normalizeTime = (value: IRegisteredValue): IRegisteredValue => {
  const normalizedDate = new Date(value.millis)
  normalizedDate.setHours(0)
  normalizedDate.setMinutes(0)
  normalizedDate.setSeconds(0)
  normalizedDate.setMilliseconds(0)
  return { type: value.type, amount: value.amount, millis: normalizedDate.getTime() }
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
        skullValues: r.map(normalizeTime),
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
    const dayWidthRatio = 0.9
    const dayWidthStart = (1.0 - dayWidthRatio) / 2

    const minMaxAmount = this.state.skullValues
        .map(skull => skull.amount)
        .reduce(MinMax.update, new MinMax())
    const minMaxMillis = this.state.skullValues
        .map(skull => skull.millis)
        .reduce(MinMax.update, new MinMax())
    const types = this.state.skullValues.map(skull => skull.type)
        .reduce((list, value) => {
          !list.find(v => value === v) && list.push(value)
          return list
        }, [] as string[])
    const width = this.svgRef.current!.clientWidth
    const height = this.svgRef.current!.clientHeight

    const chart = d3.select(this.svgRef.current)
    const plot = chart.append('svg').attr('width', width).attr('height', height)
    const amountDomain = d3.scaleLinear().domain([0, minMaxAmount.max]).range([height - axisSize, 0]).nice()
    const timeDomain = d3.scaleTime().domain([minMaxMillis.min, minMaxMillis.max]).range([axisSize, width - axisSize]).nice()

    const fullDayWidth = (timeDomain(new Date(0, 0, 1).getTime()) - timeDomain(new Date(0, 0, 0).getTime()))
    const fullHalfDayWidth = fullDayWidth / 2
    const fullTypeWidth = fullDayWidth * dayWidthRatio / types.length
    const fullTypeStart  = fullDayWidth * dayWidthStart
    const scaledZero = amountDomain(0)

    const timeAxis = plot.append('g')
        .classed('x', true)
        .classed('axis', true)
        .attr('transform', `translate(${0}, ${height - axisSize})`)
        .call(d3.axisBottom(timeDomain).ticks(d3.timeDay.every(1)))

    const bars = plot
        .selectAll('rect')
        .data(this.state.skullValues)
        .enter()
        .append('rect')
        .classed('Chart-Bar', true)
        .attr('x', d => timeDomain(d.millis) - fullHalfDayWidth + fullTypeStart + types.indexOf(d.type) * fullTypeWidth)
        .attr('y', scaledZero)
        .attr('width', fullTypeWidth)
        .attr('height', 0)
        .attr('fill', getColorFromSkull)

    bars
        .transition()
        .duration(750)
        .attr('y', d => amountDomain(d.amount))
        .attr('height', d => scaledZero - amountDomain(d.amount))

    const plottedBrush = plot.append('g')

    let zoomGuard = false

    const brush = d3.brushX()
    brush
        .extent([[0, 0], [width, height]])
        .on('end', () => {
          const extent = d3.event.selection

          if (!extent && zoomGuard) {
            zoomGuard = false
            return
          }

          let zoomDayWidth = fullDayWidth
          let zoomHalfDayWidth = fullHalfDayWidth
          let zoomTypeWidth = fullTypeWidth
          let zoomTypeStart = fullTypeStart
          if(extent) {
            timeDomain.domain([timeDomain.invert(extent[0]), timeDomain.invert(extent[1])])
            zoomDayWidth = (timeDomain(new Date(0, 0, 1).getTime()) - timeDomain(new Date(0, 0, 0).getTime()))
            zoomHalfDayWidth = zoomDayWidth / 2
            zoomTypeWidth = zoomDayWidth * dayWidthRatio / types.length
            zoomTypeStart = zoomDayWidth * dayWidthStart

            zoomGuard = true
            plottedBrush.call(brush.move)
          } else {
            timeDomain.domain([minMaxMillis.min, minMaxMillis.max]).nice()
          }

          timeAxis
              .transition()
              .duration(750)
              .call(d3.axisBottom(timeDomain).ticks(d3.timeDay.every(1)))

          bars
              .transition()
              .duration(750)
              .attr('x', d => timeDomain(d.millis) - zoomHalfDayWidth + zoomTypeStart + types.indexOf(d.type) * zoomTypeWidth)
              .attr('width', zoomTypeWidth)
        })

    plottedBrush
        .call(brush)
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
