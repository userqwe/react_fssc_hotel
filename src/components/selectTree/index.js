import {useEffect,useState,useMemo, forwardRef} from 'react'
import { SearchBar,Toast} from 'antd-mobile';

import TreeList from './tree'

import service from '../../require'
import './index.less'


function SelectTree (props,ref){
    const [searchInfo,setSearchInfo] = useState('')
    const [treeData,setTreeData] = useState([])
    const [visible,setVisible] =useState(false)
    const data = useMemo(() => treeData, [treeData])
    useMemo(() => setVisible(props.treeModel.showTree), [props])
    // const clone = (value)=>{ return JSON.parse(JSON.stringify(value))}

    useEffect(()=>{
        if(visible) formTree({searchInfo:''})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[visible])

    // const open =()=>{
    //   setVisible(true)
    // }

    // useImperativeHandle(ref, () => ({
    //   open: open
    // }));
 
    // 选中
    const selectItem=(e,item)=>{
      props.treeModel.selected.nodeId = item.nodeId
      props.treeModel.selected.nodeName = item.nodeName
      if (props.treeModel.params.firstNotSearch){
        let flag = true
        props.treeModel.params.cacheData.forEach(ele => {
         if (ele.nodeId === item.nodeId)  flag = false
        })
        if (flag) props.treeModel.params.cacheData.push(item)
        localStorage.setItem(props.treeModel.name, JSON.stringify(props.treeModel.params.cacheData))
      }
      props.treeModel.showTree=false
      props.treeModel.treeCallback(props.treeModel)
      // setVisible(false)
    }

    // 展开子集
    const expandItem =(e,item)=>{
      // formTree({nodeId: item.nodeId}, item)
      formTree({nodeId: ''}, item)
    }

    //加载数据
    const changeCallback = (searchInfo) => {
        setSearchInfo(searchInfo)
        formTree({searchInfo})
    }

    // 下拉树数据    
    const formTree = async (pData, item)=> {
      if(Object.keys(props.treeModel).length===0||!visible)return
      if (item && !item.isLeaf) {
        if (item.children && item.children.length > 0 ) {
          item.open = !item.open
          setTreeData([...treeData])
          return
        }        
      }
     
      let data = {}
      data = props.treeModel.params.pmsObj
      data.searchText = pData.searchInfo
      data.nodeId = pData.nodeId
      // if (!data.nodeId) delete data.nodeId
      Toast.loading('loading')
      const result = await service.get(props.treeModel.params.url,{params:data})
      Toast.hide()
      if (result.rstCode === 0){
        if (item) {
          item.open =true
          if (props.treeModel.params.specialRes) item.children = result.data.list
          else item.children = result.data
          setTreeData([...treeData])
        } else {
          let data = result.data || []
          if (props.treeModel.params.specialRes) data = result.data.list || []
          setTreeData(data)
        } 
      }
    }

    // 清空选中数据
    const emptyBtn =()=>{
        props.treeModel.selected.nodeId = ''
        props.treeModel.selected.nodeName = ''
        props.treeModel.treeCallback(props.treeModel)
        props.treeModel.showTree = false
    }

    // 关闭下拉弹窗
    const closeBtn = ()=>{
      props.treeModel.treeCallback(props.treeModel)
      props.treeModel.showTree = false
    }

    return visible ? ( < div div className = "box" >
            <div className="dialog">
                < div className = {`big ${props.treeModel.params.lessHight?'less-Height':''}`} >
                    <div className="header-top">
                        <span className="closeBtn" onClick={closeBtn}><img src="/img/close.png" alt="" /></span>
                        {props.treeModel.params.hideClear?'':(<span className="closeText" onClick={emptyBtn}>清空</span>) }
                        <span>选择{props.treeModel.params.itemText}</span>
                    </div>
                    {
                        !props.treeModel.params.hideSearch&&(<SearchBar placeholder="搜索" value={searchInfo} onChange={val=>changeCallback(val)} onClear={()=>setSearchInfo('')}/>)
                        // <div className="search-box">
                        // </div>):''
                    }
                    <div className = {`treeList-box${props.treeModel.params.hideSearch?'hide-search':''}${props.treeModel.params.lessHight?'less-height':''}`}>
                        <TreeList  lists={data}  defaultProp={props.treeModel.defaultProp} selectItem={selectItem} expandItem={expandItem}/>
                    <div/>
                </div>
                </div>
            </div>
          </div>):null
}

export default forwardRef(SelectTree)