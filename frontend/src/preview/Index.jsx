import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContext } from '../App'
import Session from '../Session'
import Environ from '../Environ'
import Main from '../items/Main'
import State from './State'
import './Index.css'

ReactDOM.render(
  <React.StrictMode>
    <AppContext path="preview"
      reducer={State.reducer}
      initial={State.initial}
      sessioner={Session.api("preview" + Environ.wsQuery)}>
      <Main />
    </AppContext>
  </React.StrictMode>,
  document.getElementById('root')
)
