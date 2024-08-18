<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名" prop="trueName">
        <el-input
          v-model="queryParams.trueName"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学号" prop="userid">
        <el-input
          v-model="queryParams.userid"
          placeholder="请输入学号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限等级" prop="userLevel">
        <el-select v-model="queryParams.userLevel" placeholder="请选择权限等级" clearable>
          <el-option
            v-for="dict in fun_user_level"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="宿舍" prop="dormitory">
        <el-input
          v-model="queryParams.dormitory"
          placeholder="请输入宿舍"
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
          v-hasPermi="['function:fun_user:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['function:fun_user:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['function:fun_user:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['function:fun_user:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fun_userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="标题" align="center">
        <template #default="scope">
         {{ scope.row.openid? '已绑定' : '未绑定' }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" prop="username" />
      <el-table-column label="姓名" align="center" prop="trueName" />
      <el-table-column label="学号" align="center" prop="userid" />
      <el-table-column label="联系电话" align="center" prop="phone" />
      <el-table-column label="头像" align="center" prop="avatarUrl" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.avatarUrl" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="权限等级" align="center" prop="userLevel">
        <template #default="scope">
          <dict-tag :options="fun_user_level" :value="scope.row.userLevel"/>
        </template>
      </el-table-column>
      <el-table-column label="宿舍" align="center" prop="dormitory" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['function:fun_user:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['function:fun_user:remove']">删除</el-button>
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

    <!-- 添加或修改学生信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fun_userRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="openid" prop="openid">
          <el-input v-model="form.openid" placeholder="请输入openid" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="姓名" prop="trueName">
          <el-input v-model="form.trueName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="学号" prop="userid">
          <el-input v-model="form.userid" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <!-- <el-form-item label="头像" prop="avatarUrl">
          <image-upload :limit="1" v-model="form.avatarUrl"/>
        </el-form-item> -->
        <el-form-item label="头像" prop="avatarUrl">
          <image-upload-copy :limit="1" v-model="form.avatarUrl"/>
        </el-form-item>
        <el-form-item label="权限等级" prop="userLevel">
          <el-radio-group v-model="form.userLevel">
            <el-radio
              v-for="dict in fun_user_level"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="宿舍" prop="dormitory">
          <el-input v-model="form.dormitory" placeholder="请输入宿舍" />
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

<script setup name="Fun_user">
import { listFun_user, getFun_user, delFun_user, addFun_user, updateFun_user } from "@/api/function/fun_user";

const { proxy } = getCurrentInstance();
const { fun_user_level } = proxy.useDict('fun_user_level');

const fun_userList = ref([]);
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
    trueName: null,
    userid: null,
    userLevel: null,
    dormitory: null,
  },
  rules: {
    username: [
      { required: true, message: "用户名不能为空", trigger: "blur" }
    ],
    password: [
      { required: true, message: "密码不能为空", trigger: "blur" }
    ],
    trueName: [
      { required: true, message: "姓名不能为空", trigger: "blur" }
    ],
    userid: [
      { required: true, message: "学号不能为空", trigger: "blur" }
    ],
    userLevel: [
      { required: true, message: "权限等级不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询学生信息列表 */
function getList() {
  loading.value = true;
  listFun_user(queryParams.value).then(response => {
    fun_userList.value = response.rows;
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
    openid: null,
    username: null,
    password: null,
    trueName: null,
    userid: null,
    phone: null,
    avatarUrl: null,
    userLevel: null,
    dormitory: null,
    classId: null
  };
  proxy.resetForm("fun_userRef");
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
  title.value = "添加学生信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getFun_user(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改学生信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fun_userRef"].validate(valid => {
    if (valid) {
      console.log("form：",form.value)
      if (form.value.id != null) {
        updateFun_user(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFun_user(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除学生信息编号为"' + _ids + '"的数据项？').then(function() {
    return delFun_user(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('function/fun_user/export', {
    ...queryParams.value
  }, `fun_user_${new Date().getTime()}.xlsx`)
}

getList();
</script>
