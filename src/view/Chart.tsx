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
  let color = 0
  for (let i = 0; i < skull.type.length; i++) {
    color += skull.type.charCodeAt(i)
  }
  color %= 255
  return d3.rgb(color, color, color).hex()
}

interface IState extends IQueryState {
  skullValues: IRegisteredValue[]
  icons: Map<string, string>
  selected?: IRegisteredValue
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
      this.setState({ skullValues: [], status: ex.status, icons: new Map<string, string>(), selected: undefined })
    } else {
      console.error(ex)
      this.setState({ skullValues: [], status: Status.ERROR, icons: new Map<string, string>(), selected: undefined })
    }
  }

  load() {
    this.setState({ skullValues: [], status: Status.LOADING, selected: undefined })
    Promise.all([Fetch.registeredValues(), Fetch.quickValues()])
      .then(r => this.setState({
        skullValues: r[0],
        status: (r[0].length > 0 ? Status.OK : Status.EMPTY),
        icons: r[1].reduce((m, v) => {
          m.set(v.type + v.amount, v.icon)
          return m
        }, new Map<string, string>()),
        selected: undefined,
      }))
      .then(this.updateChart)
      .catch(this.handleException)
  }

  componentDidMount() {
    this.load()
  }

  updateChart() {
    console.log('Update')
    if (this.state.skullValues) {
      d3.select(this.svgRef.current)
        .selectAll("rect")
        .data(this.state.skullValues)
        .enter()
        .append('rect')
        .attr("x", (_, i) => i * 70)
        .attr("y", d => 600 - (10 * d.amount))
        .attr("width", 65)
        .attr("height", (d, i) => d.amount * 10)
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
        return (<svg className="Chart" ref={this.svgRef} height={600} />)
      case Status.EMPTY:
        return <Message.Empty />
      case Status.FORBIDDEN:
        return <Message.Unauthorized />
      case Status.ERROR:
        return <Message.Error />
    }
  }
}
