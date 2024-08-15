<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="年级编号" prop="gradeId">
        <el-input
          v-model="queryParams.gradeId"
          placeholder="请输入年级编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="年级名称" prop="gradeName">
        <el-input
          v-model="queryParams.gradeName"
          placeholder="请输入年级名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="校区编号" prop="campusId">
        <el-input
          v-model="queryParams.campusId"
          placeholder="请输入校区编号"
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
          v-hasPermi="['schoolInfo:fun_gradeInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['schoolInfo:fun_gradeInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['schoolInfo:fun_gradeInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['schoolInfo:fun_gradeInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fun_gradeInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="年级编号" align="center" prop="gradeId" />
      <el-table-column label="年级名称" align="center" prop="gradeName" />
      <el-table-column label="校区编号" align="center" prop="campusId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['schoolInfo:fun_gradeInfo:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['schoolInfo:fun_gradeInfo:remove']">删除</el-button>
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

    <!-- 添加或修改年级信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fun_gradeInfoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="年级名称" prop="gradeName">
          <el-input v-model="form.gradeName" placeholder="请输入年级名称" />
        </el-form-item>
        <el-form-item label="校区编号" prop="campusId">
          <el-input v-model="form.campusId" placeholder="请输入校区编号" />
        </el-form-item>
        <el-divider content-position="center">学院信息信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddCollegeInfo">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteCollegeInfo">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="collegeInfoList" :row-class-name="rowCollegeInfoIndex" @selection-change="handleCollegeInfoSelectionChange" ref="collegeInfo">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="学院名称" prop="collegeName" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.collegeName" placeholder="请输入学院名称" />
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

<script setup name="Fun_gradeInfo">
import { listFun_gradeInfo, getFun_gradeInfo, delFun_gradeInfo, addFun_gradeInfo, updateFun_gradeInfo } from "@/api/schoolInfo/fun_gradeInfo";

const { proxy } = getCurrentInstance();

const fun_gradeInfoList = ref([]);
const collegeInfoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedCollegeInfo = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    gradeId: null,
    gradeName: null,
    campusId: null
  },
  rules: {
    gradeName: [
      { required: true, message: "年级名称不能为空", trigger: "blur" }
    ],
    campusId: [
      { required: true, message: "校区编号不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询年级信息列表 */
function getList() {
  loading.value = true;
  listFun_gradeInfo(queryParams.value).then(response => {
    fun_gradeInfoList.value = response.rows;
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
    gradeId: null,
    gradeName: null,
    campusId: null
  };
  collegeInfoList.value = [];
  proxy.resetForm("fun_gradeInfoRef");
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
  ids.value = selection.map(item => item.gradeId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加年级信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _gradeId = row.gradeId || ids.value
  getFun_gradeInfo(_gradeId).then(response => {
    form.value = response.data;
    collegeInfoList.value = response.data.collegeInfoList;
    open.value = true;
    title.value = "修改年级信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fun_gradeInfoRef"].validate(valid => {
    if (valid) {
      form.value.collegeInfoList = collegeInfoList.value;
      if (form.value.gradeId != null) {
        updateFun_gradeInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFun_gradeInfo(form.value).then(response => {
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
  const _gradeIds = row.gradeId || ids.value;
  proxy.$modal.confirm('是否确认删除年级信息编号为"' + _gradeIds + '"的数据项？').then(function() {
    return delFun_gradeInfo(_gradeIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 学院信息序号 */
function rowCollegeInfoIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 学院信息添加按钮操作 */
function handleAddCollegeInfo() {
  let obj = {};
  obj.collegeName = "";
  collegeInfoList.value.push(obj);
}

/** 学院信息删除按钮操作 */
function handleDeleteCollegeInfo() {
  if (checkedCollegeInfo.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的学院信息数据");
  } else {
    const collegeInfos = collegeInfoList.value;
    const checkedCollegeInfos = checkedCollegeInfo.value;
    collegeInfoList.value = collegeInfos.filter(function(item) {
      return checkedCollegeInfos.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handleCollegeInfoSelectionChange(selection) {
  checkedCollegeInfo.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('schoolInfo/fun_gradeInfo/export', {
    ...queryParams.value
  }, `fun_gradeInfo_${new Date().getTime()}.xlsx`)
}

getList();
</script>
