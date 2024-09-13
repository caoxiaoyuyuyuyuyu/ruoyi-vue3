<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="宿舍" prop="dormitoryId">
        <el-input
          v-model="queryParams.dormitoryId"
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
      <el-table-column type="selection" width="30" align="center" />
      <el-table-column label="宿舍"  width="100"  align="center" prop="dormitoryId" />
      <el-table-column label="一" width="50" align="center" prop="firstRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.firstRank"/>
        </template>
      </el-table-column>
      <el-table-column label="二" align="center" prop="secondRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.secondRank"/>
        </template>
      </el-table-column>
      <el-table-column label="三" align="center" prop="thirdRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.thirdRank"/>
        </template>
      </el-table-column>
      <el-table-column label="四" align="center" prop="fourthRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.fourthRank"/>
        </template>
      </el-table-column>
      <el-table-column label="五" align="center" prop="fifthRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.fifthRank"/>
        </template>
      </el-table-column>
      <el-table-column label="六" align="center" prop="sixthRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.sixthRank"/>
        </template>
      </el-table-column>
      <el-table-column label="七" align="center" prop="seventhRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.seventhRank"/>
        </template>
      </el-table-column>
      <el-table-column label="八" align="center" prop="eighthRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.eighthRank"/>
        </template>
      </el-table-column>
      <el-table-column label="九" align="center" prop="ninthRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.ninthRank"/>
        </template>
      </el-table-column>
      <el-table-column label="十" align="center" prop="tenthRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.tenthRank"/>
        </template>
      </el-table-column>
      <el-table-column label="十一" align="center" prop="eleventhRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.eleventhRank"/>
        </template>
      </el-table-column>
      <el-table-column label="十二" align="center" prop="twelfthRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.twelfthRank"/>
        </template>
      </el-table-column>
      <el-table-column label="十三" align="center" prop="thirteenthRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.thirteenthRank"/>
        </template>
      </el-table-column>
      <el-table-column label="十四" align="center" prop="fourteenthRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.fourteenthRank"/>
        </template>
      </el-table-column>
      <el-table-column label="十五" align="center" prop="fifteenthRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.fifteenthRank"/>
        </template>
      </el-table-column>
      <el-table-column label="十六" align="center" prop="sixteenthRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.sixteenthRank"/>
        </template>
      </el-table-column>
      <el-table-column label="十七" align="center" prop="seventeenthRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.seventeenthRank"/>
        </template>
      </el-table-column>
      <el-table-column label="十八" align="center" prop="eighteenthRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.eighteenthRank"/>
        </template>
      </el-table-column>
      <el-table-column label="十九" align="center" prop="nineteenthRank">
        <template #default="scope">
          <dict-tag :options="fun_hygiene_grade" :value="scope.row.nineteenthRank"/>
        </template>
      </el-table-column>
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
        <el-form-item label="宿舍" prop="dormitoryId">
          <el-input v-model="form.dormitoryId" placeholder="请输入宿舍" />
        </el-form-item>
        <el-form-item label="一" prop="firstRank">
          <el-radio-group v-model="form.firstRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="二" prop="secondRank">
          <el-radio-group v-model="form.secondRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="三" prop="thirdRank">
          <el-radio-group v-model="form.thirdRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="四" prop="fourthRank">
          <el-radio-group v-model="form.fourthRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="五" prop="fifthRank">
          <el-radio-group v-model="form.fifthRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="六" prop="sixthRank">
          <el-radio-group v-model="form.sixthRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="七" prop="seventhRank">
          <el-radio-group v-model="form.seventhRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="八" prop="eighthRank">
          <el-radio-group v-model="form.eighthRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="九" prop="ninthRank">
          <el-radio-group v-model="form.ninthRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="十" prop="tenthRank">
          <el-radio-group v-model="form.tenthRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="十一" prop="eleventhRank">
          <el-radio-group v-model="form.eleventhRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="十二" prop="twelfthRank">
          <el-radio-group v-model="form.twelfthRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="十三" prop="thirteenthRank">
          <el-radio-group v-model="form.thirteenthRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="十四" prop="fourteenthRank">
          <el-radio-group v-model="form.fourteenthRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="十五" prop="fifteenthRank">
          <el-radio-group v-model="form.fifteenthRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="十六" prop="sixteenthRank">
          <el-radio-group v-model="form.sixteenthRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="十七" prop="seventeenthRank">
          <el-radio-group v-model="form.seventeenthRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="十八" prop="eighteenthRank">
          <el-radio-group v-model="form.eighteenthRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="十九" prop="nineteenthRank">
          <el-radio-group v-model="form.nineteenthRank">
            <el-radio
              v-for="dict in fun_hygiene_grade"
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

<script setup name="Fun_hygiene">
import { listFun_hygiene, getFun_hygiene, delFun_hygiene, addFun_hygiene, updateFun_hygiene } from "@/api/function/fun_hygiene";

const { proxy } = getCurrentInstance();
const { fun_hygiene_grade } = proxy.useDict('fun_hygiene_grade');

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
    dormitoryId: null,
  },
  rules: {
    dormitoryId: [
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
    dormitoryId: null,
    firstRank: null,
    secondRank: null,
    thirdRank: null,
    fourthRank: null,
    fifthRank: null,
    sixthRank: null,
    seventhRank: null,
    eighthRank: null,
    ninthRank: null,
    tenthRank: null,
    eleventhRank: null,
    twelfthRank: null,
    thirteenthRank: null,
    fourteenthRank: null,
    fifteenthRank: null,
    sixteenthRank: null,
    seventeenthRank: null,
    eighteenthRank: null,
    nineteenthRank: null
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
