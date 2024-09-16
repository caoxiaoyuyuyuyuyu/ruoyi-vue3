<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学号" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入学号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学生姓名" prop="trueName">
        <el-input
          v-model="queryParams.trueName"
          placeholder="请输入学生姓名"
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
      <el-form-item label="审核人" prop="reviewerId">
        <el-input
          v-model="queryParams.reviewerId"
          placeholder="请输入审核人工号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择审核状态" clearable>
          <el-option
            v-for="dict in fun_leave_post_status"
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
          v-hasPermi="['function:leave_post:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['function:leave_post:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['function:leave_post:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['function:leave_post:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="leave_postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="学号" align="center" prop="userId" />
      <el-table-column label="学生姓名" align="center" prop="trueName" />
      <el-table-column label="是否离校" align="center" prop="isOut">
        <template #default="scope">
          <dict-tag :options="fun_leave_type" :value="scope.row.isOut"/>
        </template>
      </el-table-column>
      <el-table-column label="请假原因" align="center" prop="reason" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人工号" align="center" prop="reviewerId" />
      <el-table-column label="审核状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="fun_leave_post_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center" prop="createdAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态更新时间" align="center" prop="updatedAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleReview(scope.row)" v-hasPermi="['function:leave_post:edit']">审核</el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['function:leave_post:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['function:leave_post:remove']">删除</el-button>
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

    <!-- 添加或修改leave_post对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="leave_postRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学号" prop="userId">
          <el-input :disabled="review" v-model="form.userId" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="学生姓名" prop="trueName">
          <el-input :disabled="review" v-model="form.trueName" placeholder="请输入学生姓名" />
        </el-form-item>
        <el-form-item label="是否离校" prop="isOut">
          <el-radio-group :disabled="review" v-model="form.isOut">
            <el-radio
              v-for="dict in fun_leave_type"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="请假原因" prop="reason">
          <el-input :disabled="review" v-model="form.reason" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="附件" prop="file">
          <a :href="form.file" target="_blank">{{ form.file }}</a>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker :disabled="review" clearable
            v-model="form.startTime"
            type="datetime"
            value-format="YYYY-MM-DD hh:mm:ss"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker :disabled="review" clearable
            v-model="form.endTime"
            type="datetime"
            value-format="YYYY-MM-DD hh:mm:ss"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核人" prop="reviewerId">
          <el-input :disabled="review" v-model="form.reviewerId" placeholder="请输入审核人" />
        </el-form-item>
        <el-form-item label="审核状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :disabled="!review" 
              v-for="dict in fun_leave_post_status"
              :key="dict.value"
              :label="dict.value"
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

<script setup name="Leave_post">
import { listLeave_post, getLeave_post, delLeave_post, addLeave_post, updateLeave_post,reviewLeave_post } from "@/api/function/leave_post";

const { proxy } = getCurrentInstance();
const { fun_leave_type, fun_leave_post_status } = proxy.useDict('fun_leave_type', 'fun_leave_post_status');

const leave_postList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangeStartTime = ref([]);
const daterangeEndTime = ref([]);
const daterangeCreatedAt = ref([]);
const daterangeUpdatedAt = ref([]);
const review = ref(false);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: null,
    trueName: null,
    reason: null,
    startTime: null,
    endTime: null,
    reviewerId: null,
    status: null,
  },
  rules: {
    userId: [
      { required: true, message: "学号不能为空", trigger: "blur" }
    ],
    trueName: [
      { required: true, message: "学生姓名不能为空", trigger: "blur" }
    ],
    isOut: [
      { required: true, message: "是否离校不能为空", trigger: "change" }
    ],
    startTime: [
      { required: true, message: "开始时间不能为空", trigger: "blur" }
    ],
    endTime: [
      { required: true, message: "结束时间不能为空", trigger: "blur" }
    ],
    reviewerId: [
      { required: true, message: "审核人不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询leave_post列表 */
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
  if (null != daterangeCreatedAt && '' != daterangeCreatedAt) {
    queryParams.value.params["beginCreatedAt"] = daterangeCreatedAt.value[0];
    queryParams.value.params["endCreatedAt"] = daterangeCreatedAt.value[1];
  }
  if (null != daterangeUpdatedAt && '' != daterangeUpdatedAt) {
    queryParams.value.params["beginUpdatedAt"] = daterangeUpdatedAt.value[0];
    queryParams.value.params["endUpdatedAt"] = daterangeUpdatedAt.value[1];
  }
  listLeave_post(queryParams.value).then(response => {
    leave_postList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  review.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    userId: null,
    trueName: null,
    isOut: null,
    reason: null,
    file: null,
    startTime: null,
    endTime: null,
    reviewerId: null,
    status: null,
    createdAt: null,
    updatedAt: null
  };
  proxy.resetForm("leave_postRef");
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
  daterangeCreatedAt.value = [];
  daterangeUpdatedAt.value = [];
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
  review.value = false;
  open.value = true;
  title.value = "添加请假条";
}
/** 审核按钮操作 */
function handleReview(row) {
  reset();
  const _id = row.id || ids.value
  getLeave_post(_id).then(response => {
    review.value = true;
    form.value = response.data;
    open.value = true;
    title.value = "审核请假条";
  });
}


/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getLeave_post(_id).then(response => {
    review.value = false;
    form.value = response.data;
    open.value = true;
    title.value = "修改请假条";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["leave_postRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        if(review.value){
          reviewLeave_post(form.value).then(response => {
            proxy.$modal.msgSuccess("审核成功");
            open.value = false;
            review.value = false;
            getList();
          });
        }else{
          updateLeave_post(form.value).then(response => {
            proxy.$modal.msgSuccess("修改成功");
            open.value = false;
            getList();
          });
        }
        
      } else {
        addLeave_post(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除leave_post编号为"' + _ids + '"的数据项？').then(function() {
    return delLeave_post(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('function/leave_post/export', {
    ...queryParams.value
  }, `leave_post_${new Date().getTime()}.xlsx`)
}

getList();
</script>
