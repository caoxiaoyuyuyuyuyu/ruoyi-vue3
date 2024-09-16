<template>
    <div class="user-info">
      <el-card>
        <h3>用户信息</h3>
        <el-form label-position="right" label-width="120px">
          <el-form-item label="头像">
            <img :src="userInfo.avatarUrl" alt="User Avatar" style="max-width: 100px; max-height: 100px;">
          </el-form-item>
          <el-form-item label="学号">
            <span>{{ userInfo.userid }}</span>
          </el-form-item>
          <el-form-item label="真实姓名">
            <span>{{ userInfo.trueName }}</span>
          </el-form-item>
          <el-form-item label="电话号码">
            <span>{{ userInfo.phone }}</span>
          </el-form-item>
          <el-form-item label="用户等级">
            <span>{{ userInfo.userLevel }}</span>
          </el-form-item>
          <el-form-item label="用户名">
            <span>{{ userInfo.username }}</span>
          </el-form-item>
          <el-form-item label="校区">
            <span>{{ schoolInfo.campusName }}</span>
          </el-form-item>
          <el-form-item label="学院">
            <span>{{ schoolInfo.collegeName }}</span>
          </el-form-item>
          <el-form-item label="专业">
            <span>{{ schoolInfo.majorName }}</span>
          </el-form-item>
          <el-form-item label="年级">
            <span>{{ schoolInfo.gradeName }}</span>
          </el-form-item>
          <el-form-item label="班级">
            <span>{{ schoolInfo.className }}</span>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onBeforeMount } from 'vue';
  import { getFun_userByUserId, getSchoolInfo } from "@/api/function/fun_user";
  
  const route = useRoute();
  const userInfo = ref({});
  const schoolInfo = ref({});
  onBeforeMount(() => {
    fetchUserInfo()
  });
  
  const fetchUserInfo = () => {
    getFun_userByUserId(route.params.userId).then(response => {
      userInfo.value = response.data;
    });
    getSchoolInfo(route.params.userId).then(response => {
        schoolInfo.value = response.data;
    });
  };
  </script>
  
  <style scoped>
  .user-info {
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
   