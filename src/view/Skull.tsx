import React, { Component } from 'react'
import './Skull.css'
import SkullButton from './SkullButton'
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
      <div className='Skull'>
        <div className='Skull-grid' >
          {this.state.quickValues && this.state.quickValues.map((q, i) => <SkullButton {...q} key={i} />)}
        </div>
      </div>
    )
  }
}

export default App;
