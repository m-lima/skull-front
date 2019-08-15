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

const getColorFromType = (type: string) => {
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

  return d3.rgb(r + desaturation * (length - r), g + desaturation * (length - g), b + desaturation * (length - b)).hex()
}

const getColorFromSkull = (skull: IRegisteredValue) => {
  return getColorFromType(skull.type)
}

const addLegend = (plot: d3.Selection<SVGSVGElement | null, {}, null, undefined>, types: string[]) => {
  const legendMargin = 40
  const legendGap = 15
  const legendRadius = 4

  plot
      .selectAll('Legend-Dot')
      .data(types)
      .enter()
      .append('circle')
      .attr('cx', legendMargin)
      .attr('cy', (d, i) => legendMargin + legendGap * i)
      .attr('r', legendRadius)
      .style('fill', getColorFromType)

  plot
      .selectAll('Legend-Text')
      .data(types)
      .enter()
      .append('text')
      .text(d => d)
      .attr('x', legendMargin + legendGap - legendRadius)
      .attr('y', (d, i) => legendMargin + legendGap * i)
      .attr('text-anchor', 'left')
      .attr('dominant-baseline', 'middle')
      .style('fill', getColorFromType)
      .style('font', `${legendRadius * 3}px sans-serif`)
}

const zoom = (timeDomain: d3.ScaleTime<number, number>,
              timeAxis: d3.Selection<SVGGElement, {}, null, undefined>,
              bars: d3.Selection<SVGRectElement, IRegisteredValue, SVGSVGElement | null, {}>,
              types: string[],
              initial: number | Date,
              final: number | Date,
              dayWidthRatio: number,
              nice = true) => {
  timeDomain.domain([initial, final])
  if (nice) {
    timeDomain.nice()
  }

  const dayWidthStart = (1.0 - dayWidthRatio) / 2
  const zoomDayWidth = (timeDomain(new Date(0, 0, 1).getTime()) - timeDomain(new Date(0, 0, 0).getTime()))
  const zoomTypeWidth = zoomDayWidth * dayWidthRatio / types.length
  const zoomTypeStart = zoomDayWidth * dayWidthStart

  timeAxis
      .transition()
      .duration(750)
      .call(d3.axisBottom(timeDomain).tickFormat(DateFormatter.format))

  bars
      .transition()
      .duration(750)
      .attr('x', d => timeDomain(d.millis) + zoomTypeStart + types.indexOf(d.type) * zoomTypeWidth)
      .attr('width', zoomTypeWidth)
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

class DateFormatter {
  private static readonly formatEmpty = d3.timeFormat('')
  private static readonly formatDay = d3.timeFormat('%a %d')
  private static readonly formatWeek = d3.timeFormat('%b %d')
  private static readonly formatMonth = d3.timeFormat('%B')
  private static readonly formatYear = d3.timeFormat('%Y')

  static format = (value: number | Date | { valueOf(): number }, index: number) => {
    const date = new Date(value.valueOf())

    return ((d3.timeDay(date) < date && index > 0) ? DateFormatter.formatEmpty
        : d3.timeWeek(date) < date ? DateFormatter.formatDay
        : d3.timeMonth(date) < date ? DateFormatter.formatWeek
        : d3.timeYear(date) < date ? DateFormatter.formatMonth
        : DateFormatter.formatYear)(date)
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

    // Static constants
    const margin = 20
    const dayWidthRatio = 0.9
    const dayWidthStart = (1.0 - dayWidthRatio) / 2
    const dayInMillis = 86400000

    // Calculated constants
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

    // Sizes
    const width = this.svgRef.current!.clientWidth
    const height = this.svgRef.current!.clientHeight
    const plotHeight = height - margin

    // Chart basis
    const chart = d3.select(this.svgRef.current)
    const plot = chart.attr('width', width).attr('height', plotHeight)
    const amountDomain = d3.scaleLinear().domain([0, minMaxAmount.max]).range([plotHeight, 0]).nice()
    const timeDomain = d3.scaleTime().domain([minMaxMillis.min, minMaxMillis.max + dayInMillis]).range([margin, width - margin]).nice()

    // Chart-derived constants
    const dayWidth = (timeDomain(new Date(0, 0, 1).getTime()) - timeDomain(new Date(0, 0, 0).getTime()))
    const typeWidth = dayWidth * dayWidthRatio / types.length
    const typeStart  = dayWidth * dayWidthStart
    const scaledZero = amountDomain(0)

    const timeAxis = chart.append('g')
        .attr('transform', `translate(${0}, ${plotHeight})`)
        .call(d3.axisBottom(timeDomain).tickFormat(DateFormatter.format))

    const bars = plot
        .selectAll('Bars')
        .data(this.state.skullValues)
        .enter()
        .append('rect')
        .classed('Chart-Bar', true)
        .attr('x', d => timeDomain(d.millis) + typeStart + types.indexOf(d.type) * typeWidth)
        .attr('y', scaledZero)
        .attr('width', typeWidth)
        .attr('height', 0)
        .attr('fill', getColorFromSkull)

    bars
        .transition()
        .duration(750)
        .attr('y', d => amountDomain(d.amount))
        .attr('height', d => scaledZero - amountDomain(d.amount))

    const brush = d3.brushX()
        .extent([[0, 0], [width, plotHeight]])
        .on('end', () => {
          const extent = d3.event.selection
          if (!extent) {
            return
          }
          plottedBrush.call(brush.move)
          zoom(timeDomain, timeAxis, bars, types, timeDomain.invert(extent[0]), timeDomain.invert(extent[1]), dayWidthRatio, false)
        })

    const plottedBrush = plot.append('g')
        .call(brush)
        .on('dblclick', () => zoom(timeDomain, timeAxis, bars, types, minMaxMillis.min, minMaxMillis.max + dayInMillis, dayWidthRatio))

    addLegend(plot, types)
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
