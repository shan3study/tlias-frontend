import request from '@/utils/request'

//查询全部员工
export const queryAllApi = (name, gender, begin, end, page, pageSize) => {
    return request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)
}

//新增员工
export const addEmpApi = (emp) => {
    return request.post('/emps', emp)
}
