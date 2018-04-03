import a from './a.js'
console.log(a)
import('./b').then(d => console.log(d))
import('./c')

// import 'react-hot-loader/patch'
// import { AppContainer } from 'react-hot-loader'
//
// import React, { Component, Fragment } from 'react'
// import { render } from 'react-dom'
// import App from './app'
//
// render(
//   <AppContainer>
//     <Fragment>
//       <App/>
//     </Fragment>
//   </AppContainer>,
//   document.querySelector('#root')
// )
//
// if (module.hot) {
//   module.hot.accept(() => {
//     render(
//         <App/>,
//       document.querySelector('#root')
//     )
//   })
// }
//
// render(<App/>, document.body)
