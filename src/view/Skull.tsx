import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch,} from 'react-router-dom'
import './css/Skull.css'

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
import {ApiException} from '../model/Exception'
import {ISkull, IValuedSkull, IValuedSkull as IQuick, IOccurrence} from '../model/ISkull'

const Banner = (props: { text: string }) => {
  return (
    <div className='Banner-text'>
      {props.text}
    </div>
  )
}

interface IState extends IQueryState {
  skulls: ISkull[]
  quicks: IQuick[]
  occurrences: IOccurrence[]
}

export default class Skull extends Component<{}, IState> {

  constructor(props: {}) {
    super(props)
    this.handleException = this.handleException.bind(this)
    this.push = this.push.bind(this)
    this.delete = this.delete.bind(this)
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
      console.error(ex)
      this.setState({ skulls: [], quicks: [], occurrences: [], status: Status.ERROR })
    }
  }

  load() {
    this.setState({ skulls: [], quicks: [], occurrences: [], status: Status.LOADING })
    Promise.all([Fetch.skulls(), Fetch.quicks(), Fetch.occurrences()])
        .then(r => this.setState({
          skulls: r[0],
          quicks: r[1]
              .map(v => {
                return { skull: r[0].find(s => s.id === v.skull), amount: v.amount }
              })
              .filter(v => v.skull)
              .map(v => {
                return { skull: v.skull!, amount: v.amount}
              }),
          occurrences: r[2]
              .map(v => {
                return { skull: r[0].find(s => s.id === v.skull), id: v.id, amount: v.amount, millis: v.millis }
              })
              .filter(v => v.skull)
              .map(v => {
                return { skull: v.skull!, id: v.id, amount: v.amount, millis: v.millis }
              })
              .reverse(),
          status: Status.OK,
        }))
        .catch(this.handleException)
  }

  push(skull: IValuedSkull) {
    this.setState({ status: Status.LOADING })
    Push.skull(skull)
        .then(() => this.load())
        .catch(this.handleException)
  }

  delete(occurrence: IOccurrence) {
    this.setState({ status: Status.LOADING })
    Push.deletion(occurrence)
        .then(() => this.load())
        .catch(this.handleException)
  }

  componentDidMount = () => this.load()

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
                        push={this.push}
                    />}
                />
                <Route
                    exact={true}
                    path={Config.Path.summary}
                    render={() => <Summary
                        occurrences={this.state.occurrences}
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
