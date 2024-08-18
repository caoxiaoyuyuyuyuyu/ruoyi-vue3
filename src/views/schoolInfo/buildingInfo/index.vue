<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="楼名" prop="buildingName">
        <el-input
          v-model="queryParams.buildingName"
          placeholder="请输入楼名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="楼层数" prop="floorNum">
        <el-input
          v-model="queryParams.floorNum"
          placeholder="请输入楼层数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单层宿舍数量" prop="dormitoryNum">
        <el-input
          v-model="queryParams.dormitoryNum"
          placeholder="请输入单层宿舍数量"
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
          v-hasPermi="['schoolInfo:buildingInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['schoolInfo:buildingInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['schoolInfo:buildingInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['schoolInfo:buildingInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="buildingInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="宿舍楼编号" align="center" prop="buildingId" />
      <el-table-column label="楼名" align="center" prop="buildingName" />
      <el-table-column label="楼层数" align="center" prop="floorNum" />
      <el-table-column label="单层宿舍数量" align="center" prop="dormitoryNum" />
      <el-table-column label="校区编号" align="center" prop="campusId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['schoolInfo:buildingInfo:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['schoolInfo:buildingInfo:remove']">删除</el-button>
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

    <!-- 添加或修改宿舍信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="buildingInfoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="宿舍楼编号" prop="buildingId">
          <el-input v-model="form.buildingId" placeholder="请输入宿舍楼编号" />
        </el-form-item>
        <el-form-item label="楼名" prop="buildingName">
          <el-input v-model="form.buildingName" placeholder="请输入楼名" />
        </el-form-item>
        <el-form-item label="楼层数" prop="floorNum">
          <el-input v-model="form.floorNum" placeholder="请输入楼层数" />
        </el-form-item>
        <el-form-item label="单层宿舍数量" prop="dormitoryNum">
          <el-input v-model="form.dormitoryNum" placeholder="请输入单层宿舍数量" />
        </el-form-item>
        <el-form-item label="校区编号" prop="campusId">
          <el-input v-model="form.campusId" placeholder="请输入校区编号" />
        </el-form-item>
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

<script setup name="BuildingInfo">
import { listBuildingInfo, getBuildingInfo, delBuildingInfo, addBuildingInfo, updateBuildingInfo } from "@/api/schoolInfo/buildingInfo";

const { proxy } = getCurrentInstance();

const buildingInfoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    buildingName: null,
    floorNum: null,
    dormitoryNum: null,
    campusId: null
  },
  rules: {
    buildingName: [
      { required: true, message: "楼名不能为空", trigger: "blur" }
    ],
    floorNum: [
      { required: true, message: "楼层数不能为空", trigger: "blur" }
    ],
    dormitoryNum: [
      { required: true, message: "单层宿舍数量不能为空", trigger: "blur" }
    ],
    campusId: [
      { required: true, message: "校区编号不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询宿舍信息列表 */
function getList() {
  loading.value = true;
  listBuildingInfo(queryParams.value).then(response => {
    buildingInfoList.value = response.rows;
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
    buildingId: null,
    buildingName: null,
    floorNum: null,
    dormitoryNum: null,
    campusId: null
  };
  proxy.resetForm("buildingInfoRef");
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
  ids.value = selection.map(item => item.buildingId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加宿舍信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _buildingId = row.buildingId || ids.value
  getBuildingInfo(_buildingId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改宿舍信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["buildingInfoRef"].validate(valid => {
    if (valid) {
      if (form.value.buildingId != null) {
        updateBuildingInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBuildingInfo(form.value).then(response => {
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
  const _buildingIds = row.buildingId || ids.value;
  proxy.$modal.confirm('是否确认删除宿舍信息编号为"' + _buildingIds + '"的数据项？').then(function() {
    return delBuildingInfo(_buildingIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('schoolInfo/buildingInfo/export', {
    ...queryParams.value
  }, `buildingInfo_${new Date().getTime()}.xlsx`)
}

getList();
</script>
