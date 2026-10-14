<script setup>
import { ref, watch, onMounted } from 'vue'
import { queryAllApi ,addEmpApi,queryEmpByIdApi,updateEmpApi,deleteEmpApi} from '@/api/emp'
import {queryAllApi as queryAllDeptApi} from '@/api/dept'
import { ElMessage,ElMessageBox } from 'element-plus'



const searchEmp = ref({ name: '', gender: '', date: [], begin: '', end: '' })
const empList = ref([])

/* 员工性别列表 */
const genders = ref([{ name: '男', value: '1' },{ name: '女', value: '2' }])
/* 员工职位列表 */
const jobs = ref([{ name: '班主任', value: '1' },{ name: '讲师', value: '2' },{ name: '学工主管', value: '3' },{ name: '教研主管', value: '4' },{ name: '咨询师', value: '5' },{ name: '其他', value: '6' }])
/* 员工部门列表 */
const depts = ref([])


//新增/修改表单
const employee = ref({
  username: '',
  name: '',
  gender: '',
  phone: '',
  job: '',
  salary: '',
  deptId: '',
  entryDate: '',
  image: '',
  exprList: []
})


/* 分页参数 */
const currentPage = ref(1)
const pageSize = ref(10)
const background = ref(true)
const total = ref(0)

/* 新增员工 */
const addEmp = () => {
  dialogVisible.value = true;
  dialogTitle.value = '新增员工';
  //清空表单
  employee.value = {
    username: '',
    name: '',
    gender: '',
    phone: '',
    job: '',
    salary: '',
    deptId: '',
    entryDate: '',
    image: '',
    exprList: []
  }

   //清空表单校验
  if(empFromref.value){
    empFromref.value.resetFields();
  }
}

//点击编辑按钮，查询员工详情
const edit = async(id) => {
  //根据id查询员工
  const result = await queryEmpByIdApi(id);
  if(result.code){//查询成功
    dialogVisible.value = true;
    dialogTitle.value = '修改员工';
    employee.value = result.data;
    //将exprList中的end和begin赋值给exprDate
    let exprList = employee.value.exprList;
    if(exprList && exprList.length > 0){
      exprList.forEach((expr) => {
        expr.exprDate = [expr.begin, expr.end]
      })
    }
  }else{
    ElMessage.error(result.msg);
  }
  
  
}


/* 监听搜索条件变化 */
watch(() => searchEmp.value.date, (newVal, oldVal) => {
  if (newVal.length == 2) {
    searchEmp.value.begin = newVal[0];
    searchEmp.value.end = newVal[1];
  } else {
    searchEmp.value.begin = '';
    searchEmp.value.end = '';
  }
})



//查询员工列表
const search = async() => {
  const result = await queryAllApi(searchEmp.value.name, searchEmp.value.gender, 
                                    searchEmp.value.begin, searchEmp.value.end, currentPage.value, pageSize.value);
  if(result.code){
    empList.value = result.data.rows;
    total.value = result.data.total;
  }
}

//清空员工列表
const clear = () => {
  searchEmp.value = { name: '', gender: '', date: [], begin: '', end: '' }
  search();
}

//组件挂载时查询员工列表
onMounted(() => {
  search();
  queryAllDept();
})

//查询部门列表
const queryAllDept = async() => {
  const result = await queryAllDeptApi();
  if(result.code){
    depts.value = result.data;
  }
}



//添加工作经历
const addExpr = () => {
  employee.value.exprList.push({
    company: '',
    job: '',
    begin: '',
    end: '',
    exprDate: []
  })
}

//删除工作经历
const deleteExpe = (index) => {
  //splice:从index开始删除1个元素
  employee.value.exprList.splice(index, 1);
}

//watch侦听工作经历变化给begin和end赋值
watch(() => employee.value.exprList, (newVal, oldVal) => {
  if (newVal && newVal.length > 0) {
    newVal.forEach((expr) => {
      if (expr.exprDate && expr.exprDate.length === 2) {
        expr.begin = expr.exprDate[0]
        expr.end = expr.exprDate[1]
      }
    })
  }
}, { deep: true })//深度监听，要写在watch中

