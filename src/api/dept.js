import request from '@/utils/request'

//查询全部部门
export const queryAllApi = () => {
    return request.get('/depts')
}

//新增部门
export const addDeptApi = (dept) => {
    return request.post('/depts', dept)
}

//根据部门id查询部门
export const queryByIdApi = (id) => {
    return request.get(`/depts/${id}`)
}

//修改部门
export const updateDeptApi = (dept) => {
    return request.put('/depts', dept)
}

//删除部门
export const deleteByIdApi = (id) => {
    return request.delete(`/depts?id=${id}`)
}
