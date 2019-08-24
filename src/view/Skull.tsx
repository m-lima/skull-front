import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
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
import { ApiException } from '../model/Exception'
import ISkullValue, { IRegisteredValue, IQuickValue } from '../model/ISkullValue'

const Banner = (props: { text: string }) => {
  return (
    <div className='Banner-text'>
      {props.text}
    </div>
  )
}

interface IState extends IQueryState {
  quickValues: IQuickValue[]
  skullValues: IRegisteredValue[]
  icons: Map<string, string>
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
      this.setState({ quickValues: [], skullValues: [], icons: new Map<string, string>(), status: ex.status })
    } else {
      console.error(ex)
      this.setState({ quickValues: [], skullValues: [], icons: new Map<string, string>(), status: Status.ERROR })
    }
  }

  load() {
    this.setState({ quickValues: [], skullValues: [], icons: new Map<string, string>(), status: Status.LOADING })
    Promise.all([Fetch.quickValues(), Fetch.registeredValues()])
        .then(r => this.setState({
          quickValues: r[0],
          icons: r[0].reduce((m, v) => {
            m.set(v.type + v.amount, v.icon)
            return m
          }, new Map<string, string>()),
          skullValues: r[1].reverse(),
          status: Status.OK,
        }))
        .catch(this.handleException)
  }

  push(skullValue: ISkullValue) {
    this.setState({ status: Status.LOADING })
    Push.skullValue(skullValue)
        .then(() => this.load())
        .catch(this.handleException)
  }

  delete(skullValue: IRegisteredValue) {
    this.setState({ status: Status.LOADING })
    Push.deletion(skullValue)
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
                    render={() => <Grid skullValues={this.state.quickValues} push={this.push} />}
                />
                <Route
                    exact={true}
                    path={Config.Path.summary}
                    render={() => <Summary
                        skullValues={this.state.skullValues}
                        icons={this.state.icons}
                        delete={this.delete}
                    />}
                />
                <Route
                    exact={true}
                    path={Config.Path.chart}
                    render={() => <Chart skullValues={this.state.skullValues} />}
                />
              </Switch>
            </div>
            <Route render={match => <Footer path={match.location.pathname}/>}/>
          </Router>
        </div>
    )
  }
}
