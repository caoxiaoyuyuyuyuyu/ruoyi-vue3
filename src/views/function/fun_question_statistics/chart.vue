<template>
  <div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
  <div v-for="(chart, index) in chartData" :key="index">
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

const route = useRoute();
const { proxy } = getCurrentInstance();
const { fun_question_type } = proxy.useDict('fun_question_type');

const fun_question_statisticsList =ref([]);
const fun_questionList = ref([]);

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
    // console.log(response);
    fun_question_statisticsList.value = response.data;
    // console.log(fun_question_type.value);
    // console.log(fun_question_statisticsList.value);
  });
}
const chartData = ref(
)
onMounted(async() => {
  await getQList();
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
          value: statistics[choices.indexOf(choiceItem)]
        }
      }),
      type: fun_question_type.value.find(type => type.value === question.type).label
    };
  })
  // console.log(chartData.value);
});

</script>