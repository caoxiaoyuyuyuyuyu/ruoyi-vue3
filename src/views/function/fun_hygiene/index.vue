<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="宿舍" prop="Dormitoryid">
        <el-input
          v-model="queryParams.Dormitoryid"
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
          v-hasPermi="['function:fun_hygiene:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['function:fun_hygiene:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['function:fun_hygiene:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['function:fun_hygiene:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="fun_hygieneList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="宿舍" align="center" prop="Dormitoryid" />
      <el-table-column label="第一周" align="center" prop="FirstRank" />
      <el-table-column label="第二周" align="center" prop="SecondRank" />
      <el-table-column label="第三周" align="center" prop="ThirdRank" />
      <el-table-column label="第四周" align="center" prop="FourthRank" />
      <el-table-column label="第五周" align="center" prop="FifthRank" />
      <el-table-column label="第六周" align="center" prop="SixthRank" />
      <el-table-column label="第七周" align="center" prop="SeventhRank" />
      <el-table-column label="第八周" align="center" prop="EighthRank" />
      <el-table-column label="第九周" align="center" prop="NinthRank" />
      <el-table-column label="第十周" align="center" prop="TenthRank" />
      <el-table-column label="第十一周" align="center" prop="EleventhRank" />
      <el-table-column label="第十二周" align="center" prop="TwelfthRank" />
      <el-table-column label="第十三周" align="center" prop="ThirteenthRank" />
      <el-table-column label="第十四周" align="center" prop="FourteenthRank" />
      <el-table-column label="第十五周" align="center" prop="FifteenthRank" />
      <el-table-column label="第十六周" align="center" prop="SixteenthRank" />
      <el-table-column label="第十七周" align="center" prop="SeventeenthRank" />
      <el-table-column label="第十八周" align="center" prop="EighteenthRank" />
      <el-table-column label="第十九周" align="center" prop="NineteenthRank" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['function:fun_hygiene:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['function:fun_hygiene:remove']">删除</el-button>
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

    <!-- 添加或修改卫检成绩对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fun_hygieneRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="宿舍" prop="Dormitoryid">
          <el-input v-model="form.Dormitoryid" placeholder="请输入宿舍" />
        </el-form-item>
        <el-form-item label="第一周成绩" prop="FirstRank">
          <el-input v-model="form.FirstRank" placeholder="请输入第一周成绩" />
        </el-form-item>
        <el-form-item label="第二周成绩" prop="SecondRank">
          <el-input v-model="form.SecondRank" placeholder="请输入第二周成绩" />
        </el-form-item>
        <el-form-item label="第三周成绩" prop="ThirdRank">
          <el-input v-model="form.ThirdRank" placeholder="请输入第三周成绩" />
        </el-form-item>
        <el-form-item label="第四周成绩" prop="FourthRank">
          <el-input v-model="form.FourthRank" placeholder="请输入第四周成绩" />
        </el-form-item>
        <el-form-item label="第五周成绩" prop="FifthRank">
          <el-input v-model="form.FifthRank" placeholder="请输入第五周成绩" />
        </el-form-item>
        <el-form-item label="第六周成绩" prop="SixthRank">
          <el-input v-model="form.SixthRank" placeholder="请输入第六周成绩" />
        </el-form-item>
        <el-form-item label="第七周成绩" prop="SeventhRank">
          <el-input v-model="form.SeventhRank" placeholder="请输入第七周成绩" />
        </el-form-item>
        <el-form-item label="第八周成绩" prop="EighthRank">
          <el-input v-model="form.EighthRank" placeholder="请输入第八周成绩" />
        </el-form-item>
        <el-form-item label="第九周成绩" prop="NinthRank">
          <el-input v-model="form.NinthRank" placeholder="请输入第九周成绩" />
        </el-form-item>
        <el-form-item label="第十周成绩" prop="TenthRank">
          <el-input v-model="form.TenthRank" placeholder="请输入第十周成绩" />
        </el-form-item>
        <el-form-item label="第十一周成绩" prop="EleventhRank">
          <el-input v-model="form.EleventhRank" placeholder="请输入第十一周成绩" />
        </el-form-item>
        <el-form-item label="第十二周成绩" prop="TwelfthRank">
          <el-input v-model="form.TwelfthRank" placeholder="请输入第十二周成绩" />
        </el-form-item>
        <el-form-item label="第十三周成绩" prop="ThirteenthRank">
          <el-input v-model="form.ThirteenthRank" placeholder="请输入第十三周成绩" />
        </el-form-item>
        <el-form-item label="第十四周成绩" prop="FourteenthRank">
          <el-input v-model="form.FourteenthRank" placeholder="请输入第十四周成绩" />
        </el-form-item>
        <el-form-item label="第十五周成绩" prop="FifteenthRank">
          <el-input v-model="form.FifteenthRank" placeholder="请输入第十五周成绩" />
        </el-form-item>
        <el-form-item label="第十六周成绩" prop="SixteenthRank">
          <el-input v-model="form.SixteenthRank" placeholder="请输入第十六周成绩" />
        </el-form-item>
        <el-form-item label="第十七周成绩" prop="SeventeenthRank">
          <el-input v-model="form.SeventeenthRank" placeholder="请输入第十七周成绩" />
        </el-form-item>
        <el-form-item label="第十八周成绩" prop="EighteenthRank">
          <el-input v-model="form.EighteenthRank" placeholder="请输入第十八周成绩" />
        </el-form-item>
        <el-form-item label="第十九周成绩" prop="NineteenthRank">
          <el-input v-model="form.NineteenthRank" placeholder="请输入第十九周成绩" />
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

<script setup name="Fun_hygiene">
import { listFun_hygiene, getFun_hygiene, delFun_hygiene, addFun_hygiene, updateFun_hygiene } from "@/api/function/fun_hygiene";

const { proxy } = getCurrentInstance();

const fun_hygieneList = ref([]);
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
    Dormitoryid: null,
  },
  rules: {
    Dormitoryid: [
      { required: true, message: "宿舍不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询卫检成绩列表 */
function getList() {
  loading.value = true;
  listFun_hygiene(queryParams.value).then(response => {
    fun_hygieneList.value = response.rows;
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
    Dormitoryid: null,
    FirstRank: null,
    SecondRank: null,
    ThirdRank: null,
    FourthRank: null,
    FifthRank: null,
    SixthRank: null,
    SeventhRank: null,
    EighthRank: null,
    NinthRank: null,
    TenthRank: null,
    EleventhRank: null,
    TwelfthRank: null,
    ThirteenthRank: null,
    FourteenthRank: null,
    FifteenthRank: null,
    SixteenthRank: null,
    SeventeenthRank: null,
    EighteenthRank: null,
    NineteenthRank: null
  };
  proxy.resetForm("fun_hygieneRef");
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
  title.value = "添加卫检成绩";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getFun_hygiene(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改卫检成绩";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fun_hygieneRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateFun_hygiene(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFun_hygiene(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除卫检成绩编号为"' + _ids + '"的数据项？').then(function() {
    return delFun_hygiene(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('function/fun_hygiene/export', {
    ...queryParams.value
  }, `fun_hygiene_${new Date().getTime()}.xlsx`)
}

getList();
</script>
