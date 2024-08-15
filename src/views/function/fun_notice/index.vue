<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="typeName">
        <el-select v-model="queryParams.typeName" placeholder="请选择类型" clearable>
          <el-option
            v-for="dict in fun_notice_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="失效时间" style="width: 308px">
        <el-date-picker
          v-model="daterangePublishTime"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="isActive">
        <el-select v-model="queryParams.isActive" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in fun_notice_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['function:fun_notice:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['function:fun_notice:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['function:fun_notice:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['function:fun_notice:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fun_noticeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="内容" align="center" prop="content" />
      <el-table-column label="类型" align="center" prop="typeName">
        <template #default="scope">
          <dict-tag :options="fun_notice_type" :value="scope.row.typeName"/>
        </template>
      </el-table-column>
      <el-table-column label="失效时间" align="center" prop="publishTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.publishTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="isActive">
        <template #default="scope">
          <dict-tag :options="fun_notice_status" :value="scope.row.isActive"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['function:fun_notice:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['function:fun_notice:remove']">删除</el-button>
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

    <!-- 添加或修改学校通知对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fun_noticeRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="类型" prop="typeName">
          <el-radio-group v-model="form.typeName">
            <el-radio
              v-for="dict in fun_notice_type"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="失效时间" prop="publishTime">
          <el-date-picker clearable
            v-model="form.publishTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择失效时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="isActive">
          <el-radio-group v-model="form.isActive">
            <el-radio
              v-for="dict in fun_notice_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
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

<script setup name="Fun_notice">
import { listFun_notice, getFun_notice, delFun_notice, addFun_notice, updateFun_notice } from "@/api/function/fun_notice";

const { proxy } = getCurrentInstance();
const { fun_notice_type, fun_notice_status } = proxy.useDict('fun_notice_type', 'fun_notice_status');

const fun_noticeList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangePublishTime = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    title: null,
    typeName: null,
    publishTime: null,
    isActive: null
  },
  rules: {
    title: [
      { required: true, message: "标题不能为空", trigger: "blur" }
    ],
    content: [
      { required: true, message: "内容不能为空", trigger: "blur" }
    ],
    typeName: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
    publishTime: [
      { required: true, message: "失效时间不能为空", trigger: "blur" }
    ],
    isActive: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询学校通知列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangePublishTime && '' != daterangePublishTime) {
    queryParams.value.params["beginPublishTime"] = daterangePublishTime.value[0];
    queryParams.value.params["endPublishTime"] = daterangePublishTime.value[1];
  }
  listFun_notice(queryParams.value).then(response => {
    fun_noticeList.value = response.rows;
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
    id: null,
    title: null,
    content: null,
    typeName: null,
    publishTime: null,
    isActive: null
  };
  proxy.resetForm("fun_noticeRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangePublishTime.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加学校通知";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getFun_notice(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改学校通知";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fun_noticeRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateFun_notice(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFun_notice(form.value).then(response => {
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
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除学校通知编号为"' + _ids + '"的数据项？').then(function() {
    return delFun_notice(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('function/fun_notice/export', {
    ...queryParams.value
  }, `fun_notice_${new Date().getTime()}.xlsx`)
}

getList();
</script>
