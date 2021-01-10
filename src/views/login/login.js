import React,{useContext, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {myContext} from '../app/app'

import service from '../../require'

export default function Login(props) {
    const histroy = useHistory()
    const [, dispatch] = useContext(myContext)
    const setToken =()=>{
        let RedirectUrl = props.to.state ? props.to.state.from.pathname : '/'
        service.post('fssc-common/login/passwordLogin',{'username': 'jinglin.lin', 'password': '54ab9d22ca4e4db5c0bee72dadf7abeb', 'lang': 'zh_cn'},{formData:true}).then(res=>{
            if(res.rstCode===0){
                dispatch({type:'saveLoginInfo',data:res.data})
                sessionStorage.setItem('saveLoginInfo',JSON.stringify(res.data))
                histroy.replace(RedirectUrl)
            }
        }).catch(err=>{
            dispatch({type:'saveLoginInfo',data:{}})
            sessionStorage.setItem('saveLoginInfo', JSON.stringify({}))
            histroy.replace('/')
        })
    }
    // setToken()
    useEffect(()=>{
       setToken()
    })
    return <div>sso login</div>
}
