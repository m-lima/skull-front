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

const getColorFromType = (skull: ISkullValue) => {
  const prime = 16777619
  const offset = 2166136261

  let color = offset
  for (let i = 0; i < skull.type.length; i++) {
    color *= prime
    color ^= skull.type.charCodeAt(i)
  }

  color %= 16581375
  return d3.rgb((color & 0xFF0000) >> 16, (color & 0xFF00) >> 8, color & 0xFF).hex()
}

interface IState extends IQueryState {
  skullValues: IRegisteredValue[]
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
    if (this.state.skullValues && this.state.skullValues.length > 0) {
      const maxAmount = this.state.skullValues.map(skull => skull.amount).reduce((prev, curr) => curr > prev ? curr : prev)
      const width = this.svgRef.current!.clientWidth
      const height = this.svgRef.current!.clientHeight
      const barWidth = width / this.state.skullValues.length
      const barHeightRatio = height / maxAmount

      d3.select(this.svgRef.current)
        .selectAll("rect")
        .data(this.state.skullValues)
        .enter()
        .append('rect')
        .attr("x", (_, i) => i * barWidth)
        .attr("y", d => height - d.amount * barHeightRatio)
        .attr("width", barWidth * 0.9)
        .attr("height", d => d.amount * barHeightRatio)
        .attr("fill", getColorFromType)
    }
  }

  render() {
    if (!this.state) {
      return <Message.Loading />
    }

    switch (this.state.status) {
      case Status.LOADING:
        return <Message.Loading />
      case Status.OK:
        return (<svg className="Chart" ref={this.svgRef} />)
      case Status.EMPTY:
        return <Message.Empty />
      case Status.FORBIDDEN:
        return <Message.Unauthorized />
      case Status.ERROR:
        return <Message.Error />
    }
  }
}
