import React, { Component } from 'react'
import logo from '../logo.svg'
import './app.less'

class App extends Component{
    render(){
        return(
            <div><img className="logo" src={logo} alt="" /></div>
        )
    }
}

export default App