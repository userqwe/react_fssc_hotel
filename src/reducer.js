export const initData = {
    userInfo:null
}

export const reducer =(state,{type,data})=>{
    switch(type){
        case "saveLoginInfo":
            return {...state, userInfo:data}
        default :
            throw new Error()
    }
}


