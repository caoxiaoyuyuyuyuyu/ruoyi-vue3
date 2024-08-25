<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="问卷id" prop="naireId">
        <el-input
          v-model="queryParams.naireId"
          placeholder="请输入问卷id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="问题id" prop="questionId">
        <el-input
          v-model="queryParams.questionId"
          placeholder="请输入问题id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="问题类型" prop="answerType">
        <el-select v-model="queryParams.answerType" placeholder="请选择问题类型" clearable>
          <el-option
            v-for="dict in fun_question_type"
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
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleCharts"
          v-hasPermi="['function:fun_question_statistics:chart']"
        >图表</el-button>
      </el-col> -->
       <!--
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['function:fun_question_statistics:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['function:fun_question_statistics:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['function:fun_question_statistics:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fun_question_statisticsList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="问卷id" align="center" prop="naireId" />
      <el-table-column label="问题id" align="center" prop="questionId" />
      <el-table-column label="问题类型" align="center" prop="answerType">
        <template #default="scope">
          <dict-tag :options="fun_question_type" :value="scope.row.answerType"/>
        </template>
      </el-table-column>
      <el-table-column label="选项对应数量" align="center" prop="choiceCount" />
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近更新时间" align="center" prop="updatedAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['function:fun_question_statistics:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['function:fun_question_statistics:remove']">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改问卷作答统计对话框 -->
    <!-- <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fun_question_statisticsRef" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog> -->
  </div>
</template>

<script setup name="Fun_question_statistics">
import { listFun_question_statistics } from "@/api/function/fun_question_statistics";

const { proxy } = getCurrentInstance();
const { fun_question_type } = proxy.useDict('fun_question_type');

const fun_question_statisticsList = ref([]);
// const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
// const title = ref("");

const data = reactive({
  // form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    naireId: null,
    questionId: null,
    answerType: null,
  },
  // rules: {
  //   naireId: [
  //     { required: true, message: "问卷id不能为空", trigger: "blur" }
  //   ],
  //   questionId: [
  //     { required: true, message: "问题id不能为空", trigger: "blur" }
  //   ],
  //   answerType: [
  //     { required: true, message: "问题类型不能为空", trigger: "change" }
  //   ],
  // }
});

const { queryParams } = toRefs(data);

/** 查询问卷作答统计列表 */
function getList() {
  loading.value = true;
  listFun_question_statistics(queryParams.value).then(response => {
    fun_question_statisticsList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
// function cancel() {
//   open.value = false;
//   reset();
// }

// 表单重置
// function reset() {
//   form.value = {
//     id: null,
//     naireId: null,
//     questionId: null,
//     answerType: null,
//     choiceCount: null,
//     createdAt: null,
//     updatedAt: null
//   };
//   proxy.resetForm("fun_question_statisticsRef");
// }

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
/** 导出按钮操作 */
function handleExport() {
  proxy.download('function/fun_question_statistics/export', {
    ...queryParams.value
  }, `fun_question_statistics_${new Date().getTime()}.xlsx`)
}

getList();

/** 图表按钮操作 */
// function handleCharts() {
//   console.log("图表按钮操作");
//   this.$router.push({ path: "/function/user", query: {id: "1", name: "若依"} });
// }

/** 新增按钮操作 */
// function handleAdd() {
//   reset();
//   open.value = true;
//   title.value = "添加问卷作答统计";
// }

/** 修改按钮操作 */
// function handleUpdate(row) {
//   reset();
//   const _id = row.id || ids.value
//   getFun_question_statistics(_id).then(response => {
//     form.value = response.data;
//     open.value = true;
//     title.value = "修改问卷作答统计";
//   });
// }

/** 提交按钮 */
// function submitForm() {
//   proxy.$refs["fun_question_statisticsRef"].validate(valid => {
//     if (valid) {
//       if (form.value.id != null) {
//         updateFun_question_statistics(form.value).then(response => {
//           proxy.$modal.msgSuccess("修改成功");
//           open.value = false;
//           getList();
//         });
//       } else {
//         addFun_question_statistics(form.value).then(response => {
//           proxy.$modal.msgSuccess("新增成功");
//           open.value = false;
//           getList();
//         });
//       }
//     }
//   });
// }

/** 删除按钮操作 */
// function handleDelete(row) {
//   const _ids = row.id || ids.value;
//   proxy.$modal.confirm('是否确认删除问卷作答统计编号为"' + _ids + '"的数据项？').then(function() {
//     return delFun_question_statistics(_ids);
//   }).then(() => {
//     getList();
//     proxy.$modal.msgSuccess("删除成功");
//   }).catch(() => {});
// }

</script>
