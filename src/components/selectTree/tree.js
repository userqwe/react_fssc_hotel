import React from 'react'

import './tree.less'

// <treeItem v-if="!item.isLeaf"  v-show="lists[index].open" :lists="item.children" @hander-select='selectItem' @hander-expand="expandItem"/>
export default function TreeItem (props){

    return(
         <div className="select-tree">
             {
                props.lists && props.lists.length > 0 ? ( < div className = "div" >
                {
                    props.lists.map((item, index) => { return(
                        <div className="list" key={index}>
                            <div className="list-content" >
                                {!item.isLeaf?(<i className="icon" onClick={ev=>{props.expandItem(ev,item,index)}}></i>):''}
                                <span className={`label ${!item.isLeaf?'less-width':''}`} onClick={ev=>{props.selectItem(ev,item)}} >{item.nodeName}</span>
                            </div>
                            {
                                !item.isLeaf&&item.open?(<TreeItem lists={item.children} selectItem={props.selectItem} expandItem={props.expandItem} />):''
                            }
                        </div>
                    )})
                }
                </div>):(<div>{props.defaultProp}</div > )
             }
        </div>
    )
}