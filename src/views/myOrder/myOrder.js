/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import {useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom'

import {NavBar,Icon,ListView,PullToRefresh,Button, Toast, Modal} from 'antd-mobile'
import dayjs from 'dayjs'

import service from '../../require'

import './myOrder.less'


export default function MyOrder (){
    const history = useHistory()
    const ds = new ListView.DataSource({
        rowHasChanged: () => true,
    })
    const [dataSource,setDataSource] = useState(ds)
    let [orderList,setOrderList] = useState([]) //订单列表
    const [refreshing, setRefreshing] = useState(false) // 下拉刷新状态
    let pageNo = 1 //列表页
    const pageSize = 10 //页容量
    let hasMore = true //列表是否还有更多数据
    let countdownTimer = null  //定时器timer

    useEffect(() => {
        initData()
        return () => {
            countdownTimer && clearInterval(countdownTimer)
        }
    }, [])

    const initData = ()=>{
        pageNo = 1
        getList()
    }

    // 加载更多
    const onEndReached = ()=>{
        if(!hasMore) return
        pageNo++
        getList()
    }
    //下拉刷新
    const onRefresh = () => {
        pageNo = 1
        hasMore = true
        setRefreshing(true)
        setTimeout(() => {
            setRefreshing(false)
        }, 1000);
        getList()
    }


    const yearMonthFormat = (value)=>{
        if (value) return dayjs(new Date(value)).format('YYYY-MM-DD')
        else return'-'
    }

    // 跳转到详情页
    const orderDetail =(e,item)=>{
      // if (!this.allowJump) return
      history.push('/orderDetail/'+item.billnumber)
    }
    
    const Countdown =(item)=>{
    //   this.$set(item, 'countdownTimer', {})
        item.countdownTimer = {}
      // if (item.failureTime){
      //   item.failureTime = new Date((item.failureTime.replace('-', '/'))).getTime()
      // } 
      let end = '' // 设置截止时间
      if (item.status == '1') {
        end = item.failureTime
      } 
      if (item.status == '6' && item.unsubscribe == '1') {
        end = item.unsubscribTime
      } 
      end = new Date(end.replace(/-/g, '/')).getTime()
      const countTime = () => {
          const date = new Date()
          const now = date.getTime()  
          const leftTime = end - now // 时间差                              
          let  h, m, s, ms
          if (leftTime >= 0) {
              // d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
              h = Math.floor(leftTime / 1000 / 60 / 60)
              m = Math.floor(leftTime / 1000 / 60 % 60)
              s = Math.floor(leftTime / 1000 % 60)
              ms = Math.floor(leftTime % 1000)
              if (ms < 100) {
                  ms = '0' + ms
              }
              if (s < 10) {
                  s = '0' + s
              }
              if (m < 10) {
                  m = '0' + m
              }
              if (h < 10) {
                  h = '0' + h
              }
            item.countdownTimer = {h: h, m: m, s: s}
          } else {
              item.countdownTimer = {}
          }
          // 递归每秒调用countTime方法，显示动态时间效果
      }
      countTime()
    }
    const settimer=()=>{
      if (countdownTimer)clearInterval(countdownTimer)
      const getFun = () => {
        orderList.forEach(item => {
          Countdown(item)
        })
      }
      countdownTimer = setInterval(getFun, 1000)
      getFun()
    }
    // 收回/终止审批
    const rejectTask=(item, type,e)=> {
      e.stopPropagation()
      const typeName = type == 'takeback' ? 'singleBack' : type == 'rejectOrder' ? 'unsubscribe' : 'takeStop'
      const rejectFun = async (again = false) => {
        const result = service.post(`fssc-flight/hotel/${type || 'rejectOrder'}`,{billNumber:item.billnumber})
          if (result.rstCode == 0){
              if (result.data.success) {
                if (type == 'rejectOrder') {
                //   this.$nativeApi.neiOpenUrl(result.data.url)
                //   this.$nativeApi.viewAppears(this.initMyOrder)
                } else initData(); Toast.fail(typeName)
              } else {
                Toast.fail(result.data.msg)
              }
          }
      }
      if (type){
        Modal.alert('提示','确定要取消吗',[
            {text:'取消',opPress:()=>{}},
            {text:'确定',opPress:()=>{
                rejectFun()
            }},
        ])
      } else {
        if(e) history.replace('index/'+item.billnumber)
        else rejectFun(true)
      }
    }
    const canUnubscribe =(item)=>{
      const status = ['2', '3', '6']
      return item.unsubscribe == '1' && status.includes(item.status)
    }

    // 加载更多
    const getList =async()=> {
      const result = await service.post('fssc-flight/hotel/loadOrder',{pageNo, pageSize})
      if (result.rstCode == 0){
          const list = result.data.list
          if (pageNo == 1) orderList = list || []
          else orderList.push(...list)
          if (list && list.length == 0) hasMore = false
          setOrderList(orderList)
          setDataSource(dataSource.cloneWithRows([...orderList]))
          settimer()
      }
    }

    const RenderRow = (item, sectionID,rowId)=>{
        return (
            <div className="box" key={sectionID+rowId} onClick={(e)=>orderDetail(e,item)}>
                  <div className="wrap">
                    <div>
                      <p className="order-number fl">{item.billnumber}</p>
                      {item.status&&(<p className={`process fr status-${item.status}`}>{item.status}</p>)}
                    </div>
                    <p className="hotel-name clear">{item.hotelname}</p>
                  </div>
                  <div className="detail">
                    <div className="left">
                      <p className="hotel-address">{item.hotelAddress}</p>
                      <p className="hotel-address">
                        {yearMonthFormat(item.hotelBeginTime)}出发时间{yearMonthFormat(item.hotelEndTime)}/ {item.dayCont}晚/  {item.standards}
                      </p>
                    </div>
                      <div className="hotel-price"><span></span>{item.money}</div>
                  </div>
                  <div className="clear person-message">
                      <p className="fl">
                        <img src='img/person.png' alt="" className="icon-person"/>
                        <span style={{'verticalAlign': 'middle'}}>{item.username}（{item.userPhone}）</span>
                      </p>
                      <p className="fr">{item.userDept}</p>
                  </div>
                  <div style ={{'clear':'both','marginTop':'10px'}} >
                      {
                          (item.countdownTimer && Object.keys(item.countdownTimer).length !== 0)&&(
                            <p className="fl">
                                {
                                    ((item.status == '1' || item.status == '6') && item.countdownTimer)&&(
                                        <span className="count-time">
                                            <span className="count">{item.countdownTimer.h}</span>时
                                            {/* {{$t('lang.hotelConfig.hour')}} */}
                                            <span className="count">{item.countdownTimer.m}</span>分
                                            {/* {{$t('lang.hotelConfig.minutes')}} */}
                                            <span className="count">{item.countdownTimer.s}</span>秒
                                            {/* {{$t('lang.hotelConfig.seconds')}} */}
                                            {item.status=='1'?'预订失败':'不可取消'}
                                        </span>
                                    )
                                }
                            </p>
                          )
                      }
                      {
                          item.unsubscribe == '2'&&(<p className="fl"><span className="count-time">倒计时</span></p>)
                      }
                    <div className="fr">
                      <p className="again">
                        {<Button className="operat-btn again-btn border-1px" size='small' inline onClick={e=>rejectTask(item,'',e)}>再订一单</Button>}
                        {canUnubscribe(item)&&(<Button className="operat-btn refund-btn border-1px" size='small' inline  onClick= {e=>rejectTask(item,'rejectOrder')}>取消订单</Button>)}
                        {(item.status ==='0'||item.status ==='2')&&(<Button className="operat-btn  refund-btn border-1px" size='small' inline onClick= {e=>rejectTask(item,'takeStop')}>收回</Button>)}
                      </p>
                    </div>
                  </div>
                </div>
        )
    }


    return (
        <div className="myorder">
            <NavBar icon={<Icon type='left'/>} onLeftClick={()=>history.goBack()}>订单列表</NavBar>
            <div className="main-content">
                <ul className="list-ul list-ul-box">
                {
                    orderList.length?(
                        <ListView style={{'height':'100%'}}
                        dataSource={dataSource}
                        renderRow={RenderRow}
                        pageSize={pageSize}
                        onEndReached={onEndReached}
                        pullToRefresh={<PullToRefresh refreshing={refreshing} onRefresh={onRefresh}/>}
                        />
                    ):(
                        <div className="no-data">
                            <img src='img/no_data_icon@2x.png' alt=''/>
                            <p>暂无数据</p>
                        </div> 
                    )
                }
                </ul>
            </div>
        </div>
    )
}