/* 分页参数变化时触发 */
const handleSizeChange = (val) => {
  search();
}
const handleCurrentChange = (val) => {
  search();
}

// 控制弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('新增员工')

//文件上传
// 图片上传成功后触发
const handleAvatarSuccess = (response) => {
  employee.value.image = response.data;
}
// 文件上传之前触发
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('只支持上传图片')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('只能上传10M以内图片')
    return false
  }
  return true
}

//校验规则
const rules = ref({
  //blur:失去焦点时校验
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' },{ min: 2, max: 20, message: '用户名长度必须在2到20之间', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' },{ min: 2, max: 10, message: '姓名长度必须在2到10之间', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  //正则表达式校验手机号 pattern:表示正则校验
  /* 
    /。。。。。/  表示正则表达式   ^表示以...开头，$表示以...结尾  
    1[3456789]表示以1开头，后面跟着3、4、5、6、7、8、9中的一个数字
    \d{9}表示后面跟着9个数字
  */
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' },{ pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
})

//保存员工
const saveEmp = async() => {
  //表单校验
  if(!empFromref.value) return
  empFromref.value.validate(async(valid)=>{
    if(valid){
      //校验通过，新增员工
      let result;
      if(employee.value.id){//如果有id，就执行修改
        result = await updateEmpApi(employee.value);
      }else{//如果没有id，就执行新增
        result = await addEmpApi(employee.value);
      }
      if(result.code){
        ElMessage.success('保存成功');
        //新增成功后，关闭弹窗
        dialogVisible.value = false;
        //新增成功后，清空表单
        search();
      }else{//新增失败
        ElMessage.error(result.msg);
      }
    }else{
      //校验不通过，提示用户
      ElMessage.error('表单校验不通过');
    }
  })
}

//删除员工
const deleteById = async (id) => {
  //弹出消息提示框
  ElMessageBox.confirm(
    '确认删除该员工吗？',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      //确认删除
      const result = await deleteEmpApi(id);
      if(result.code){
        //提示信息
        ElMessage.success('删除成功');
        //刷新员工列表
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

//记录选中的员工id
const selectedIds = ref([]);
//复选框变化时触发的函数 item:选中的行数据
const handleSelectionChange = (val) => {
  /* val.forEach((item) => { 会导致重复添加
    selectedIds.value.push(item.id);
  }) */
  //map:将数组中的每个元素都执行一次函数，返回一个新的数组
  selectedIds.value = val.map(item => item.id);
}

//批量删除员工
const deleteByIds = async () => {
  //弹出消息提示框
  ElMessageBox.confirm(
    '确认删除选中的所有员工吗？',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      //判断选中的员工是否为空
      if(selectedIds.value.length && selectedIds.value.length !== 0){
        //确认删除
        const result = await deleteEmpApi(selectedIds.value);
        if(result.code){
          //提示信息
          ElMessage.success('删除成功');
          //刷新员工列表
          search();
        }else{
          //提示信息
          ElMessage.error(result.msg);
        }
      }else{
        //提示信息
        ElMessage.error('请选择要删除的员工');
      }
    })
    .catch(() => {
      //取消删除
      ElMessage.info('删除已取消');
    })
}

//对话框绑定了执行表单校验的对象
const empFromref = ref();

</script>


<template>
  <h2>员工管理</h2>
  <!-- 搜索栏 -->
  <div class="container">
    <el-form :inline="true" :model="searchEmp" class="demo-form-inline">
      <el-form-item label="员工姓名">
        <el-input v-model="searchEmp.name" placeholder="请输入员工姓名" clearable />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="searchEmp.gender" placeholder="请选择性别" clearable>
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker v-model="searchEmp.date" type="daterange" range-separator="到" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="info" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 新增和批量删除按钮 -->
  <div class="container">
    <el-button type="primary" @click="addEmp">+新增员工</el-button>
    <el-button type="danger" @click="deleteByIds">-批量删除</el-button>
  </div>

  <!-- 员工列表表格 -->
  <div class="container">
    <el-table :data="empList" style="width: 100%" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="name" label="姓名" min-width="100" align="center" />
      <el-table-column label="性别" min-width="80" align="center" >
        <template #default="scope">
          {{scope.row.gender == 1 ? '男' : '女'}}
        </template> 
      </el-table-column>
      <el-table-column label="头像" min-width="50" align="center">
        <template #default="scope">
          <img :src="scope.row.image" height="50">
        </template>
      </el-table-column>
      <el-table-column prop="deptName" label="所属部门" min-width="100" align="center"/>
      <el-table-column prop="job" label="职位" min-width="100" align="center" >
        <template #default="scope">
          <span v-if="scope.row.job == 1">班主任</span>
          <span v-else-if="scope.row.job == 2">讲师</span>
          <span v-else-if="scope.row.job == 3">学工主管</span>
          <span v-else-if="scope.row.job == 4">教研主管</span>
          <span v-else-if="scope.row.job == 5">咨询师</span>
          <span v-else>其他</span>
        </template> 
      </el-table-column>
      <el-table-column prop="entryDate" label="入职日期" min-width="120" align="center" />
      <el-table-column prop="updateTime" label="最后操作时间" min-width="160" align="center" />
      <el-table-column label="操作" min-width="150" align="center">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row.id)"><el-icon><EditPen /></el-icon>编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteById(scope.row.id)"><el-icon><Delete /></el-icon>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 分页组件 -->
   <div class="container">
     <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 20, 30,50,75,100]"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
   </div>

