/* eslint-disable react-hooks/exhaustive-deps */
import{useState,useMemo,useEffect} from 'react'
import {createPortal} from 'react-dom'
import './index.less'

export default function UserDept (props){
    const [visible, setVisible] = useState(false)
    const [model, setModel] = useState({})
    const node = useMemo(() => document.createElement('div'),[])
    
    useMemo(()=>{
        setVisible(props.model.visible)
        setModel(props.model)
    },[props])

    useEffect(()=>{
        document.body.appendChild(node)
        return ()=>{
            document.body.removeChild(node)
        }
    },[])

    // 关闭弹窗
    const closeMask = (e)=>{
        if (e) {
            setVisible(false)
            props.model.type =null
            props.model.visible=false
        }
        props.model.callback(props.model)
    }

    // 选择姓名或是部门
    const checkResident = (e,type)=>{
        e&&e.stopPropagation()
        props.model.type = type
        closeMask(type === 'dept' && props.model.dept && !props.model.dept.edit)
    }

    return createPortal(visible ? (
        <div className="dialog" onClick={closeMask}>
            <div className="dialog-container" >
                <div className="title">选择入住人</div>
                <div className="department-text">
                    <div className = "text-box" onClick={(e)=>checkResident(e,'user')}>
                    <div className="edit"><span>姓名</span><span>{model.occuser&&model.occuser.nodeName}</span></div>
                    </div>
                    <div div className = "text-box" onClick = {(e) => checkResident(e,'dept')} >
                    <div className={model.dept&&model.dept.edit?'edit':''} ><span>预算部门</span><span>{model.dept&&model.dept.nodeName}</span></div>
                    </div>
                </div>
            </div>
        </div>
    ):null,node)

}