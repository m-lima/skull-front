import React, { Component } from 'react'
import './App.css'
import QuickValueButton from './QuickValueButton'
import IQuickValue from '../model/IQuickValue'
import Fetch from '../control/Fetch'
import * as Exception from '../model/Exception'
import HTTPStatusCode from '../model/HTTPStatusCode';
import Access from '../control/Access';

interface IState {
  quickValues: IQuickValue[]
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
        if (ex instanceof Exception.NotOk) {
          let status = ex.status
          if (status == HTTPStatusCode.UNAUTHORIZED) {
            Access.login()
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
      <div className="Skull">
        <header className="Skull-header">
          {this.state.quickValues && this.state.quickValues.map((q, i) => <QuickValueButton quickValue={q} key={i} />)}
        </header>
      </div>
    )
  }
}

export default App;
