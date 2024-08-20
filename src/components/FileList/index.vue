<template>
    <div>
      <!-- 文件列表 -->
      <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
        <li :key="file.uid" class="el-upload-list__item ele-upload-list__item-content" v-for="(file) in fileList">
          <el-link :href="`${file.url}`" :underline="false" target="_blank">
            <span class="el-icon-document"> {{ getFileName(file.name) }} </span>
          </el-link>
        </li>
      </transition-group>
    </div>
  </template>
  
  <script setup>
  
  const props = defineProps({
    modelValue: [String, Object, Array],
  });
  
  const fileList = ref([]);
  
  watch(() => props.modelValue, val => {
    console.log("**watch","  val: ",val);
    console.log("modelValue: ",props.modelValue);
    if (val) {
      let temp = 1;
      // 首先将值转为数组
      const list = Array.isArray(val) ? val : props.modelValue.startsWith('[')?JSON.parse(props.modelValue):props.modelValue.replace("\"").split(",");
      console.log("list: ",list);
      // 然后将数组转为对象数组
      fileList.value = list.map(item => {
        if (typeof item === "string") {
          item = { name: item, url: item.startsWith('http')||item.startsWith('https') ? item : `${import.meta.env.VITE_APP_BASE_API}/${item}` };
        }
        item.uid = item.uid || new Date().getTime() + temp++;
        return item;
      });
    } else {
      fileList.value = [];
      return [];
    }
  },{ deep: true, immediate: true });
// 获取文件名称
function getFileName(name) {
  // 如果是url那么取最后的名字 如果不是直接返回
  if (name.lastIndexOf("/") > -1) {
    return name.slice(name.lastIndexOf("/") + 1);
  } else {
    return name;
  }
}
  </script>
  
  <style scoped lang="scss">
  
  .upload-file-list .el-upload-list__item {
    border: 1px #e4e7ed;
    line-height: 2;
    margin-bottom: 5px;
    position: relative;
  }
  .upload-file-list .ele-upload-list__item-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: inherit;
  }
  .ele-upload-list__item-content-action .el-link {
    margin-right: 10px;
  }
  .el-icon-document{
    font-size: 15px;
    color: #5a96c1;
  }
  </style>
  