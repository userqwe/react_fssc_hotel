/* eslint-disable react-hooks/exhaustive-deps */
import {useState,useMemo, useEffect} from 'react'
import {createPortal}  from 'react-dom'
import {PickerView} from 'antd-mobile'
import './dayPicker.less'
import {formatDate} from '../../common/filter'

export default function DayPicker (props){
    const [visible,setVisible] = useState(false)
    const [dataOne,setDataOne] = useState([])
    const [dataTwo,setDataTwo] = useState([])
    const [model,setModel] = useState({one:[],two:[]})
    const node = useMemo(() => document.createElement('div'),[])
    useMemo(() => setVisible(props.model.visible), [props.model])
    let DataThree =[{lable:'--',value:'--'}]
    let first = true
    useEffect(()=>{
        if(visible&&first) {
            setDataOne(setPickerList(0, 120))
            setDataTwo(setPickerList(1, 30))
            setModel({
                one: [formatDate(props.model.inTime)],
                two: [formatDate(props.model.outTime)],
                three: ['--'],
            })
            first = false
        }
    },[props.model.visible])
    useEffect(()=>{
        document.body.appendChild(node)
        return ()=>{
           document.body.removeChild(node)
        }
    },[])
    // 获取前后几天
    const GetDateStr=(AddDayCount, time)=> {   
        var dd = time ? new Date(time)  : new Date()
        dd.setDate(dd.getDate() + AddDayCount)// 获取AddDayCount天后的日期  
        var y = dd.getFullYear()   
        var m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1)// 获取当前月份的日期，不足10补0  
        var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()// 获取当前几号，不足10补0 
        // var dayTip = [this.$t('lang.Common.today'), this.$t('lang.Common.tomorrow'), this.$t('lang.Common.nextDay')]
        var dayTip = ['今天', '明天', '后天']
        if (time) dayTip = []
        return {label: `${m}${'月'}${d}${'日'}  ${dayTip[AddDayCount] || ''}`, value: y + '-' + m  + '-' +  d, parent: '0'}   
    }
    const confirm=()=>{
        cancel('')
    }
    const cancel=(e)=>{
        props.model.visible = false
        setVisible(false)
        !e&&props.model.callback(model)
    }
    const changeOne=([value])=>{
        model.one=[value]
        setModel({...model})
        setDataTwo(setPickerList(1, 30, model.one[0]))
        model.two = [GetDateStr(1,model.one[0]).value]
        setModel({...model})
    }
    const changeTwo=([value])=>{
        model.two = [value]
        setModel({
            ...model
        })
    }
    // 设置可选择日期数据
    const setPickerList=(start = 0, end, value)=>{
        const list = []
        for (let i = start; i < end - start; i++){
            list.push(GetDateStr(i, value))
        }
        return list
    }
    return createPortal(visible?(
        <div className="time-picker">
            <div className="mask"></div>
            <div className="time-content">
                <div className="operate-area">
                    <span className="btn" onClick={cancel}>取消</span>
                    <span>选择时间</span>
                    <span className="btn" onClick={confirm}>确定</span>
                </div>
                <div className="tip-area">
                <div className="time-start" >
                    <div className="title">入住时间</div>
                    <div > {
                            formatDate(model.one[0])
                        } {
                            model.one[0] && ( <span > {props.model.getDay(model.one[0])} </span>)}
                    </div>
                </div>
                {
                    model.one[0] && model.two[0]&&(<div className="interval-day"><span>{props.model.GetDateDiff(model.one[0],model.two[0])}晚</span></div>)
                }
                <div className="time-end">
                    <div className="title">离店时间</div>
                   <div > {
                            formatDate(model.two[0])
                        } {
                            model.two[0] && ( <span > {props.model.getDay(model.two[0])} </span>)}
                    </div>
                    </div>
                </div>
                <div className="pick-box">
                    <div className="pick pick-one">
                        <PickerView data={dataOne} value={model.one} cascade={false} onChange={changeOne}/>
                    </div>
                    <div className="pick pick-two">
                        <PickerView data={DataThree} value={model.three} cascade={false}/>
                    </div>
                    <div className="pick">
                        <PickerView data={dataTwo} value={model.two} onChange={changeTwo} cascade={false}/>
                    </div>
                </div>
            </div>
        </div>
    ):null, node)

}