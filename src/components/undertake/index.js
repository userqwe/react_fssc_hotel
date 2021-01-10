import { forwardRef,useState,useMemo,useImperativeHandle, useContext } from "react"
import {Button,Modal, Toast} from 'antd-mobile'
import SelectTree from '../selectTree/index'
import {myContext} from '../../views/app/app'

import './index.less'




function Undertake (props,ref){
    const [state] = useContext(myContext)

    const [visible,setVisible]=useState(false)
    const [model, setModel] = useState({})
    const [treeModel, setTreeModel] = useState({})

    useImperativeHandle(ref,()=>({
        open:open
    }))
    useMemo(() => {
        setVisible(props.underTakeModel.showTree)
        setModel(props.underTakeModel)
    }, [props])

    const open = ()=>{
        setVisible(true)
        // const {underTakeModel} = props
        // setModel(model,...underTakeModel)
    }


    const close = (e)=>{
        // setVisible(false)
        props.underTakeModel.showTree=false
        !e&&props.underTakeModel.callback(model)
    }

    // 选择下拉
    const openTree =(item, type, itemType) =>{
            setTreeModel({
                selected: item,
                showTree:true,
                params: {
                    url: 'fssc-data/data/ecosystemFormTree',
                    itemText: type,
                    hideClear: false,
                    pmsObj: {
                        userId: state.userInfo.loginUser.userId,
                        deptId: model.dept && model.dept.nodeId,
                        companyId: model.company && model.company.nodeId,
                        billId: model.billId,
                        itemType,
                    },
                },
                treeCallback: ({selected,name}) => { // 下拉回调
                    model[name] = selected
                    setModel({...model})
                    if (name === 'costCenter') props.underTakeModel.setChannelRequired()
                },
                name: type,
            })
    }

    // 提交分摊数据
    const subInfo =()=> {
        if (!model.costCenter.nodeId) {
            // this.$toast(this.$t('lang.Common.tip29'))
            Toast.info('请填写成本中心')
            return
        }
        if (model.channel.retuired && !model.channel.nodeId) {
            // this.$toast(this.$t('lang.Common.tip30'))
            Toast.info('请填写渠道')
            return
        }
        Modal.alert('提示','是否保存为默认分摊',[
            {text:'取消',onPress:()=>{close()}},
            {text:'确定',onPress:()=>{
                props.underTakeModel.saveUnderTake(model)
                close()
            }}
        ])
    }



    return visible? (<div>
            <div className="suggest-add-way" >
                <div className="close" onClick={close}><img src="img/close.png" alt=""/></div>
                <div className="stand-box" >
                            <div className="share-out">
                                <div className="share-standard-item" >
                                    <div className="item" >
                                        <div className="item-left"> 成本中心<i>*</i></div>
                                        <div className="item-right" >
                                            <input type="text" defaultValue={model.costCenter&&model.costCenter.nodeName}  readOnly onClick={()=>openTree(model.costCenter,'costCenter','3')}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="share-standard-item" >
                                    <div className="item" >
                                        <div className="item-left">渠道<i v-if="model.channel.required">*</i></div>
                                        <div className="item-right" >
                                            <input type="text" defaultValue={model.channel&&model.channel.nodeName}  readOnly onClick={()=>openTree(model.channel,'channel','4')}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="share-standard-item" >
                                    <div className="item" >
                                        <div className="item-left">分摊比率</div>
                                        <div className="item-right" >
                                            <span>{model.ratio}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div className="footer-box">
                        <div className="footer-title">
                            已分摊
                            <label className="red" >({model.ratio}%)</label>
                        </div>
                        <Button type="warning" size="large" onClick={subInfo}>确定</Button>
                </div>
                <SelectTree treeModel={treeModel}/>
            </div>
        </div>):null
}

export default forwardRef(Undertake)