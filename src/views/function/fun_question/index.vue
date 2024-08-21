<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="问题类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择问题类型" clearable>
          <el-option
            v-for="dict in fun_question_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属问卷id" prop="questionnaireId">
        <el-input
          v-model="queryParams.questionnaireId"
          placeholder="请输入所属问卷id"
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
          v-hasPermi="['function:fun_question:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['function:fun_question:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['function:fun_question:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['function:fun_question:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fun_questionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="问题类型" align="center" prop="type">
        <template #default="scope">
          <dict-tag :options="fun_question_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="问题名称" align="center" prop="name" />
      <el-table-column label="问题描述" align="center" prop="description" />
      <el-table-column label="详细" align="center" prop="content" />
      <el-table-column label="所属问卷id" align="center" prop="questionnaireId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['function:fun_question:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['function:fun_question:remove']">删除</el-button>
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

    <!-- 添加或修改问卷中的问题对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fun_questionRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="问题类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio
              v-for="dict in fun_question_type"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="问题名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入问题名称" />
        </el-form-item>
        <el-form-item label="问题描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入问题描述" />
        </el-form-item>
        <el-form-item label="详细" prop="content">
          <el-input style="margin-top: 5px;" v-for="(item,index) in form.content" :key="index" v-model="form.content[index]" placeholder="请输入详细" />
        </el-form-item>
        <el-form-item label="所属问卷id" prop="questionnaireId">
          <el-input v-model="form.questionnaireId" placeholder="请输入所属问卷id" />
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

<script setup name="Fun_question">
import { listFun_question, getFun_question, delFun_question, addFun_question, updateFun_question } from "@/api/function/fun_question";

const { proxy } = getCurrentInstance();
const { fun_question_type } = proxy.useDict('fun_question_type');

const fun_questionList = ref([]);
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
    type: null,
    questionnaireId: null
  },
  rules: {
    type: [
      { required: true, message: "问题类型不能为空", trigger: "change" }
    ],
    name: [
      { required: true, message: "问题名称不能为空", trigger: "blur" }
    ],
    questionnaireId: [
      { required: true, message: "所属问卷id不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询问卷中的问题列表 */
function getList() {
  loading.value = true;
  listFun_question(queryParams.value).then(response => {
    fun_questionList.value = response.rows;
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
    type: null,
    name: null,
    description: null,
    content: [],
    questionnaireId: null
  };
  proxy.resetForm("fun_questionRef");
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
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加问卷中的问题";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getFun_question(_id).then(response => {
    form.value = response.data;
    form.value.content = response.data.content===""||response.data.content===null?[]:JSON.parse(response.data.content);
    // console.log(form.value.content)
    open.value = true;
    title.value = "修改问卷中的问题";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fun_questionRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateFun_question(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFun_question(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除问卷中的问题编号为"' + _ids + '"的数据项？').then(function() {
    return delFun_question(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('function/fun_question/export', {
    ...queryParams.value
  }, `fun_question_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style scoped>
::v-deep .el-form-item__label {
    font-weight: 700;
    width: 100px!important;
}
</style>