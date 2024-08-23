<template>
  <div ref="echartsContainer" style="width: 540px; height: 460px;"></div>
</template>

<script setup>
import * as echarts from 'echarts';

const props = defineProps({
  chartData: {
    type: Array,
    required: true
  },
  text: {
    type: String,
    default: ''
  },
  subtext: {
    type: String,
    default: ''
  }
});

const echartsContainer = ref(null);

onMounted(() => {
  if (props.chartData && props.chartData.length > 0) {
    initChart();
  }
});

const initChart = () => {
  const myChart = echarts.init(echartsContainer.value);
  myChart.setOption({
    title: {
      text: props.text,
      subtext: props.subtext,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      show: false
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        name: 'Access From',
        data: props.chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}: {c} ({d}%)',
        },
        labelLine: {
          show: true
        }
      }
    ]
  });
};
</script>