<template>
    <div class="leave-form">
      <el-card>
        <h3>请假单</h3>
        <el-form label-position="right" label-width="120px">
          <el-form-item label="ID">
            <span>{{ postInfo.id }}</span>
          </el-form-item>
          <el-form-item label="学号">
            <span>{{ postInfo.userId }}</span>
          </el-form-item>
          <el-form-item label="真实姓名">
            <router-link :to="'/function/fun_user/funUserDetail/index/'+postInfo.userId" class="link-type">
            <span>{{ postInfo.trueName }}</span>
            </router-link>
          </el-form-item>
          <el-form-item label="是否外出">
            <el-radio-group disabled v-model="postInfo.isOut">
              <el-radio
              v-for="dict in fun_leave_type"
              :key="dict.value"
              :label="dict.value"
              >{{dict.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="原因">
            <span>{{ postInfo.reason }}</span>
          </el-form-item>
          <el-form-item label="文件链接">
            <div v-if="isImage">
              <img :src="postInfo.file" alt="File Preview" style="max-width: 300px; max-height: 300px;">
            </div>
            <div v-else-if="isVideo">
              <video :src="postInfo.file" controls style="max-width: 300px; max-height: 300px;"></video>
            </div>
            <div v-else>
              <a :href="postInfo.file" target="_blank">{{ postInfo.file }}</a>
            </div>
          </el-form-item>
          <el-form-item label="开始时间">
            <span>{{ postInfo.startTime }}</span>
          </el-form-item>
          <el-form-item label="结束时间">
            <span>{{ postInfo.endTime }}</span>
          </el-form-item>
          <el-form-item label="审核人ID">
            <router-link :to="'/function/fun_user/funUserDetail/index/'+postInfo.reviewerId" class="link-type">
            <span>{{ postInfo.reviewerId }}</span>
            </router-link>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group disabled v-model="postInfo.status">
            <el-radio
              v-for="dict in fun_leave_post_status"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
          </el-form-item>
          <el-form-item label="创建时间">
            <span>{{ postInfo.createdAt }}</span>
          </el-form-item>
          <el-form-item label="更新时间">
            <span>{{ postInfo.updatedAt }}</span>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>

<script setup>
import {ref,onMounted,onBeforeMount} from 'vue';
import { getLeave_post } from "@/api/function/leave_post";
const route = useRoute();
const { proxy } = getCurrentInstance();
const { fun_leave_type, fun_leave_post_status } = proxy.useDict('fun_leave_type', 'fun_leave_post_status');

const postInfo= ref({});
const isImage=ref(false);
const isVideo=ref(false);
const data = reactive({
});

const getFileExtension=(url)=> {
    console.log('URL:', url); // 添加调试日志
    if (typeof url !== 'string') {
        console.error('URL is not a string');
        return '';
    }
    const parts = url.split('.');
    console.log('Parts:', parts); // 添加调试日志
    return parts[parts.length - 1];
}
onBeforeMount(() => {
    getLeave_post(route.params.postId).then(response => {
    postInfo.value = response.data;
    console.log(postInfo.value);
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const videoExtensions = ['mp4', 'webm', 'ogg'];
    const extension = getFileExtension(postInfo.value.file);
    isImage.value= imageExtensions.includes(extension);
    isVideo.value= videoExtensions.includes(extension);
    });
})
onMounted(() => {
    
});

</script>
<style scoped>
.leave-form {
  max-width: 600px;
  margin: 0 auto;
}

.el-card {
  padding: 20px;
  margin-bottom: 20px;
}

h3 {
  margin-bottom: 10px;
}

.el-form-item {
  margin-bottom: 10px;
}
</style>