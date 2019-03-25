import React, { Component } from 'react'
import './App.css'
import logo from '../res/img/logo.svg'
import QuickValueButton from './QuickValueButton'
import QuickValue from '../model/QuickValue'
import Fetch from '../control/Fetch'
import { NotOkException } from '../model/Exception'

interface IState {
  quickValues: QuickValue[]
}

interface IProps { }

class App extends Component<IProps, IState> {
  state = {
    quickValues: []
  }

  componentDidMount() {
    Fetch.quickValues()
      .then(q => this.setState({ quickValues: q }))
      .catch(ex => {
        if (ex instanceof NotOkException) {
          let status = ex.status
          if (status == 401) {
            window.location.href = 'https://api.mflima.com/login' + '?redirect=' + window.location
          } else {
            console.error('HTTP error status: ' + status)
          }
        } else {
          console.error(ex)
        }
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.state.quickValues && this.state.quickValues.map((q, i) => <QuickValueButton quickValue={q} key={i} />)}
        </header>
      </div>
    )
  }
}

export default App;
