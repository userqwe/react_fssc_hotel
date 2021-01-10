import React, {createContext,useReducer } from 'react'

import './app.less'
import RouterConfig from '../../router'
import {reducer,initData} from '../../reducer'

export const myContext =createContext()

export default function App (){
    const [state, dispatch] = useReducer(reducer, initData)
    return(
        <myContext.Provider value={[state,dispatch]}>
            <RouterConfig/>
        </myContext.Provider>
    )
}

