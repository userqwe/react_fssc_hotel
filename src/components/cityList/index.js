/* eslint-disable react-hooks/exhaustive-deps */
import{useMemo,useState,useEffect}from 'react'
import {NavBar,Icon, SearchBar} from 'antd-mobile'
import service from '../../require'

import './index.less'


export default function CityList (props){

    const [model,setModel] = useState({}) //弹窗模型
    const [searchInfo,setSearchInfo] = useState('') //搜索内容
    const [cityInfo,setCityInfo]= useState({}) //城市列表信息obj
    // const [stateObj, setStateObj] = useState({}) //城市列表展开合折叠
    useMemo(() => setModel({...model,visible:props.model.visible}), [props])



    useEffect(()=>{
        if(model.visible) loadCity()
    },[model.visible])

    const closeModel = (e,item)=>{
        props.model.visible =false
        setModel({...model,visible:false})
        item&&props.model.callback(item)
    }
    const searchChange = (val) => {
        setSearchInfo(val)
        loadCity()
    }

    const chooseCity = (e,item)=>{
        closeModel(e,item)
    }
    const showItem = (e,item,index)=>{
        item.show = !item.show
        setCityInfo({...cityInfo})
    }
    

    // 获取城市列表
    const loadCity = async ()=> {
        const result = await service.post('fssc-flight/hotel/loadCtripCity',{searchText:searchInfo})
        if (result.rstCode === 0) {
            const {commonList, list, hotCity, history} = result.data
            setCityInfo({commonList,list,hotCity,history})
        }
    }

    return model.visible?(
        <div className="city-modal">
            <NavBar icon={<Icon type="left" />} onLeftClick={closeModel}>目的地</NavBar>
            <SearchBar value={searchInfo} defaultValue="搜索"  onChange={val=>searchChange(val)}/>
            <div className="main-content">
                {
                    !searchInfo?(
                        <>
                            <div className="historyCity" v-if="cityInfo.history&&cityInfo.history.length">
                                <div className="title">历史城市</div>
                                <div className="ul">
                                    {cityInfo.history&&cityInfo.history.map((item,index)=>{return index<3&&(
                                        <span key={index}  onClick={e=>chooseCity(e,item)}>{item.cityName}</span>
                                    )})}
                                </div>
                            </div>
                            <div className="historyCity" v-if="cityInfo.hotCity&&cityInfo.hotCity.length">
                                <div className="title">热门城市</div>
                                <div className="ul">
                                {cityInfo.hotCity&&cityInfo.hotCity.map((item,index)=>{return index<6&&(
                                    <span key={index}  onClick={e=>chooseCity(e,item)}>{item.cityName}</span>
                                )})}
                                </div>
                            </div>
                            <div className="filter-city-list" >
                                {cityInfo.commonList&&cityInfo.commonList.map((item,index)=>(
                                    <div className="city-item" key={index}>
                                        <div className={`title ${item.show?'open':''}`}  onClick={e=>showItem(e,item,index)}>{item.firstLetter}</div>
                                        {item.show&&(
                                            <div className="city-list">
                                                {
                                                    item.commonList.map((itm,idx)=>(
                                                        <div className="list-item" key={idx} onClick={e=>chooseCity(e,itm)}>{itm.cityName}</div>
                                                    ))
                                                }
                                            </div>
                                        )}
                                    </div>
                                ))}
                                
                            </div>
                        </>
                    ):(
                        <div className="filter-city-list">
                            {
                                cityInfo.list && cityInfo.list.map((item, index) => (
                                    <div className="city-item" key={index}>
                                        <div className="city-list">
                                            <div className="list-item" onClick={e=>chooseCity(e,item)}>{item.cityName}</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </div>
    ):null
}