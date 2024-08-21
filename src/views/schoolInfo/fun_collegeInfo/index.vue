<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学院编号" prop="collegeId">
        <el-input
          v-model="queryParams.collegeId"
          placeholder="请输入学院编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学院名称" prop="collegeName">
        <el-input
          v-model="queryParams.collegeName"
          placeholder="请输入学院名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="年级编号" prop="gradeId">
        <el-input
          v-model="queryParams.gradeId"
          placeholder="请输入年级编号"
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
          v-hasPermi="['schoolInfo:fun_collegeInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['schoolInfo:fun_collegeInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['schoolInfo:fun_collegeInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['schoolInfo:fun_collegeInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fun_collegeInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学院编号" align="center" prop="collegeId" />
      <el-table-column label="学院名称" align="center" prop="collegeName" />
      <el-table-column label="年级编号" align="center" prop="gradeId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['schoolInfo:fun_collegeInfo:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['schoolInfo:fun_collegeInfo:remove']">删除</el-button>
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

    <!-- 添加或修改学院信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body @close="handleclose">
      <el-form ref="fun_collegeInfoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学院名称" prop="collegeName">
          <el-input v-model="form.collegeName" placeholder="请输入学院名称" />
        </el-form-item>
        <el-form-item label="年级编号" prop="gradeId">
          <el-input v-model="form.gradeId" placeholder="请输入年级编号" />
        </el-form-item>
        <el-divider content-position="center">专业信息信息</el-divider>
        <el-row v-if="add" :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddMajorInfo">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteMajorInfo">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="majorInfoList" :row-class-name="rowMajorInfoIndex" @selection-change="handleMajorInfoSelectionChange" ref="majorInfo">
          <el-table-column v-if="add" type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="专业名称" prop="majorName" width="150">
            <template #default="scope">
              <el-input disabled v-model="scope.row.majorName" placeholder="请输入专业名称" />
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

<script setup name="Fun_collegeInfo">
import { listFun_collegeInfo, getFun_collegeInfo, delFun_collegeInfo, addFun_collegeInfo, updateFun_collegeInfo } from "@/api/schoolInfo/fun_collegeInfo";
import { ref } from "vue";

const { proxy } = getCurrentInstance();

const fun_collegeInfoList = ref([]);
const majorInfoList = ref([]);
const open = ref(false);
const add = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedMajorInfo = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    collegeId: null,
    collegeName: null,
    gradeId: null
  },
  rules: {
    collegeName: [
      { required: true, message: "学院名称不能为空", trigger: "blur" }
    ],
    gradeId: [
      { required: true, message: "年级编号不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询学院信息列表 */
function getList() {
  loading.value = true;
  listFun_collegeInfo(queryParams.value).then(response => {
    fun_collegeInfoList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
  add.value=false;
}

function handleclose(){
  add.value=false;
}
// 表单重置
function reset() {
  form.value = {
    collegeId: null,
    collegeName: null,
    gradeId: null
  };
  majorInfoList.value = [];
  proxy.resetForm("fun_collegeInfoRef");
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
  ids.value = selection.map(item => item.collegeId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加学院信息";
  add.value = true;
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _collegeId = row.collegeId || ids.value
  getFun_collegeInfo(_collegeId).then(response => {
    form.value = response.data;
    majorInfoList.value = response.data.majorInfoList;
    open.value = true;
    title.value = "修改学院信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fun_collegeInfoRef"].validate(valid => {
    if (valid) {
      form.value.majorInfoList = majorInfoList.value;
      if (form.value.collegeId != null) {
        updateFun_collegeInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFun_collegeInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          add.value=false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _collegeIds = row.collegeId || ids.value;
  proxy.$modal.confirm('是否确认删除学院信息编号为"' + _collegeIds + '"的数据项？').then(function() {
    return delFun_collegeInfo(_collegeIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 专业信息序号 */
function rowMajorInfoIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 专业信息添加按钮操作 */
function handleAddMajorInfo() {
  let obj = {};
  obj.majorName = "";
  majorInfoList.value.push(obj);
}

/** 专业信息删除按钮操作 */
function handleDeleteMajorInfo() {
  if (checkedMajorInfo.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的专业信息数据");
  } else {
    const majorInfos = majorInfoList.value;
    const checkedMajorInfos = checkedMajorInfo.value;
    majorInfoList.value = majorInfos.filter(function(item) {
      return checkedMajorInfos.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handleMajorInfoSelectionChange(selection) {
  checkedMajorInfo.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('schoolInfo/fun_collegeInfo/export', {
    ...queryParams.value
  }, `fun_collegeInfo_${new Date().getTime()}.xlsx`)
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
