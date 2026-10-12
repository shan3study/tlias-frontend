<script setup>
import { ref, onMounted } from 'vue'
import { queryAllApi, addDeptApi, queryByIdApi, updateDeptApi,deleteByIdApi } from '@/api/dept'
import { ElMessage,ElMessageBox  } from 'element-plus'

//查询部门列表
const search = async () => {
  // const result =await axios.get(`https://m1.apifoxmock.com/m1/8891629-8690579-default/depts`);
  // if(result.data.code){//JS隐式类型转换：0为false，其他数字为true，''为false,其他都是true; null,undefined为false
  //   DeptList.value=result.data.data;
  // }

  const result = await queryAllApi();
  if (result.code) {
    DeptList.value = result.data;
  }
}


onMounted(() => {
  search();
})

const DeptList = ref([])

//Dialog对话框
const dialogFormVisible = ref(false);
const dept = ref({ name: '' });
const formTitle = ref('');

//新增部门按钮点击事件处理
const addDept = () => {
  dialogFormVisible.value = true;
  formTitle.value = '新增部门';
  //清空部门名称输入框
  dept.value = { name: '' };
  //清空表单校验
  if(deptFromref.value){
    deptFromref.value.resetFields();
  }
  
}

//新增部门确认按钮点击事件处理
const save = async () => {
  //校验表单
  if (!deptFromref.value) return;
  deptFromref.value.validate(async (valid) => {//valid为true时，校验通过，否则校验不通过
    if (valid) {//校验通过
      let result;
      if(dept.value.id){
        result = await updateDeptApi(dept.value);
      }else{
        result = await addDeptApi(dept.value);
      }
      if (result.code) {//新增成功
        //提示信息
        ElMessage.success(result.msg);
        //关闭对话框
        dialogFormVisible.value = false;
        //刷新部门列表
        search();
      } else {//新增失败
        //提示信息
        ElMessage.error(result.msg);
        //关闭对话框
        dialogFormVisible.value = false;
      }
    }else{//校验不通过
      ElMessage.error('校验不通过，请检查输入');
    }
  })
}
//点击编辑按钮后事件处理，根据部门id查询部门信息，数据回显
const edit = async (id) => {
  const result = await queryByIdApi(id);
  
  formTitle.value = '编辑部门';
  if (result.code) {//查询成功
    //弹出对话框
    dialogFormVisible.value = true;
    dept.value = result.data;
  }
   //清空表单校验
  if(deptFromref.value){
    deptFromref.value.resetFields();
  }
}




//表单校验
const rules = ref({
  name: [
    { required: true, message: '部门名称不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '部门名称长度必须在2-10个字符之间', trigger: 'blur' },
  ]
})

//删除部门
const deleteById = async (id) => {
  //弹出消息提示框
  ElMessageBox.confirm(
    '确认删除该部门吗？',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      //确认删除
      const result = await deleteByIdApi(id);
      if(result.code){
        //提示信息
        ElMessage.success('删除成功');
        //刷新部门列表
        search();
      }else{
        //提示信息
        ElMessage.error(result.msg);
      }
    })
    .catch(() => {
      //取消删除
      ElMessage.info('删除已取消');
    })
}

const deptFromref = ref();

</script>

<template>
  <h2>部门管理</h2>
  <div class="container">
    <el-button type="primary" @click="addDept">+ 新增部门</el-button>
  </div>
  <!-- 部门列表表格 -->
  <div class="container">
    <el-table :data="DeptList" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="100" align="center" />
      <el-table-column prop="name" label="部门名称" width="200" align="center" />
      <el-table-column prop="createTime" label="最后操作时间" width="300" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="edit(scope.row.id)"><el-icon>
              <EditPen />
            </el-icon>编辑</el-button>
          <el-button type="danger" size="small" @click="deleteById(scope.row.id)"><el-icon>
              <Delete />
            </el-icon>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- Dialog对话框 -->
  <!-- v-model="dialogFormVisible" 控制对话框的显示与隐藏 true显示 false隐藏 -->
  <el-dialog v-model="dialogFormVisible" :title="formTitle" width="500">
    <el-form :model="dept" :rules="rules" ref="deptFromref">
      <el-form-item label="部门名称" label-width="80px" prop="name">
        <el-input v-model="dept.name" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </div>
    </template>
  </el-dialog>

</template>

<style scoped>
.container {
  margin: 20px 0;
}
</style>