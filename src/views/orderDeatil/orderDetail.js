import {useState,useEffect} from 'react'
import {useParams,useHistory} from 'react-router-dom'

import {NavBar,Icon, Button, Toast} from 'antd-mobile'

import service from '../../require'
import {formatDate,formatMoney} from '../../common/filter'

import './orderDetail.less'

export default function OrderDetail (){
    const history = useHistory()
    const {billNumber} = useParams()
    const [orderData, setOrderData] = useState({})
    const [ccFormId, setCcFormId] = useState('') 
    useEffect(() => {
        getOrderInfo()
        console.log(ccFormId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [billNumber])

    
    //拨打电话
    const callPhone=(phone)=>{
        window.location.href = 'tel://' + phone
    }

    //填写remarks
    const valueChange = (e)=>{
        orderData.remarks = e.target.value
        setOrderData({...orderData})
    }
    
    //获取详情信息
    const getOrderInfo = async ()=> {
        const result = await service.post("fssc-flight/hotel/loadBillDetail",{billNumber})
        if (result.rstCode === 0){
            if (result.data) {
                setOrderData(result.data||{})
                setCcFormId(result.data.ccFormId || '')
            }
        }
    }

    // 再次提交
    const submit= async()=> {
        let {billnumber: billNumber, remarks} = orderData
        if (!remarks){
            Toast.info('请填写备注')
            return
        }
        const result = await service.post('fssc-flight/hotel/taskSubmit',{billNumber,remarks})
        if (result.rstCode === 0){
            if (result.data.success) {
                Toast.success('提交成功')
                history.goBack()
            } else {
                Toast.fail(result.data.msg)
            }
        }
    }
    return (
        <div className="detail">
            <NavBar icon={<Icon type='left' />} onLeftClick={()=>history.goBack()}>订单详情</NavBar>
            <div className = {`main-content ${(orderData.status==='0'||orderData.status==='2')?'submit':''}`}>
                <div className="hotel-message">
                    <div className="process">
                        <p className="process-lf">
                            <span className="hotel-name">{orderData.hotelname}</span>
                            {orderData.status&&(<span className={`process-btn status-${orderData.status}`}>{orderData.status}</span>)}
                        </p>
                        <button className="operat-btn border-1px" onClick={()=>history.replace(`/index/${orderData.billnumber}`)}>再定一单</button>
                    </div>
                    <p className="message">
                        <img src="img/address.png" alt=""/>
                        <span className="blue">{orderData.hotelAddress}</span>
                    </p>
                    <p className="message" onClick={e=>callPhone(orderData.hotelPhone)}>
                        <img src="img/tel.png" alt=""/>
                        <span className="blue">{orderData.hotelPhone}</span>
                    </p>
                    <p className="message">
                        <img src="img/home.png" alt="" />
                        <span>{formatDate(orderData.hotelBeginTime)}至{formatDate(orderData.hotelEndTime)} / {orderData.dayCont}晚 / {orderData.standards}</span>
                    </p>
                    <p className="message">
                        <img src="img/person.png" alt=""/>
                        <span>{orderData.userName +"(" +orderData.userPhone +")"}</span> 
                    </p>
                </div>
                {orderData.ccFormId&&(
                    <div className="approval">
                        {/* <approval-check :ccFormId="orderData.ccFormId"></approval-check> */}
                    </div>
                )}
                <div className="approval">
                    <div className="bill-details">
                         {/* 审批区数据 */}
                        <div className="arrpoval-table">
                            <div>
                                <div className="title">费用明细信息</div>
                            </div>
                            <div className="shrink-box">
                                <ul className="cost-message">
                                    <li>
                                        <span className="fl">订单号</span>
                                        <span className="fr">{orderData.billnumber}</span>
                                    </li>
                                    <li>
                                        <span className="fl">预算部门</span>
                                        <span className="fr">{orderData.dept}</span>
                                    </li>
                                    <li>
                                        <span className="fl">成本中心</span>
                                        <span className="fr">{orderData.costCenter}</span>
                                    </li>
                                    <li>
                                        <span className="fl">项目</span>
                                        <span className="fr">{orderData.project&&orderData.project.nodeName}</span>
                                    </li>
                                    <li className={(orderData.status==='0'||orderData.status==='2')?'remark':''}>
                                        <span className="fl">备注</span>
                                        {(orderData.status==='0'||orderData.status==='2')?(<input type="text" className="fr" value={orderData.remarks} onChange={e=>valueChange(e)}/>):(<span className="fr">{orderData.remarks}</span>)}
                                    </li>
                                    <li>
                                        <span className="fl">总金额</span>
                                        <span className="fr">{formatMoney(orderData.totalAmount)}</span>
                                    </li>
                                    <li>
                                        <span className="fl">企业支付金额</span>
                                        <span className="fr">{formatMoney(orderData.enterpriseAmount)}</span>
                                    </li>
                                    <li>
                                        <span className="fl">个人支付金额</span>
                                        <span className="fr">{formatMoney(orderData.personalAmount)}</span>
                                    </li>
                                    <li>
                                        <span className="fl">下单人</span>
                                        <span className="fr">{orderData.createUser}</span>
                                    </li>
                                    <li> 
                                        <span className="fl">下单时间</span>
                                        <span className="fr">{formatDate(orderData.createTime)}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {(orderData.status==='0'||orderData.status==='2')&&(
                <div className="footer">
                    <Button onClick={submit}>提交</Button>
                </div>
            )}
        </div>
    )
}