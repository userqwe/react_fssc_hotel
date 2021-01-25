/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import {useEffect, useMemo,useRef,useState} from 'react'
import {createPortal} from  'react-dom'
import { NavBar, Icon, SearchBar,ListView ,PullToRefresh} from 'antd-mobile'

import service from '../../require'
import './index.less'

export default function Resident (props){
    const ds = new ListView.DataSource({
        rowHasChanged: () => true,
    })

    const [visible,setVisible] = useState(false) //弹窗显隐
    const [searchInfo,setSearchInfo] =useState('') //搜索关键字
    let [personList,setPersonList] = useState([]) //入住人列表
    let [dataSource, setDataSource] = useState(ds) //入住人列表datasource
    const [hasMore, setHasMore] = useState(true) //列表是否还有更多数据
    let [pageNo, setPageNo] = useState(1) //分页当前页数
    const [refreshing, setRefreshing] = useState(false) // 下拉刷新状态
    const pageSize = 10
    const node = useMemo(()=>document.createElement('div'),[])


    const listRef = useRef(null) //下拉列表组件

    useMemo(() => setVisible(props.model.visible), [props])

    useEffect(()=>{
        if(props.model.visible) getList()
    },[props.model.visible])

    useEffect(() => {
        document.body.appendChild(node)
        return () => {
            document.body.removeChild(node)
        }
    }, [])

    const close =(e,item)=>{
        props.model.visible =false
        setVisible(false)
        props.model.callback(item)
    }

    const searchChange = (val)=>{
        setSearchInfo(val)
        getList()
    }

    const clickItem = (e,item)=>{
        e.stopPropagation()
        close(e,item)
    }

    const onRefresh = ()=>{
        setPageNo(1)
        setRefreshing(true)
        setTimeout(() => {
            setRefreshing(false)
        }, 1000);
        getList()
    }

    // 获取代理人列表
    const getList = async () => {
        let data = {
            searchText: searchInfo,
            pageNo: pageNo,
            pageSize
        }
        const result = await service.post('fssc-flight/hotel/getUsers',data)
        if (result.rstCode == '0') {
            let list = result.data.list
            if(!list.length) setHasMore(false)
            if (pageNo == 1) personList=list
            else personList.push(...list)
            setPersonList(personList)
            setDataSource(dataSource.cloneWithRows([...personList]))
        }
    }


    const onEndReached = ()=>{
        if(!hasMore) return
        setPageNo(pageNo++)
        getList()
    }

    //拨打电话
    const callPhone = (e,phoneNum)=>{
        e.stopPropagation()
        console.log(phoneNum)
        window.location.href = `tel:${phoneNum}`
    }

    const RenderRow = (rowData, sectionID, rowID) => {
        return(
            <div className="list-item" key={sectionID+rowID} onClick={(e)=>clickItem(e,rowData)}>
                <div className="name-info">
                    <div className="name"><span>{rowData.userName}</span><span>{rowData.userCode}</span></div>
                    <div className="phone" ><img src="img/tel.png" alt=""/><span onClick={(e)=>callPhone(e,rowData.userPhone)}>{rowData.userPhone}</span></div>
                </div>
                <div className="dept">{rowData.deptAllName}</div>
            </div>
        )
    }



    return createPortal( visible?(
            <div className="resident" v-if="value">
                <NavBar mode="light" icon={<Icon type="left" />} onLeftClick={close}>入住人</NavBar>
                <SearchBar placeholder="搜索" value={searchInfo} onChange={val=>searchChange(val)} onClear={()=>setSearchInfo('')} />
                <div className="main-ul">
                    <div className="list-ul" >
                        {
                            personList.length?(
                                <ListView
                                ref={listRef} 
                                dataSource={dataSource}
                                renderRow={RenderRow}
                                renderHeader={()=><div className="history-person">历史入住人</div>} 
                                // renderBodyComponent={()=>(
                                //         <div className = "scroll-area" ></div>
                                // )}
                                pageSize={pageSize}
                                onEndReached={onEndReached}
                                pullToRefresh={<PullToRefresh refreshing={refreshing} onRefresh={onRefresh}/>}
                                style={{'height':'100%'}}
                                />
                            ):(
                                <div className="no-data">
                                    <img src="img/no_data_icon@2x.png" alt="" />
                                    <p>暂无数据</p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        ):null,node)
}