<!-- 新增/修改员工的对话框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form :model="employee" label-width="80px" :rules="rules" ref="empFromref">
        <!-- 基本信息 -->
        <!-- 第一行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="employee.username" placeholder="请输入员工用户名，2-20个字"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="employee.name" placeholder="请输入员工姓名，2-10个字"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="employee.gender" placeholder="请选择性别" style="width: 100%;">
                <el-option v-for="g in genders" :key="g.value" :label="g.name" :value="g.value" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="employee.phone" placeholder="请输入员工手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职位">
              <el-select v-model="employee.job" placeholder="请选择职位" style="width: 100%;">
                <el-option v-for="j in jobs" :key="j.value" :label="j.name" :value="j.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="薪资">
              <el-input v-model="employee.salary" placeholder="请输入员工薪资"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属部门">
              <el-select v-model="employee.deptId" placeholder="请选择部门" style="width: 100%;">
                <el-option v-for="d in depts" :key="d.id" :label="d.name" :value="d.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期">
              <el-date-picker v-model="employee.entryDate" type="date" style="width: 100%;" placeholder="选择日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                >
                <img v-if="employee.image" :src="employee.image" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        

        <!-- 工作经历 -->
        <!-- 第六行 -->
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="工作经历">
              <el-button type="success" size="small" @click="addExpr">+ 添加工作经历</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- 第七行 ...  工作经历 -->
        <el-row :gutter="3" v-for="(expr, index) in employee.exprList">
          <el-col :span="10">
            <el-form-item size="small" label="时间" label-width="80px">
              <el-date-picker type="daterange" v-model="expr.exprDate" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item size="small" label="公司" label-width="60px">
              <el-input v-model="expr.company" placeholder="请输入公司名称"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item size="small" label="职位" label-width="60px">
              <el-input v-model="expr.job" placeholder="请输入职位"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="2">
            <el-form-item size="small" label-width="0px">
              <el-button type="danger" @click="deleteExpe(index)">删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <!-- 底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEmp">保存</el-button>
        </span>
      </template>
  </el-dialog>

</template>

<style scoped>
.container {
  margin-top: 10px;
}
/* 修改员工对话框样式 */
.avatar {
  height: 40px;
}
.avatar-uploader .avatar {
  width: 78px;
  height: 78px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  border-radius: 10px;
  /* 添加灰色的虚线边框 */
  border: 1px dashed var(--el-border-color);
}
</style>