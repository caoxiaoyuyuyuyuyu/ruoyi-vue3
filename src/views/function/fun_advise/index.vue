<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学号" prop="stuId">
        <el-input
          v-model="queryParams.stuId"
          placeholder="请输入学号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="描述" prop="describes">
        <el-input
          v-model="queryParams.describes"
          placeholder="请输入描述"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="category">
        <el-select v-model="queryParams.category" placeholder="请选择类型" clearable>
          <el-option
            v-for="dict in fun_advise_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="联系方式" prop="contactobject">
        <el-input
          v-model="queryParams.contactobject"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发送时间" style="width: 308px">
        <el-date-picker
          v-model="daterangePushtime"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in fun_advise_status"
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
          v-hasPermi="['function:fun_advise:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['function:fun_advise:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['function:fun_advise:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['function:fun_advise:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fun_adviseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" width="50" />
      <el-table-column label="学号" align="center" prop="stuId" width="150" />
      <el-table-column label="描述" align="center" prop="describes" width="150" />
      <el-table-column label="类型" align="center" prop="category" width="150">
        <template #default="scope">
          <dict-tag :options="fun_advise_type" :value="scope.row.category"/>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" align="center" prop="contactobject" />
      <el-table-column label="发送时间" align="center" prop="pushtime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.pushtime, '{y}-{m}-{d} {h}-{s}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="文件" align="center" prop="path" /> -->
      <el-table-column label="文件" align="center" prop="path">
        <template #default="scope">
          <span><file-list v-model="scope.row.path"/></span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" width="150">
        <template #default="scope">
          <dict-tag :options="fun_advise_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['function:fun_advise:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['function:fun_advise:remove']">删除</el-button>
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

    <!-- 添加或修改投诉与建议对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fun_adviseRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学号" prop="stuId">
          <span>{{form.stuId}}</span>
        </el-form-item>
        <el-form-item label="描述" prop="describes">
          <span>{{ form.describes }}</span>
        </el-form-item>
        <el-form-item label="类型" prop="category">
          <el-radio-group v-model="form.category">
            <el-radio
              v-for="dict in fun_advise_type"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系方式" prop="contactobject">
          <span>{{ form.contactobject}}</span>
        </el-form-item>
        <el-form-item label="发送时间" prop="pushtime">
          <span>{{ form.pushtime }}</span>
        </el-form-item>
        <el-form-item label="文件" prop="path">
          <!-- <file-upload v-model="form.path"/> -->
          <file-list v-model="form.path"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in fun_advise_status"
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

<script setup name="Fun_advise">
import { listFun_advise, getFun_advise, delFun_advise, addFun_advise, updateFun_advise } from "@/api/function/fun_advise";

const { proxy } = getCurrentInstance();
const { fun_advise_type, fun_advise_status } = proxy.useDict('fun_advise_type', 'fun_advise_status');

const fun_adviseList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const daterangePushtime = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    stuId: null,
    describes: null,
    category: null,
    contactobject: null,
    pushtime: null,
    status: null
  },
  rules: {
    describes: [
      { required: true, message: "描述不能为空", trigger: "blur" }
    ],
    category: [
      { required: true, message: "类型不能为空", trigger: "change" }
    ],
    contactobject: [
      { required: true, message: "联系方式不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询投诉与建议列表 */
function getList() {
  loading.value = true;
  queryParams.value.params = {};
  if (null != daterangePushtime && '' != daterangePushtime) {
    queryParams.value.params["beginPushtime"] = daterangePushtime.value[0];
    queryParams.value.params["endPushtime"] = daterangePushtime.value[1];
  }
  listFun_advise(queryParams.value).then(response => {
    fun_adviseList.value = response.rows;
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
    stuId: null,
    describes: null,
    category: null,
    contactobject: null,
    pushtime: null,
    path: null,
    status: null
  };
  proxy.resetForm("fun_adviseRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  daterangePushtime.value = [];
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
  title.value = "添加投诉与建议";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getFun_advise(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改投诉与建议";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fun_adviseRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateFun_advise(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFun_advise(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除投诉与建议编号为"' + _ids + '"的数据项？').then(function() {
    return delFun_advise(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('function/fun_advise/export', {
    ...queryParams.value
  }, `fun_advise_${new Date().getTime()}.xlsx`)
}

getList();
</script>
