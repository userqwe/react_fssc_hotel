/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect,useState,useMemo} from 'react'
import {useHistory,useParams} from 'react-router-dom'
import { NavBar, Icon,Tabs, Toast, Button } from 'antd-mobile'
// import Draggable from 'react-draggable'
import dayjs from 'dayjs'
import {formatDate,formatMoney}from '../../common/filter'

import './index.less'

import SelectTree from '../../components/selectTree/index'
import UnderTake from '../../components/undertake/index'
import UserDept from '../../components/user-dept/index'
import Resdirent from '../../components/resident/index'
import CityList from '../../components/cityList/index'
import AgreeProtal from '../../components/agreeProtal/index'
import DragBtn from '../../components/drag/drag'
import DayPicker from '../../components/dayPicker/dayPicker'

import service from '../../require'
export default function Index (){
    const hisrory = useHistory()
    const {billNumber} =useParams()
    const [defaultData, setDefaultData] = useState({}) //初始化数据对象
    const [formData,setFormData] = useState({costCenter:{},channel:{},country:{},city:{},occuser:{},dept:{}})  //表单数据
    const [compRequireList, setCompRequireList] =useState([]) //公司代码必填数组
    const [costRequireList, setCostRequireList] = useState([]) //成本中心必填
    const [selectTab, setSelectTab] = useState('')
    const [againOrder, setAgainOrder] = useState(false)

    const [treeModel,setTreeModel] =useState({})  //下拉树model
    const [underTakeModel, setUnderTakeModel] = useState({}) //分摊model
    const [userDeptModel, setUserDeptModel] = useState({}) //选择姓名部门model
    const [residentModel, setResidentModel] = useState({}) //选择入住人model
    const [cityListModel, setCityListModel] = useState({}) //选择城市model
    const [agreePropalModel, setAgreePropalModel] = useState({}) //选择城市model
    const [datePickModel, setDatePickModel] = useState({}) //日期组件model
    const [budget, setBudget] = useState({}) //预算指标对象

    let allowFillForm =false //是否允许填单
    let activatedNum = 0 //进入index页面次数

    // 显示是否分摊
    const underTakeContent = useMemo(() => {
      let title = '已分摊'
      if (!formData.costCenter.nodeId) title = '未分摊'
      if (formData.channel.required && !formData.channel.nodeId) title = '未分摊'
      return title
    }, [formData])
    
    

    useEffect(() => {
        init()
    }, [])

    // 页面初始化
    const init = ()=>{
      // setAgainOrder(billNumber)
      loadDefault()
    }

    //返回
    const goBack = () => {
        console.log('点击返回了')
    }

    const valueChange = (e,type)=>{
      if(type=='agree') formData.agree = !formData.agree
      else formData[type] = e.target.value
      setFormData({...formData})
    }

    //显示协议弹窗
    const showProtalModal = (flag)=>{
      setAgreePropalModel({
        visible:flag,
        callback:(backVal)=>{
          setFormData({...formData,agree:backVal})
        }
      })
    }

    // 打开下拉树
    const openTree=(item, type)=>{
        if(type=='city'){
          setCityListModel({
            visible:true,
            callback:({city: nodeId, cityName: nodeName})=>{
              formData.city = {...formData.city, nodeId, nodeName}
              setFormData({...formData})
              loadUserBudget()
              // this.historyCity = item
            }
          })
        }else{
          setTreeModel({
              selected: {nodeId: item.nodeId, nodeName: item.nodeName},
              params: getParams(type),
              name: type,
              showTree: true,
              treeCallback: (model) => { // 下拉回调
                const {nodeId, nodeName, nodeCode} = model.selected
                formData[model.name] = {...formData[model.name], nodeId, nodeName, nodeCode}
                setFormData({...formData})
                  switch (model.name){
                    case 'company':setChannelRequired(); apportion(); break
                    case 'dept':checkOrgIsOpenHotelService(); loadUserBudget(); apportion(); break
                    case 'city':
                    case 'country':loadUserBudget(); break
                    case 'project':if (nodeId == '') formData[model.name].nodeId = loadDefault.project.nodeId; loadUserBudget(); break
                    default: break
                  }
              }
          })
        }
    }

    // 获取下拉树参数
    const getParams=(type)=>{
      let params = {pmsObj: {}}
      let pmsData = ( itemType, hideClear = false) => {
        return {
          url: 'fssc-data/data/ecosystemFormTree',
            itemText: type,
            // itemText: this.$t('lang.Common.' + type),
            hideClear,
            pmsObj: {
              userId: formData.occuser.nodeId,
              deptId: formData.dept.nodeId || defaultData.depts.nodeId,
              companyId: formData.company.nodeId || '',
              billId: defaultData.billId,
              itemType,
            }
        }
      }
      switch (type) {
        case 'project':
          params = {
            url: 'fssc-data/data/getMappingTree',
            itemText: '项目',
            firstNotSearch: true,
            // hideClear: true,
            cacheData: localStorage.getItem(type) ? JSON.parse(localStorage.getItem(type)) : [],
            pmsObj: {
              sourceRootCode: 'GSDM',
              sourceId: formData.company.nodeId,
              mappingRootCode: 'XM1',
              nodeId: '',
            }
          }
          break
        case 'country':
          params = {
            url: 'fssc-flight/hotel/loadCountry',
            // itemText: this.$t('lang.Common.country'),
            itemText: '国家',
            newGateWay: true,
            specialRes: true,
            pmsObj: {}
          }
          break
        case 'company':
          params = pmsData('0')
          break
        case 'costCenter':
          params = pmsData('3')
          break
        case 'channel':
          params = pmsData( '4')
          break
        case 'dept':
          params = pmsData( '2')
          break
      
        default:
          break
      }
      return params
    }

    //打开分摊
    const openUnTake = ()=>{
      if (!formData.company.nodeId) {
        Toast.info('请选择公司代码')
        return
      }
      setUnderTakeModel({
        ...formData,
        ratio: formData.ratio || 100,
        billId:defaultData.billId,
        showTree:true,
        setChannelRequired,
        saveUnderTake,
        callback: ({channel,costCenter}) => {
          setFormData({...formData, channel, costCenter})
        }
      })
    }

    // 保存为默认分摊
    const saveUnderTake = async (pamData)=> {
      let data = {
        billId: loadDefault.billId,
        company: formData.company.nodeId,
        dept: formData.dept.nodeId,
        costCenter: pamData.costCenter.nodeId,
        channel: pamData.channel.nodeId,
        ratio: pamData.ratio,
      }
      const result = await service.post('fssc-flight/hotel/saveDefaultSetting',data)
      if (result.rstCode == 0) {
        Toast.success('默认分摊保存成功')
      }
    }

    // 设置渠道是否必填
    const setChannelRequired=()=> {
      formData.channel.required = false
      if (formData.company&&formData.company.nodeId && compRequireList.length && compRequireList.inclueds(formData.company.nodeId)) formData.channel.required = true
      if (formData.costCenter&&formData.costCenter.nodeId && costRequireList.length && costRequireList.inclueds(formData.costCenter.nodeId)) formData.channel.required = true
    }

    // 选择预算部门
    const chooseDept = ()=>{
      setUserDeptModel({
        dept:formData.dept,
        occuser:formData.occuser,
        showTree:true,
        type:null,
        callback:({dept,occuser,type})=>{
          setFormData({...formData,dept,occuser})
          if (type == 'user') {
            setResidentModel({
              showTree:true,
              callback:(item)=>{
                if(item){
                  formData.occuser = {nodeId: item.userId, nodeName: item.userName, nodeCode: item.userCode}
                  formData.dept = {nodeId: item.deptId, nodeName: item.deptName, nodeCode: item.deptCode, edit: item.edit}
                  setFormData({...formData})
                  apportion() // 获取默认分摊
                  loadUserBudget()
                }
              }
            })
          }else if(type=='dept'){
            if (formData.dept.edit) openTree(formData.dept, 'dept')
          }
        }
      })
    }
    
    // 获取默认数据
   const loadDefault = () => {
        service.post('fssc-flight/hotel/loadDefault').then(res=>{
            if(res.rstCode===0){
              res.data.area.forEach((areaItem) => {
                  areaItem.key =areaItem.nodeId
                  areaItem.title = areaItem.nodeName
              })
              setDefaultData({...res.data})
              const {occuser,depts:dept,company,cause,project,agree,area} =res.data
              if (area && area.length) {
                for (const item of area) {
                  if (item.open) setSelectTab(item);
                  break
                }
              }
              showProtalModal(defaultData.agree)
              getLinkageReq()
              if(billNumber){
                loadBillDetail(occuser,dept,company,cause,agree)
              }else{
                setFormData({...formData,occuser,dept,company,cause,project,agree})
                apportion()
              }
              loadUserBudget()
            }
        })
   }

   // 获取历史订单信息
   const loadBillDetail = async (occuser, dept, company, cause, agree) => {
      const result = await service.post('fssc-flight/hotel/loadBillDetail',{billNumber})
      if (result.rstCode == '0'){
        const { hotelname, hotelAddress, remarks: remark, hotelBeginTime, hotelEndTime, city, project, dayCont } = result.data
        const inTime = dayjs(hotelBeginTime || new Date()).format('YYYYMMDD')
        const nowTime = dayjs(new Date()).format('YYYYMMDD')
        if (inTime <= nowTime){
          let {y, m, d} = setDate(dayCont)
          formData.inTime = dayjs(new Date()).format('YYYYMMDD')
          formData.outTime = y + '-' + m + '-' + d
        } else {
          formData.inTime = dayjs(hotelBeginTime).format('YYYYMMDD')
          formData.outTime = dayjs(hotelEndTime).format('YYYYMMDD')
        }
        setAgainOrder(true)
        setFormData({ ...formData,occuser,dept,company,cause,project,agree, hotelname, hotelAddress, remark, city: {...formData.city, ...city} })
        apportion() // 获取默认分摊
        loadUserBudget()
      }
    }

   // 获取默认分摊值
   const apportion = async()=> {
    //  setFormData({...formData,costCenter:{},channel:{},ratio:''})
     if (!formData.company || !formData.company.nodeId || !formData.dept||!formData.dept.nodeId) return
     const data = {
       dept: formData.dept.nodeId,
       company: formData.company.nodeId,
       billId: defaultData.billId,
     }
     const result = await service.post('fssc-flight/hotel/defaultSetting',data)
     if (result.rstCode == 0) {
       if (result.data) {
         const {costCenter, channel,ratio=100} =result.data
         setFormData({...formData,costCenter,channel,ratio})
         setChannelRequired()
       } else {
         getFieldDefaultVal('costCenter', '3')
         getFieldDefaultVal('channel', '4')
         setFormData({...formData,ratio:100})
       }
     }
   }

   // 获取字段默认值
   const getFieldDefaultVal = async (type, itemType)=> {
     if (!formData.dept.nodeId) return
     const result = service.get('fssc-data/data/ecosystemFormTree',{params:{
        userId: formData.occuser.nodeId,
        deptId: formData.dept.nodeId,
        companyId: formData.company.nodeId || '',
        billId: defaultData.billId,
        itemType,
      }})
     if (result.rstCode == 0) {
       const resData = result.data
       if (resData.length == 1) {
         formData[type].nodeId = resData[0].nodeId
         formData[type].nodeName = resData[0].nodeName
         setFormData({...formData})
         if (type == 'costCnter') setChannelRequired()
       }
     }
   }

   // 获取入住人差旅标准和可用预算
   const loadUserBudget = async ()=> {
      let {occuser, dept, city, cause, project, country} = formData
      if (!occuser.nodeId || !dept.nodeId || (city.required && !city.nodeId) || (country.required && !country.nodeId)) return
      setBudget({ userBudget: 0,  availableBudget: 0 })
      let data = {userid: occuser.nodeId, dept: dept.nodeId, city: city.nodeId, area: selectTab.nodeId, cause: cause.nodeId, project: project.nodeId, country: country.nodeId}
      let result = service.post('fssc-flight/hotel/loadUserBudget', data)
      if (result.rstCode == '0'){
        let resData = result.data
        if (!resData.msg){
          setBudget({ userBudget: resData.userBudget,  availableBudget: resData.availableBudget })
        } else {
          Toast.info(resData.msg)
        }
      }
    }

   // 获取联动必填
   const getLinkageReq = async ()=> {
     const compRList =[],costRList = [] 
     const result = await service.get('fssc-form/newForm/linkageRequired',{params:{billId: defaultData.billId}})
     if (result.rstCode === 0) {
       result.data.forEach(val => {
         val.linkageValues.map(v => {
           if (val.linkage == '1000000000001731') {
             compRList.push(v.value)
           } else if (val.linkage == '1000000000001867') {
             costRList.push(v.value)
           }
         })
       })
       setCompRequireList(...compRequireList,compRList)
       setCostRequireList(...costRequireList, costRList)
       setChannelRequired()
     }
   }

   // 校验当前部门是否开通酒店预订权限
   const checkOrgIsOpenHotelService = async (flag)=> {
      if (!formData.dept.nodeId) return
      allowFillForm = false
      const result = await service.get('fssc-flight/hotel/checkOrgIsOpenHotelService', {params:{dept: this.formData.dept.nodeId}})
      if (result.rstCode == 0){
        if (result.data.success) {
          allowFillForm = true
          if (activatedNum == 1 && flag) showProtalModal(formData.agree)
        } else {
          if (flag){
            setTimeout(() => {
              this.$nativeApi.exit()
            }, 5000)
          }
          setTimeout(() => {
            Toast.info('该部门没有填单权限')
          }, 1000)
        }
      }
   }

   // 校验必填
   const checkEmpty =(bool)=>{
      let flag = false
      let data = JSON.parse(JSON.stringify(formData))
      for (const key in data) {
        const item = data[key]
        const isObj = typeof item == 'object'
        if (isObj && item && item.required == undefined) item.required = true
        if ((isObj && item && !item['nodeId'] && item.required) || (!isObj && againOrder && !item)) {
          let name = key
          if (key == 'channel' || key == 'costCenter') name = 'undertake'
          bool && Toast.info(name)
          // bool && Toast(this.$t('lang.Common.tip52', {name: this.$t('lang.Common.' + name)}))
          flag = true
          break
        }
      }
      // if (!flag && !formData.agree) {
      //   flag = true
      //   bool &&  this.$toast(this.$t('lang.Common.tip56'))
      // }
      if (!flag && !allowFillForm){
        flag = true
        bool && checkOrgIsOpenHotelService()
      } 
      if (!flag && !budget.availableBudget) {
        flag = true
        bool &&  Toast.info('无预算')
      }
      if (!flag && budget.availableBudget && budget.availableBudget < budget.userBudget) {
        flag = true
        bool && Toast.info('无预算')
      }
      if (!flag && budget.availableBudget && !budget.userBudget) {
        flag = true
        bool && Toast.info('无预算')
      }
      // if (!this.budget.availableBudget) flag = true
      return flag
  }

  // 提交订单
  const submit= async ()=> {
    if (checkEmpty(true)) return
    let data = {}
    let formDatas = JSON.parse(JSON.stringify(formData))
    for (const key in formDatas) {
      const item = formDatas[key]
      if (typeof item == 'object') data[key] = item && item.nodeId
      else if (typeof item == 'string' && item){
        data[key] = item
      }
    }
    data.area = selectTab.nodeId
    data.budget = budget.userBudget
    delete data.ratio
    data = JSON.stringify(data)
    const result = service.post('fssc-flight/hotel/submitBill',data)
    if (result.rstCode == '0'){
      if (result.data.success){
          this.saveCityForUser()
          this.$nativeApi.neiOpenUrl(this.parseUrl(result.data.url))
        // this.$nativeApi.viewAppears(this.monitorGoback)
        setTimeout(() => {
          // this.billNumber = result.data.billNumber
          hisrory.push({name: 'myOrder'})
        }, 500)
      } else {
        Toast.info(result.data.msg)
      }
    }
  }

  // 间隔几天
  const GetDateDiff = (startDate, endDate) =>{ 
      var startTime = new Date(formatDate(startDate)).getTime()    
      var endTime = new Date(formatDate(endDate)).getTime()    
      var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24)    
      return  dates   
  }

  // 获取星期
  const getDay =(value)=>{
    let day = ''
    if (!value) return ''
    const currentDate = formatDate()
    value = formatDate(value)
    if (currentDate == value) day = '今天'
    else {
      day = `周${new Date(value).getDay()}`
    }
    return day
  }

  const setDate =(dayCont = 1)=>{
      const dd = new Date()
      dd.setDate(dd.getDate() + (+dayCont || 1))// 获取dayCont天后的日期  
      var y = dd.getFullYear()   
      var m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1)// 获取当前月份的日期，不足10补0  
      var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()// 获取当前几号，不足10补0 
      return {y, m, d}
  }

  //选择日期
  const chooseDate = (e)=>{
    const {inTime,outTime} =formData
    setDatePickModel({
      visible:true,
      inTime,
      outTime,
      GetDateDiff,
      getDay,
      callback:(time)=>{
        formData.inTime = time.one[0]
        formData.outTime = time.two[0]
        setFormData({...formData})
      },
    })
  }
   
  return(
      <div id='indexApp'>
          <div className={`main-content ${againOrder?'hide-protocol':''}`}>
              <div className="top-bg" style={{'backgroundImage':"url('/img/top_bg2.png')"}}>
                  <NavBar mode="light" icon={<Icon type="left" />} onLeftClick={goBack}>酒店预订</NavBar>
                  <div className="top-header">
                      <div className="name">用户名：<span>{formData.occuser&&formData.occuser.nodeName}</span> </div>
                      <div className="struct">
                          <span className="dept fs" onClick={chooseDept}><span>预算部门：{formData.dept&&formData.dept.nodeName}</span> </span>
                          <span className="dept " onClick={()=>openTree(formData.company,'company')} ><span>{formData.company&&formData.company.nodeName}</span> </span>
                      </div>
                  </div>
              </div>
              <div className="nav">
                  <Tabs tabs={defaultData.area} initialPage ={selectTab.nodeId} onChange={val=>setSelectTab(val)}></Tabs>
              </div>
              {
                againOrder&&(
                    <div className="checkin-info">
                    <div className="time">
                      <div className="time-start" >
                        <div className="title">入住</div>
                        <div onClick={chooseDate}>{formatDate(formData.inTime)} <span>{getDay(formData.inTime)}</span> </div>
                        </div>
                        {(formData.inTime&&formData.outTime)&&(<div className="interval-day"><span>{GetDateDiff(formData.inTime,formData.outTime)}晚</span></div>)}
                      <div className="time-end">
                        <div className="title">离店</div>
                        <div onClick={chooseDate}>{formatDate(formData.outTime)}<span>{getDay(formData.outTime)}</span></div>
                        </div>
                    </div>
                  </div>
                )
              }
              <div className="form-info">
                  {
                    formData.city.required?(
                      <div className="item"  >
                          <div className="item-left" >城市<i>*</i>
                          </div>
                          <div className='item-right'>
                              <input type="text" defaultValue={formData.city&&formData.city.nodeName} readOnly  onClick={()=>openTree(formData.city,'city')} />
                          </div>
                      </div>
                    ):(
                      <div className="item" >
                          <div className="item-left" >国家<i>*</i>
                          </div>
                          <div className='item-right'>
                              <input type="text" defaultValue={formData.country&&formData.country.nodeName} readOnly onClick={()=>openTree(formData.country,'country')} />
                          </div>
                      </div>
                    )
                  }
                  <div className="item">
                      <div className="item-left" >事由<i>*</i>
                      </div>
                      <div className='item-right un-edit'>
                          <input type="text" defaultValue={formData.cause&&formData.cause.nodeName} readOnly/>
                      </div>
                  </div>
                  <div className="item"  >
                      <div className="item-left" >承担部门<i>*</i>
                      </div>
                      <div className='item-right'>
                        <span onClick={openUnTake}>{underTakeContent}</span>
                      </div>
                  </div> 
                  <div className="item"  >
                      <div className="item-left" >项目
                      </div>
                      <div className='item-right'>
                          <input type="text" defaultValue={formData.project&&formData.project.nodeName}  readOnly onClick={()=>openTree(formData.project,'project')} />
                      </div>
                  </div>
                  <div className="item"  >
                      <div className="item-left" >备注
                      </div>
                      <div className='item-right'>
                          <input type="text" value={formData.remark} onChange={e=>valueChange(e,'remark')}/>
                      </div>
                  </div>
              </div>
              {
                (formData.city.nodeName||formData.country.nodeName)&&(
                  <div className="warm-tips">
                    <div className="tip-content">
                      <img src="/img/smallnotice.png" alt=""/>
                        <span place="name">入住人{formData.occuser.nodeName}</span>
                        <span >目的地：{formData.city.nodeName}；</span>
                        <span className="price-num" >您的酒店差旅标准为：{formatMoney(budget.userBudget)}间/夜；</span>
                        <span className="price-num">可用预算：{formatMoney(budget.availableBudget)}！</span>
                    </div>
                  </div>
                )
              }
          </div>
          <div className="footer">
            {
              !againOrder&&(
              <div className="agree-box">
                <input type="checkbox" className={`checkbox ${formData.agree?'checkeds':''}`}   onClick={(e)=>valueChange(e,'agree')}/>
                <span>同意</span>
                <span className="protocol" onClick={()=>showProtalModal(true)}>财务共享熙攘酒店用户协议</span>
              </div>
              )
            }
            <Button type={checkEmpty(false)?"default":"danger"} onClick={submit}>提交</Button>
          </div>
          {/* 历史订单按钮 */}
          {/* <div className="hist-btn">
            <Draggable><img onClick={()=>hisrory.push('/myOrder')} src='img/history-btn.png'  alt="" /></Draggable>
          </div> */}
            <DragBtn goNext={()=>hisrory.push('/myOrder')}></DragBtn>
          {/* //下拉树组件 */}
          <SelectTree treeModel={treeModel} />
          {/* 分摊组件 */}
          <UnderTake underTakeModel={underTakeModel} />
          {/* 选择部门姓名组件 */}
          <UserDept model={userDeptModel}/>
          {/* 选择入住人组件 */}
          <Resdirent model={residentModel}/>
          {/* 选择城市组件 */}
          <CityList model={cityListModel}/>
          {/* 协议弹窗组件 */}
          <AgreeProtal model={agreePropalModel}/>
          {/* 日期选择组件 */}
          <DayPicker model={datePickModel}/>
      </div>
  )
}