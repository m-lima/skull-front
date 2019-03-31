import React, { Component, Fragment } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import './css/Skull.css'

import * as Config from '../model/Config'
import Environment from '../model/Environment'
import Footer from './Footer'
import Grid from './Grid'
import Summary from './Summary'

const Banner = (props: { text: string }) => {
  return (
    <div className='Banner-text'>
      {props.text}
    </div>
  )
}

export default class Skull extends Component {
  render() {
    return (
      <div className='Skull'>
        {
          // @ts-ignore
          (Config.environment == Environment.DEVELOPMENT) && <Banner text='Development' />
        }
        <Router>
          <div className='Skull-container'>
            <Switch>
              <Route exact={true} path={Config.Path.grid} component={Grid} />
              <Route exact={true} path={Config.Path.summary} component={Summary} />
              <Route exact={true} path={Config.Path.chart} component={Summary} />
            </Switch>
            {/* <Route component={Footer} /> */}
          </div>
          <Route render={match => <Footer path={match.location.pathname} />} />
        </Router>
      </div>
    )
  }
}
