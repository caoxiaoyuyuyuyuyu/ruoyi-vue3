<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="匿名选项" prop="anonymous">
        <el-select v-model="queryParams.anonymous" placeholder="请选择匿名选项" clearable>
          <el-option
            v-for="dict in fun_anonymous"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable>
          <el-option
            v-for="dict in fun_questionnare_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="问卷描述" prop="description">
        <el-input
          v-model="queryParams.description"
          placeholder="请输入问卷描述"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" style="width: 308px">
        <el-date-picker
          v-model="daterangeStartTime"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" style="width: 308px">
        <el-date-picker
          v-model="daterangeEndTime"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          v-hasPermi="['function:fun_questionnaire:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['function:fun_questionnaire:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['function:fun_questionnaire:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['function:fun_questionnaire:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fun_questionnaireList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="匿名选项" align="center" prop="anonymous">
        <template #default="scope">
          <dict-tag :options="fun_anonymous" :value="scope.row.anonymous"/>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="type">
        <template #default="scope">
          <dict-tag :options="fun_questionnare_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" prop="name" :show-overflow-tooltip="true" >
        <template #default="scope">
            <router-link :to="'/function/fun_questionnaire/fun_question_statistics/chart/index/'+scope.row.id" class="link-type">
              <span>{{ scope.row.name }}</span>
            </router-link>
        </template>
      </el-table-column>
      <el-table-column label="问卷描述" align="center" prop="description" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['function:fun_questionnaire:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['function:fun_questionnaire:remove']">删除</el-button>
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

    <!-- 添加或修改问卷对话框 -->
    <el-dialog :title="title" v-model="open" width="760px" append-to-body>
      <el-form ref="fun_questionnaireRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="匿名选项" prop="anonymous">
          <el-radio-group v-model="form.anonymous">
            <el-radio
              v-for="dict in fun_anonymous"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio
              v-for="dict in fun_questionnare_type"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="问卷描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入问卷描述" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker clearable
            v-model="form.startTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker clearable
            v-model="form.endTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-divider content-position="center">问卷中的问题信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddFunQuestion">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteFunQuestion">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="funQuestionList" :row-class-name="rowFunQuestionIndex" @selection-change="handleFunQuestionSelectionChange" ref="funQuestion">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="问题类型，多选单选等" prop="type" width="150">
            <template #default="scope">
              <el-select v-model="scope.row.type" placeholder="请选择问题类型，多选单选等">
                <el-option
                  v-for="dict in fun_question_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="问题名称" prop="name" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.name" placeholder="请输入问题名称" />
            </template>
          </el-table-column>
          <el-table-column label="问题描述" prop="description" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.description" placeholder="请输入问题描述" />
            </template>
          </el-table-column>
          <el-table-column label="详细" prop="content" width="150">
            <template #default="scope">
              <el-input disabled v-model="scope.row.content" placeholder="请输入详细" />
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

<script setup name="Fun_questionnaire">
import { listFun_questionnaire, getFun_questionnaire, delFun_questionnaire, addFun_questionnaire, updateFun_questionnaire } from "@/api/function/fun_questionnaire";

const { proxy } = getCurrentInstance();
const { fun_questionnare_type, fun_anonymous, fun_question_type } = proxy.useDict('fun_questionnare_type', 'fun_anonymous', 'fun_question_type');

const fun_questionnaireList = ref([]);
const funQuestionList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedFunQuestion = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeStartTime = ref([]);
const daterangeEndTime = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    anonymous: null,
    type: null,
    name: null,
    description: null,
    startTime: null,
    endTime: null
  },
  rules: {
    anonymous: [
      { required: true, message: "匿名选项不能为空", trigger: "change" }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    startTime: [
      { required: true, message: "开始时间不能为空", trigger: "blur" }
    ],
    endTime: [
      { required: true, message: "结束时间不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询问卷列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangeStartTime && '' != daterangeStartTime) {
    queryParams.value.params["beginStartTime"] = daterangeStartTime.value[0];
    queryParams.value.params["endStartTime"] = daterangeStartTime.value[1];
  }
  if (null != daterangeEndTime && '' != daterangeEndTime) {
    queryParams.value.params["beginEndTime"] = daterangeEndTime.value[0];
    queryParams.value.params["endEndTime"] = daterangeEndTime.value[1];
  }
  listFun_questionnaire(queryParams.value).then(response => {
    fun_questionnaireList.value = response.rows;
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
    anonymous: null,
    type: null,
    name: null,
    description: null,
    startTime: null,
    endTime: null
  };
  funQuestionList.value = [];
  proxy.resetForm("fun_questionnaireRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangeStartTime.value = [];
  daterangeEndTime.value = [];
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
  title.value = "添加问卷";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getFun_questionnaire(_id).then(response => {
    form.value = response.data;
    funQuestionList.value = response.data.funQuestionList;
    open.value = true;
    title.value = "修改问卷";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fun_questionnaireRef"].validate(valid => {
    if (valid) {
      form.value.funQuestionList = funQuestionList.value;
      if (form.value.id != null) {
        updateFun_questionnaire(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFun_questionnaire(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除问卷编号为"' + _ids + '"的数据项？').then(function() {
    return delFun_questionnaire(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 问卷中的问题序号 */
function rowFunQuestionIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 问卷中的问题添加按钮操作 */
function handleAddFunQuestion() {
  let obj = {};
  obj.type = "";
  obj.name = "";
  obj.description = "";
  obj.content = "";
  funQuestionList.value.push(obj);
}

/** 问卷中的问题删除按钮操作 */
function handleDeleteFunQuestion() {
  if (checkedFunQuestion.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的问卷中的问题数据");
  } else {
    const funQuestions = funQuestionList.value;
    const checkedFunQuestions = checkedFunQuestion.value;
    funQuestionList.value = funQuestions.filter(function(item) {
      return checkedFunQuestions.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handleFunQuestionSelectionChange(selection) {
  checkedFunQuestion.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('function/fun_questionnaire/export', {
    ...queryParams.value
  }, `fun_questionnaire_${new Date().getTime()}.xlsx`)
}

getList();
</script>
