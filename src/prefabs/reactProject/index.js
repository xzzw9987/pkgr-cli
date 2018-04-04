import React, { Component } from 'react'
import { render } from 'react-dom'
import '../css/index.css'

class App extends Component {
  render () {
    return (<div>Hello World</div>)
  }
}

render(<App />, document.querySelector('#root'))

/**
 * if you want to use react-hot-loader ...

import React, { Component } from 'react'
import { render } from 'react-dom'
import 'react-hot-loader/patch'
import { AppContainer } from 'react-hot-loader'

class App extends Component {
  render () {
    return (<div>Hello World</div>)
  }
}

render(<AppContainer><App/></AppContainer>, document.querySelector('#root'))

 */
