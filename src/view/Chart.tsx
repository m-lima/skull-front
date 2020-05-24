import React, { PureComponent } from 'react'
import * as d3 from 'd3'
import './css/Chart.css'

import * as Message from './Message'
import * as Util from '../Util'
import { Skull, Occurrence } from '../model/Skull'

const addLegend = (plot: d3.Selection<SVGGElement, {}, null, undefined>, skull: Skull[]) => {
  const legendMargin = 40
  const legendGap = 15
  const legendRadius = 4

  plot
      .selectAll('Legend-Dot')
      .data(skull)
      .enter()
      .append('circle')
      .attr('cx', legendMargin)
      .attr('cy', (s, i) => legendMargin + legendGap * i)
      .attr('r', legendRadius)
      .style('fill', s => s.color)

  plot
      .selectAll('Legend-Text')
      .data(skull)
      .enter()
      .append('text')
      .text(s => s.name)
      .attr('x', legendMargin + legendGap - legendRadius)
      .attr('y', (s, i) => legendMargin + legendGap * i)
      .attr('text-anchor', 'left')
      .attr('dominant-baseline', 'middle')
      .style('fill', s => s.color)
      .style('font', `${legendRadius * 3}px sans-serif`)
}

const zoom = (timeDomain: d3.ScaleTime<number, number>,
              timeAxis: d3.Selection<SVGGElement, {}, null, undefined>,
              bars: d3.Selection<SVGRectElement, Occurrence, SVGGElement, {}>,
              skulls: Skull[],
              initial: number | Date,
              final: number | Date,
              nice = true) => {
  timeDomain.domain([initial, final])
  if (nice) {
    timeDomain.nice()
  }

  timeAxis
      .transition()
      .duration(750)
      .call(d3.axisBottom(timeDomain).tickFormat(DateFormatter.format))

  bars
      .transition()
      .duration(750)
      .attr('x', o => {
        const dayEnd = new Date(o.millis)
        dayEnd.setDate(dayEnd.getDate() + 1)
        return timeDomain(o.millis) + skulls.indexOf(o.skull) * (timeDomain(dayEnd.getTime()) - timeDomain(o.millis)) / skulls.length
      })
      .attr('width', o => {
        const dayEnd = new Date(o.millis)
        dayEnd.setDate(dayEnd.getDate() + 1)
        return (timeDomain(dayEnd.getTime()) - timeDomain(o.millis)) / skulls.length
      })
}

interface IProps {
  skulls: Skull[]
  occurrences: Occurrence[]
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

export default class Chart extends PureComponent<IProps> {
  private svgRef = React.createRef<SVGSVGElement>()

  getSizesAndOrientation(margin: number) {
    const screenWidth = this.svgRef.current!.clientWidth
    const screenHeight = this.svgRef.current!.clientHeight
    const orientation = screenWidth >= screenHeight ? Orientation.HORIZONTAL : Orientation.VERTICAL

    const width = orientation === Orientation.HORIZONTAL ? screenWidth : screenHeight
    const height = orientation === Orientation.HORIZONTAL ? screenHeight : screenWidth
    const plotWidth = width - 2 * margin
    const plotHeight = height - margin

    return { width, height, plotWidth, plotHeight, orientation }
  }

  componentDidMount() {
    if (!this.svgRef.current || this.props.skulls.length < 1 || this.props.occurrences.length < 1) {
      return
    }

    // Static constants
    const margin = 20
    const dayInMillis = 86400000

    // Calculated constants
    const occurrences = this.props.occurrences
        .map(Util.normalizeDate)
        .sort((a, b) => a.millis === b.millis ? a.skull.id - b.skull.id : a.millis - b.millis)
        .reduce((acc, curr) => {
          const tail = acc[acc.length - 1]
          if (tail && curr.millis === tail.millis && curr.skull.id === tail.skull.id) {
            tail.amount += curr.amount
          } else {
            acc.push(curr)
          }
          return acc
        }, [] as Occurrence[])
    const minMaxAmount = occurrences
        .map(skull => skull.amount)
        .reduce(MinMax.update, new MinMax())
    const minMaxMillis = occurrences
        .map(skull => skull.millis)
        .reduce(MinMax.update, new MinMax())
    const initialZoom = occurrences
        .map(skull => skull.millis)
        .reverse()
        .reduce((prev, curr) => prev - curr > 2 * dayInMillis ? prev : curr)

    // Sizes
    const { width, height, plotWidth, plotHeight, orientation } = this.getSizesAndOrientation(margin)

    // Chart basis
    const chart = d3.select(this.svgRef.current).append('g')
    const plot = orientation === Orientation.HORIZONTAL
        ? chart
        : chart.attr('transform', `rotate(90, 0, ${height}) translate(-${height}, 0)`)
    const amountDomain = d3
        .scaleLinear()
        .domain([0, minMaxAmount.max])
        .range([plotHeight, margin])
        .nice()
    const timeDomain = d3
        .scaleTime()
        .domain([initialZoom, minMaxMillis.max + dayInMillis])
        .range([margin, width - margin])
        .nice()
    plot
        .append('clipPath')
        .attr('id', 'clip-rect')
        .append('rect')
        .attr('width', plotWidth)
        .attr('height', plotHeight)
        .attr('x', margin)

    // Chart-derived constants
    const dayWidth = (timeDomain(new Date(0, 0, 1).getTime()) - timeDomain(new Date(0, 0, 0).getTime()))
    const skullWidth = dayWidth / this.props.skulls.length
    const scaledZero = amountDomain(0)

    const bars = plot
        .append('g')
        .attr('clip-path', 'url(#clip-rect)')
        .selectAll('Bars')
        .data(occurrences)
        .enter()
        .append('rect')
        .classed('Chart-Bar', true)
        .attr('x', o => timeDomain(o.millis) + this.props.skulls.indexOf(o.skull) * skullWidth)
        .attr('width', skullWidth)
        .attr('y', scaledZero)
        .attr('height', 0)
        .attr('fill', o => o.skull.color)

    bars
        .transition()
        .duration(750)
        .attr('y', d => amountDomain(d.amount))
        .attr('height', d => scaledZero - amountDomain(d.amount))

    const brush = d3
        .brushX()
        .extent([[0, 0], [width, plotHeight]])
        .on('end', () => {
          const extent = d3.event.selection
          if (!extent) {
            return
          }
          plottedBrush.call(brush.move)
          zoom(timeDomain, timeAxis, bars, this.props.skulls, timeDomain.invert(extent[0]), timeDomain.invert(extent[1]), false)
        })

    const plottedBrush = plot
        .append('g')
        .call(brush)
        .on('click', () => zoom(timeDomain, timeAxis, bars, this.props.skulls, minMaxMillis.min, minMaxMillis.max + dayInMillis))

    const timeAxis = plot
        .append('g')
        .attr('transform', `translate(${0}, ${plotHeight})`)
        .call(d3.axisBottom(timeDomain).tickFormat(DateFormatter.format))

    plot
        .append('g')
        .attr('transform', `translate(${margin}, 0)`)
        .call(d3.axisLeft(amountDomain))

    addLegend(plot, this.props.skulls)
  }

  render = () =>
    this.props.skulls.length < 1 || this.props.occurrences.length < 1
      ? <Message.Empty />
      : <svg className='Chart' ref={this.svgRef} />
}
