<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="专业编号" prop="majorId">
        <el-input
          v-model="queryParams.majorId"
          placeholder="请输入专业编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="专业名称" prop="majorName">
        <el-input
          v-model="queryParams.majorName"
          placeholder="请输入专业名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学院编号" prop="collegeId">
        <el-input
          v-model="queryParams.collegeId"
          placeholder="请输入学院编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['schoolInfo:fun_majorInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['schoolInfo:fun_majorInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['schoolInfo:fun_majorInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['schoolInfo:fun_majorInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fun_majorInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="专业编号" align="center" prop="majorId" />
      <el-table-column label="专业名称" align="center" prop="majorName" />
      <el-table-column label="学院编号" align="center" prop="collegeId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['schoolInfo:fun_majorInfo:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['schoolInfo:fun_majorInfo:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改专业信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fun_majorInfoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="专业名称" prop="majorName">
          <el-input v-model="form.majorName" placeholder="请输入专业名称" />
        </el-form-item>
        <el-form-item label="学院编号" prop="collegeId">
          <el-input v-model="form.collegeId" placeholder="请输入学院编号" />
        </el-form-item>
        <el-divider content-position="center">班级信息信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddClassInfo">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteClassInfo">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="classInfoList" :row-class-name="rowClassInfoIndex" @selection-change="handleClassInfoSelectionChange" ref="classInfo">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="班级名称" prop="className" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.className" placeholder="请输入班级名称" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Fun_majorInfo">
import { listFun_majorInfo, getFun_majorInfo, delFun_majorInfo, addFun_majorInfo, updateFun_majorInfo } from "@/api/schoolInfo/fun_majorInfo";

const { proxy } = getCurrentInstance();

const fun_majorInfoList = ref([]);
const classInfoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedClassInfo = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    majorId: null,
    majorName: null,
    collegeId: null
  },
  rules: {
    majorName: [
      { required: true, message: "专业名称不能为空", trigger: "blur" }
    ],
    collegeId: [
      { required: true, message: "学院编号不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询专业信息列表 */
function getList() {
  loading.value = true;
  listFun_majorInfo(queryParams.value).then(response => {
    fun_majorInfoList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    majorId: null,
    majorName: null,
    collegeId: null
  };
  classInfoList.value = [];
  proxy.resetForm("fun_majorInfoRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.majorId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加专业信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _majorId = row.majorId || ids.value
  getFun_majorInfo(_majorId).then(response => {
    form.value = response.data;
    classInfoList.value = response.data.classInfoList;
    open.value = true;
    title.value = "修改专业信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fun_majorInfoRef"].validate(valid => {
    if (valid) {
      form.value.classInfoList = classInfoList.value;
      if (form.value.majorId != null) {
        updateFun_majorInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFun_majorInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _majorIds = row.majorId || ids.value;
  proxy.$modal.confirm('是否确认删除专业信息编号为"' + _majorIds + '"的数据项？').then(function() {
    return delFun_majorInfo(_majorIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 班级信息序号 */
function rowClassInfoIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 班级信息添加按钮操作 */
function handleAddClassInfo() {
  let obj = {};
  obj.className = "";
  classInfoList.value.push(obj);
}

/** 班级信息删除按钮操作 */
function handleDeleteClassInfo() {
  if (checkedClassInfo.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的班级信息数据");
  } else {
    const classInfos = classInfoList.value;
    const checkedClassInfos = checkedClassInfo.value;
    classInfoList.value = classInfos.filter(function(item) {
      return checkedClassInfos.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handleClassInfoSelectionChange(selection) {
  checkedClassInfo.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('schoolInfo/fun_majorInfo/export', {
    ...queryParams.value
  }, `fun_majorInfo_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style scoped>
::v-deep .el-table__body {
  width: 100% !important;
}
::v-deep .el-table__header {
  width: 100% !important;
}
</style>
