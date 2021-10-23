import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './css/Main.css'

import * as Config from '../model/Config'
import * as Message from './Message'
import Access from '../control/Access'
import Chart from './Chart'
import Environment from '../model/Environment'
import Fetch from '../control/Fetch'
import Footer from './Footer'
import Grid from './Grid'
import IQueryState from '../model/IQueryState'
import Push from '../control/Push'
import Status from '../model/Status'
import Summary from './Summary'
import { ApiException, IllegalStateException } from '../model/Exception'
import { Skull, Quick, Occurrence, ProtoOccurrence } from '../model/Skull'

const Banner = (props: { text: string }) => {
  return (
    <div className='Banner-text'>
      {props.text}
    </div>
  )
}

interface IState extends IQueryState {
  skulls: Skull[]
  quicks: Quick[]
  occurrences: Occurrence[]
}

export default class Main extends Component<{}, IState> {

  private timer?: NodeJS.Timeout

  constructor(props: {}) {
    super(props)
    this.handleException = this.handleException.bind(this)
    this.push = this.push.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
    this.load = this.load.bind(this)
    this.checkModified = this.checkModified.bind(this)
  }

  handleException(ex: any) {
    if (ex instanceof ApiException) {
      if (ex.status === Status.UNAUTHORIZED) {
        Access.login()
        return
      }
      console.error('HTTP error status: ' + ex.httpStatus)
      this.setState({ skulls: [], quicks: [], occurrences: [], status: ex.status })
    } else {
      console.error(ex.toString())
      this.setState({ skulls: [], quicks: [], occurrences: [], status: Status.ERROR })
    }
    console.error(ex)
  }

  // TODO: Load in pages
  load() {
    this.setState({ skulls: [], quicks: [], occurrences: [], status: Status.LOADING })
    this.loadInner()
      .then(() => this.setState({ status: Status.OK }))
      .catch(this.handleException)
  }

  async loadInner() {
    return Promise.all([Fetch.skulls(), Fetch.quicks(), Fetch.occurrences()])
        .then(r => this.setState({
          skulls: r[0],
          quicks: r[1].map(q => new Quick(q, r[0])),
          occurrences: r[2].map(o => new Occurrence(o, r[0])).reverse(),
          lastChecked: new Date(),
        }))
  }

  push(occurrence: ProtoOccurrence, skull: Skull) {
    this.setState({ status: Status.LOADING })
    this.checkModifiedInner()
        .then(() => Push.create(occurrence, skull))
        .then(newIOccurrence => {
          const newOccurrence = new Occurrence(newIOccurrence, this.state.skulls)
          this.setState(prev => ({
            occurrences: [ newOccurrence, ...prev.occurrences ],
            status: Status.OK,
            lastChecked: new Date(),
          }))
        })
        .catch(this.handleException)
  }

  update(occurrence: Occurrence, skull: Skull) {
    this.setState({ status: Status.LOADING })
    this.checkModifiedInner()
        .then(() => Push.update(occurrence, skull))
        .then(() => {
          const index = this.state.occurrences.findIndex(o => o.id === occurrence.id)
          if (index < 0) {
            throw new IllegalStateException()
          }
          this.setState(prev => {
            prev.occurrences[index] = occurrence
            return ({
              occurrences: prev.occurrences,
              status: Status.OK,
              lastChecked: new Date(),
            })
          })
        })
        .catch(this.handleException)
  }

  delete(occurrence: Occurrence) {
    this.setState({ status: Status.LOADING })
    this.checkModifiedInner()
        .then(() => Push.deletion(occurrence))
        .then(() => {
          const index = this.state.occurrences.findIndex(o => o.id === occurrence.id)
          if (index < 0) {
            throw new IllegalStateException()
          }
          this.setState(prev => {
            prev.occurrences.splice(index, 1)
            return ({
              occurrences: prev.occurrences,
              status: Status.OK,
              lastChecked: new Date(),
            })
          })
        })
        .catch(this.handleException)
  }

  checkModified() {
    this.checkModifiedInner().catch(this.handleException)
  }

  async checkModifiedInner() {
    return Fetch.lastModified().then(timestamp => {
      if (timestamp.date > this.state.lastChecked) {
        return this.loadInner()
      } else {
        this.setState({ lastChecked: new Date() })
        return Promise.resolve()
      }
    })
  }

  componentDidMount = () => {
    this.timer = setInterval(this.checkModified, 60 * 1000)
    this.load()
  }

  componentWillUnmount = () => {
    clearInterval(this.timer!)
  }

  render() {
    if (!this.state) {
      return <Message.Loading/>
    }

    switch (this.state.status) {
      case Status.LOADING:
        return <Message.Loading/>
      case Status.FORBIDDEN:
        return <Message.Unauthorized/>
      case Status.ERROR:
        return <Message.Error/>
    }

    return (
        <div className='Skull'>
          {
            // @ts-ignore
            (Config.environment === Environment.DEVELOPMENT) && <Banner text='Development'/>
          }
          <Router>
            <div className='Skull-container'>
              <Switch>
                <Route
                    exact={true}
                    path={Config.Path.grid}
                    render={() => <Grid
                        skulls={this.state.skulls}
                        quicks={this.state.quicks}
                        occurrences={this.state.occurrences}
                        push={this.push}
                    />}
                />
                <Route
                    exact={true}
                    path={Config.Path.summary}
                    render={() => <Summary
                        skulls={this.state.skulls}
                        occurrences={this.state.occurrences}
                        update={this.update}
                        delete={this.delete}
                    />}
                />
                <Route
                    exact={true}
                    path={Config.Path.chart}
                    render={() => <Chart
                        skulls={this.state.skulls}
                        occurrences={this.state.occurrences}
                    />}
                />
              </Switch>
            </div>
            <Route render={match => <Footer path={match.location.pathname}/>}/>
          </Router>
        </div>
    )
  }
}
