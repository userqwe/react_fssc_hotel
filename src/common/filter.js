import dayjs from 'dayjs'

//日期格式化
export const formatDate =(value=new Date(),format='YYYY-MM-DD')=>{
    return dayjs(value).format(format)
}

export const formatMoney = (value)=>{
    if (!value) return 0
    else return (+value).toLocaleString()
}