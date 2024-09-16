<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="请假条id" prop="postId">
        <el-input
          v-model="queryParams.postId"
          placeholder="请输入请假条id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学号" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入学号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="教师工号" prop="mentorId">
        <el-input
          v-model="queryParams.mentorId"
          placeholder="请输入教师工号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程名称" prop="courseName">
        <el-input
          v-model="queryParams.courseName"
          placeholder="请输入课程名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="courseSTime">
        <el-date-picker clearable
          v-model="queryParams.courseSTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="courseETime">
        <el-date-picker clearable
          v-model="queryParams.courseETime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择结束时间">
        </el-date-picker>
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
          v-hasPermi="['function:leave_mentor:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['function:leave_mentor:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['function:leave_mentor:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['function:leave_mentor:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="leave_mentorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" width="50" />
      <el-table-column label="学号" align="center" prop="userId" />
      <el-table-column label="请假条id" align="center" prop="postId" width="80" >
        <template #default="scope">
            <router-link :to="'/function/leave_post/postDetail/index/'+scope.row.postId" class="link-type">
              <span>{{ scope.row.postId }}</span>
            </router-link>
        </template>
      </el-table-column>
      <el-table-column label="教师工号" align="center" prop="mentorId" />
      <el-table-column label="课程名称" align="center" prop="courseName" width="180" />
      <el-table-column label="开始时间" align="center" prop="courseSTime" width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.courseSTime, '{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="courseETime" width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.courseETime, '{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center" prop="createdAt" width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt, '{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" prop="updatedAt" width="120">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updatedAt, '{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="fun_leave_post_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['function:leave_mentor:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['function:leave_mentor:remove']">删除</el-button>
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

    <!-- 添加或修改leave_mentor对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="leave_mentorRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="请假条id" prop="postId">
          <el-input v-model="form.postId" placeholder="请输入请假条id" />
        </el-form-item>
        <el-form-item label="学号" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="教师工号" prop="mentorId">
          <el-input v-model="form.mentorId" placeholder="请输入教师工号" />
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="开始时间" prop="courseSTime">
          <el-date-picker clearable
            v-model="form.courseSTime"
            type="datetime"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="courseETime">
          <el-date-picker clearable
            v-model="form.courseETime"
            type="datetime"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
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

<script setup name="Leave_mentor">
import { listLeave_mentor, getLeave_mentor, delLeave_mentor, addLeave_mentor, updateLeave_mentor } from "@/api/function/leave_mentor";

const { proxy } = getCurrentInstance();
const { fun_leave_post_status } = proxy.useDict('fun_leave_post_status');

const leave_mentorList = ref([]);
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
    postId: null,
    userId: null,
    mentorId: null,
    courseName: null,
    courseSTime: null,
    courseETime: null,
    status: null
  },
  rules: {
    postId: [
      { required: true, message: "请假条id不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "学号不能为空", trigger: "blur" }
    ],
    mentorId: [
      { required: true, message: "教师工号不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询leave_mentor列表 */
function getList() {
  loading.value = true;
  listLeave_mentor(queryParams.value).then(response => {
    leave_mentorList.value = response.rows;
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
    postId: null,
    userId: null,
    mentorId: null,
    courseName: null,
    courseSTime: null,
    courseETime: null,
    createdAt: null,
    updatedAt: null,
    status: null
  };
  proxy.resetForm("leave_mentorRef");
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
  title.value = "添加leave_mentor";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getLeave_mentor(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改leave_mentor";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["leave_mentorRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateLeave_mentor(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addLeave_mentor(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除leave_mentor编号为"' + _ids + '"的数据项？').then(function() {
    return delLeave_mentor(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('function/leave_mentor/export', {
    ...queryParams.value
  }, `leave_mentor_${new Date().getTime()}.xlsx`)
}

getList();
</script>
