import React, { Component } from 'react'
import * as d3 from 'd3'
import './css/Chart.css'

import * as Message from './Message'
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

const addLegend = (plot: d3.Selection<SVGGElement, {}, null, undefined>, types: string[]) => {
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
              bars: d3.Selection<SVGRectElement, IRegisteredValue, SVGGElement, {}>,
              types: string[],
              initial: number | Date,
              final: number | Date,
              nice = true) => {
  timeDomain.domain([initial, final])
  if (nice) {
    timeDomain.nice()
  }

  const dayWidth = (timeDomain(new Date(0, 0, 1).getTime()) - timeDomain(new Date(0, 0, 0).getTime()))
  const typeWidth = dayWidth / types.length

  timeAxis
      .transition()
      .duration(750)
      .call(d3.axisBottom(timeDomain).tickFormat(DateFormatter.format))

  bars
      .transition()
      .duration(750)
      .attr('x', d => timeDomain(d.millis) + types.indexOf(d.type) * typeWidth)
      .attr('width', typeWidth)
}

const normalizeTime = (value: IRegisteredValue): IRegisteredValue => {
  const normalizedDate = new Date(value.millis)
  normalizedDate.setHours(0)
  normalizedDate.setMinutes(0)
  normalizedDate.setSeconds(0)
  normalizedDate.setMilliseconds(0)
  return { type: value.type, amount: value.amount, millis: normalizedDate.getTime() }
}

interface IProps {
  skullValues: IRegisteredValue[]
}

enum Orientation {
  HORIZONTAL,
  VERTICAL,
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

export default class Chart extends Component<IProps> {
  private svgRef = React.createRef<SVGSVGElement>()

  getSizesAndOrientation(margin: number) {
    const screenWidth = this.svgRef.current!.clientWidth
    const screenHeight = this.svgRef.current!.clientHeight
    const orientation = screenWidth >= screenHeight ? Orientation.HORIZONTAL : Orientation.VERTICAL

    const width = orientation === Orientation.HORIZONTAL ? screenWidth : screenHeight
    const height = orientation === Orientation.HORIZONTAL ? screenHeight : screenWidth
    const plotHeight = height - margin

    return { width, height, plotHeight, orientation }
  }

  componentDidMount() {
    this.updateChart()
  }

  updateChart() {
    if (this.props.skullValues.length < 1) {
      return
    }

    // Static constants
    const margin = 20
    const dayInMillis = 86400000

    // Calculated constants
    const skullValues = this.props.skullValues.map(normalizeTime)
    const minMaxAmount = skullValues
        .map(skull => skull.amount)
        .reduce(MinMax.update, new MinMax())
    const minMaxMillis = skullValues
        .map(skull => skull.millis)
        .reduce(MinMax.update, new MinMax())
    const types = skullValues.map(skull => skull.type)
        .reduce((list, value) => {
          !list.find(v => value === v) && list.push(value)
          return list
        }, [] as string[])
    const initialZoom = skullValues
        .map(skull => skull.millis)
        .reduce((prev, curr) => curr - prev > 2 * dayInMillis ? curr : prev)

    // Sizes
    const { width, height, plotHeight, orientation } = this.getSizesAndOrientation(margin)

    // Chart basis
    const chart = d3.select(this.svgRef.current).append('g').attr('width', width).attr('height', plotHeight)
    const plot = orientation === Orientation.HORIZONTAL
        ? chart
        : chart.attr('transform', `rotate(90, 0, ${height}) translate(-${height}, 0)`)
    const amountDomain = d3
        .scaleLinear()
        .domain([0, minMaxAmount.max])
        .range([plotHeight, 0])
        .nice()
    const timeDomain = d3
        .scaleTime()
        .domain([initialZoom, minMaxMillis.max + dayInMillis])
        .range([margin, width - margin])
        .nice()

    // Chart-derived constants
    const dayWidth = (timeDomain(new Date(0, 0, 1).getTime()) - timeDomain(new Date(0, 0, 0).getTime()))
    const typeWidth = dayWidth / types.length
    const scaledZero = amountDomain(0)

    const timeAxis = plot.append('g')
        .attr('transform', `translate(${0}, ${plotHeight})`)
        .call(d3.axisBottom(timeDomain).tickFormat(DateFormatter.format))

    const bars = plot
        .selectAll('Bars')
        .data(skullValues)
        .enter()
        .append('rect')
        .classed('Chart-Bar', true)
        .attr('x', d => timeDomain(d.millis) + types.indexOf(d.type) * typeWidth)
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
          zoom(timeDomain, timeAxis, bars, types, timeDomain.invert(extent[0]), timeDomain.invert(extent[1]), false)
        })

    const plottedBrush = plot.append('g')
        .call(brush)
        .on('click', () => zoom(timeDomain, timeAxis, bars, types, minMaxMillis.min, minMaxMillis.max + dayInMillis))

    addLegend(plot, types)
  }

  render = () =>
    this.props.skullValues.length < 1
      ? <Message.Empty />
      : <svg className='Chart' ref={this.svgRef} />
}
