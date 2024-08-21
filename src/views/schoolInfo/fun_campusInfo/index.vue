<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="校区编号" prop="campusId">
        <el-input
          v-model="queryParams.campusId"
          placeholder="请输入校区编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="校区名称" prop="campusName">
        <el-input
          v-model="queryParams.campusName"
          placeholder="请输入校区名称"
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
          v-hasPermi="['schoolInfo:fun_campusInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['schoolInfo:fun_campusInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['schoolInfo:fun_campusInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['schoolInfo:fun_campusInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fun_campusInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="校区编号" align="center" prop="campusId" />
      <el-table-column label="校区名称" align="center" prop="campusName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['schoolInfo:fun_campusInfo:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['schoolInfo:fun_campusInfo:remove']">删除</el-button>
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

    <!-- 添加或修改学校信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body @close="handleclose" >
      <el-form ref="fun_campusInfoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="校区名称" prop="campusName">
          <el-input v-model="form.campusName" placeholder="请输入校区名称" />
        </el-form-item>
        <el-divider content-position="center">年级信息信息</el-divider>
        <el-row v-if="add" :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddGradeInfo">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteGradeInfo">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="gradeInfoList" :row-class-name="rowGradeInfoIndex" @selection-change="handleGradeInfoSelectionChange" ref="gradeInfo">
          <el-table-column v-if="add" type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="年级名称" prop="gradeName" width="150">
            <template #default="scope">
              <el-input disabled v-model="scope.row.gradeName" placeholder="年级名称" />
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

<script setup name="Fun_campusInfo">
import { listFun_campusInfo, getFun_campusInfo, delFun_campusInfo, addFun_campusInfo, updateFun_campusInfo } from "@/api/schoolInfo/fun_campusInfo";

const { proxy } = getCurrentInstance();

const fun_campusInfoList = ref([]);
const gradeInfoList = ref([]);
const open = ref(false);
const add = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedGradeInfo = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    campusId: null,
    campusName: null
  },
  rules: {
    campusName: [
      { required: true, message: "校区名称不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询学校信息列表 */
function getList() {
  loading.value = true;
  listFun_campusInfo(queryParams.value).then(response => {
    fun_campusInfoList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function handleclose() {
  add.value=false;
}
// 取消按钮
function cancel() {
  open.value = false;
  add.value=false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    campusId: null,
    campusName: null
  };
  gradeInfoList.value = [];
  proxy.resetForm("fun_campusInfoRef");
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
  ids.value = selection.map(item => item.campusId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  add.value = true;
  title.value = "添加学校信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _campusId = row.campusId || ids.value
  getFun_campusInfo(_campusId).then(response => {
    form.value = response.data;
    gradeInfoList.value = response.data.gradeInfoList;
    open.value = true;
    title.value = "修改学校信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fun_campusInfoRef"].validate(valid => {
    if (valid) {
      form.value.gradeInfoList = gradeInfoList.value;
      if (form.value.campusId != null) {
        updateFun_campusInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFun_campusInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          add.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _campusIds = row.campusId || ids.value;
  proxy.$modal.confirm('是否确认删除学校信息编号为"' + _campusIds + '"的数据项？').then(function() {
    return delFun_campusInfo(_campusIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 年级信息序号 */
function rowGradeInfoIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 年级信息添加按钮操作 */
function handleAddGradeInfo() {
  let obj = {};
  obj.gradeName = "";
  gradeInfoList.value.push(obj);
}

/** 年级信息删除按钮操作 */
function handleDeleteGradeInfo() {
  if (checkedGradeInfo.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的年级信息数据");
  } else {
    const gradeInfos = gradeInfoList.value;
    const checkedGradeInfos = checkedGradeInfo.value;
    gradeInfoList.value = gradeInfos.filter(function(item) {
      return checkedGradeInfos.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handleGradeInfoSelectionChange(selection) {
  checkedGradeInfo.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('schoolInfo/fun_campusInfo/export', {
    ...queryParams.value
  }, `fun_campusInfo_${new Date().getTime()}.xlsx`)
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