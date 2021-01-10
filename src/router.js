import React, {useContext} from 'react'
import {HashRouter,Route,Switch} from 'react-router-dom'

import {myContext} from './views/app/app'

import Index from './views/index/index'
import Login from './views/login/login'
import MyOrder from './views/myOrder/myOrder'
import OrderDetail from './views/orderDeatil/orderDetail'


const routes = [
    {path:'/login',name:'login',component:Login},
    {path:'/index/:billNumber',name:'index',component:Index, requiresAuth:true},
    {path:'/myOrder',name:'myOrder',component:MyOrder, requiresAuth:true},
    {path:'/orderDetail/:billNumber',name:'orderDetail',component:OrderDetail, requiresAuth:true},
    {path:'/',name:'index',component:Index, requiresAuth:true},
]

export default function RouterConfig() {
    const [{userInfo:token}] = useContext(myContext)
    return (
        <HashRouter> 
            <Switch>
            {
                    routes.map((route, index) => {
                        return  ( < Route key = { index} path = { route.path} render={props=>{
                            return (token ? (<route.component {...props} />) :( route.requiresAuth?(<Login to={{'pathname':'/login',state:{from:props.location}}}/>):(<route.component {...props} />) ))
                        }} />)
                    })
                }
            </Switch>
        </HashRouter>
    )
    
}