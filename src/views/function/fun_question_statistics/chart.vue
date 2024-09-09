<template>
  <div class="title">
    <!-- 标题栏 -->
     <el-text type="success" size="large" >{{ naireInfo.name }}</el-text>
     <dict-tag :options="fun_questionnare_type" :value="naireInfo.type"/>
  </div>
  <div class="bar">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Search"
          @click="HandleRefresh"
          v-hasPermi="['function:fun_question_statistics:chart']"
        >刷新</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['function:fun_question_statistics:export']"
        >导出</el-button>
      </el-col>
    </el-row>
  </div>
  <div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
  <div v-for="(chart, index) in chartData" :key="index + chart.version">
    <transition name="custom-fade">
      <EChartsComponent :chartData="chart.data" :text="chart.name" :subtext="chart.type" />
    </transition>
  </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import { list_statistic_for_chart } from "@/api/function/fun_question_statistics";
import { list_question_for_chart } from "@/api/function/fun_question";
import { getFun_questionnaire } from "@/api/function/fun_questionnaire";

const route = useRoute();
const { proxy } = getCurrentInstance();
const { fun_question_type,fun_questionnare_type } = proxy.useDict('fun_question_type','fun_questionnare_type');

const fun_question_statisticsList =ref([]);
const fun_questionList = ref([]);
const naireInfo= ref({});

const data = reactive({
  // form: {},
  queryParams: {
    naireId: null,
  },
});

const { queryParams } = toRefs(data);

/** 导出按钮操作 */
function handleExport() {
  queryParams.value.naireId=route.params.naireId;
  proxy.download('function/fun_question_statistics/export', {
    ...queryParams.value
  }, `fun_question_statistics_${new Date().getTime()}.xlsx`)
}

/** 查询问卷详细 */
async function getNaire() {
  await getFun_questionnaire(route.params.naireId).then(response => {
    console.log(response.data.funQuestionList);
    naireInfo.value=response.data;
    // funQuestionList.value = response.data.funQuestionList;
    fun_questionList.value = response.data.funQuestionList.filter(question => {
      let type = fun_question_type.value.find(type => type.value===question.type)
      // .label.indexOf("选")!==-1
      return type&&type.label.indexOf("选")!==-1;
    });
    console.log("fun_questionList",fun_questionList.value)
  });
}

/** 查询问卷中的问题列表 */
async function getQList() {
  await list_question_for_chart(route.params.naireId).then(response => {
    // console.log(response);
    fun_questionList.value = response.data.filter(question => question.type !== "3");
    // console.log(fun_questionList.value);
  });
}

/** 查询问卷作答统计列表 */
async function getList() {
  await list_statistic_for_chart(route.params.naireId).then(response => {
    console.log(response);
    fun_question_statisticsList.value = response.data;
    console.log("fun_question_type.value)",fun_question_type.value);
    console.log(fun_question_statisticsList.value);
  });
}
    /*刷新按钮操作*/
async function HandleRefresh() {
  await getNaire();
  // await getQList();
  await getList();
  chartData.value = fun_questionList.value.map(question => {
    const statistics = fun_question_statisticsList.value.find(statistic => statistic.questionId === question.id).choiceCount.split(",").filter(item => item!=="");
    // console.log("统计的数量",statistics);
    const choices = JSON.parse(question.content);
    // console.log("选项",choices);
    return {
      name: question.name,
      data: JSON.parse(question.content).map(choiceItem => {
        return {
          name: choiceItem,
          value: Number(statistics[choices.indexOf(choiceItem)])
        }
      }),
      type: fun_question_type.value.find(type => type.value === question.type).label,
      // Add a version to trigger transitions
      version: Date.now(), // Use current timestamp as version
    };
  })
}

const chartData = ref()
onMounted(async() => {
  await HandleRefresh();
  // console.log(chartData.value);
});

</script>
<style scoped>
.title{
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  flex-wrap: nowrap;
}
.bar{
  margin: 15px;
}
/* Define the animation styles */
.custom-fade-enter-active,
.custom-fade-leave-active {
  transition: opacity 0.5s ease;
}

.custom-fade-enter-from,
.custom-fade-leave-to {
  opacity: 0;
}
</style>