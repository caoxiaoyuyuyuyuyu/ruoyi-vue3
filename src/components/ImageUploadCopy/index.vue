<template>
  <div class="component-upload-image">
    <el-upload
      ref="imageUpload"
      multiple
      :show-file-list="true"
      list-type="picture-card"
      :limit="limit"
      :auto-upload="true"
      :http-request="handleUpload"
      :before-upload="handleBeforeUpload"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :before-remove="handleDelete"
      :on-preview="handlePictureCardPreview"
      :file-list="fileList"
      :class="{ hide: fileList.length >= limit }"
    >
      <el-icon class="avatar-uploader-icon"><plus /></el-icon>
    </el-upload>
    <!-- <el-button @click="submitUpload" type="primary">单击上传</el-button> -->
    <!-- 上传提示 -->
    <div class="el-upload__tip" v-if="showTip">
      请上传
      <template v-if="fileSize">
        大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
      </template>
      <template v-if="fileType">
        格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b>
      </template>
      的文件
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="预览"
      width="800px"
      append-to-body
    >
      <img
        :src="dialogImageUrl"
        style="display: block; max-width: 100%; margin: 0 auto"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { getToken } from "@/utils/auth";
import { ref } from "vue";

const props = defineProps({
  modelValue: [String, Object, Array],
  // 图片数量限制
  limit: {
    type: Number,
    default: 5,
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 5,
  },
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: {
    type: Array,
    default: () => ["png", "jpg", "jpeg"],
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true
  },
});
const imageUpload = ref(null);
const { proxy } = getCurrentInstance();
const emit = defineEmits();
const number = ref(0);
const uploadList = ref([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
// const baseUrl = import.meta.env.VITE_APP_BASE_API;
// const baseUrl = "http://localhost:8080";
const baseUrl = import.meta.env.VITE_APP_ASSETS_PATH
const uploadImgUrl = ref(import.meta.env.VITE_APP_BASE_API + "/common/upload"); // 上传的图片服务器地址
// const uploadImgUrl = "https://william.fit:8889/tencentcloud/www/static"; // 上传的图片服务器地址
const headers = ref({ Authorization: "Bearer " + getToken() });
// const headers = ref({ Authorization:
// "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybGV2ZWwiOiIxIiwib3BlbmlkIjoib3JtVFM1QTZPUFVyZnpFVW1VTDJnU296dTd5NCIsImlkIjoyLCJ1c2VyaWQiOiIyMDIyMTEwNzA1MDEiLCJleHAiOjE3MjM4MjI0OTd9.7ycNiDL6V90NaLAzDUoUdlz2JhC-54fxKR_H7Opemn4"});
const fileList = ref([]);
const showTip = computed(
  () => props.isShowTip && (props.fileType || props.fileSize)
);
console.log("uploadImgUrl：",uploadImgUrl.value)
watch(() => props.modelValue, val => {
  if (val) {
    // 首先将值转为数组
    const list = Array.isArray(val) ? val : props.modelValue.split(",");
    // 然后将数组转为对象数组
    fileList.value = list.map(item => {
      console.log("item：",item)
      if (typeof item === "string") {
        console.log("item：",item)
        // console.log("baseUrl：",baseUrl)
        // console.log("uploadImgUrl：",uploadImgUrl.value)
        // console.log("item.indexOf(baseUrl)：",item.indexOf(baseUrl))
        if (item.indexOf(baseUrl) === -1) {
          if(item.startsWith("https://") || item.startsWith("http://")){
              item = { name: item, url: item };
          }else{
            item = { name: baseUrl + item, url: baseUrl + item };
          }
        } else {
          item = { name: item, url: item };
        }
        console.log("++item：",item)

      }
      return item;
    });
  } else {
    fileList.value = [];
    return [];
  }
},{ deep: true, immediate: true });
// const submitUpload = () => {
//   imageUpload.value.submit();
// };
// function handleChange(e) {
//   console.log("Change, e：",e)
// }
function handleUpload(e) {
  console.log("Upload, file：",e.file)
  const formData = new FormData();
  formData.append('file', e.file);
  formData.append('userid', "202211070501");
  // const formData = new FormData();
  // formData.append('file', params.file);
  // // 自定义上传逻辑
  fetch('https://localhost:8082/upload/updateAvatar', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // 如果服务器返回的是JSON数据
    return response.json(); 
    // 如果服务器返回的是纯文本
    // return response.text();
})
  .then((data) => {
    console.log('上传成功:', data);
    // 触发上传成功的回调
    e.onSuccess(data, e.file, [e.file]);
  })
  .catch((error) => {
    console.error('上传失败:', error);
    // 触发上传失败的回调
    e.onError(error, e.file, [e.file]);
  });
}
// 上传前loading加载
function handleBeforeUpload(file) {
  console.log("file：",file)
  let isImg = false;
  if (props.fileType.length) {
    let fileExtension = "";
    if (file.name.lastIndexOf(".") > -1) {
      fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
    }
    isImg = props.fileType.some(type => {
      if (file.type.indexOf(type) > -1) return true;
      if (fileExtension && fileExtension.indexOf(type) > -1) return true;
      return false;
    });
  } else {
    isImg = file.type.indexOf("image") > -1;
  }
  if (!isImg) {
    proxy.$modal.msgError(
      `文件格式不正确, 请上传${props.fileType.join("/")}图片格式文件!`
    );
    return false;
  }
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      proxy.$modal.msgError(`上传头像图片大小不能超过 ${props.fileSize} MB!`);
      return false;
    }
  }
  proxy.$modal.loading("正在上传图片，请稍候...");
  number.value++;
}

// 文件个数超出
function handleExceed() {
  proxy.$modal.msgError(`上传文件数量不能超过 ${props.limit} 个!`);
}

// 上传成功回调
function handleUploadSuccess(res, file) {
  console.log("res：",res)
  // console.log("file：",file)
  if (res.msg === "操作成功") {
    console.log("res.msg ===",res.msg)
    uploadList.value.push({ name: res.fileName, url: res.fileName });
    uploadedSuccessfully();
  } else {
    number.value--;
    proxy.$modal.closeLoading();
    proxy.$modal.msgError(res.msg);
    proxy.$refs.imageUpload.handleRemove(file);
    uploadedSuccessfully();
  }
}

// 删除图片
function handleDelete(file) {
  const findex = fileList.value.map(f => f.name).indexOf(file.name);
  if (findex > -1 && uploadList.value.length === number.value) {
    fileList.value.splice(findex, 1);
    emit("update:modelValue", listToString(fileList.value));
    return false;
  }
}

// 上传结束处理
function uploadedSuccessfully() {
  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value.filter(f => f.url !== undefined).concat(uploadList.value);
    for (let i = 0; i < fileList.value.length; i++) {
      if(fileList.value[i].url.startsWith("https://") || fileList.value[i].url.startsWith("http://")){
        console.log("直接存")
      }else{
        //每一项的url属性添加头
        fileList.value[i].url = baseUrl + fileList.value[i].url;
        //每一项的name属性添加头
        fileList.value[i].name = baseUrl + fileList.value[i].name;
      }
    }
    uploadList.value = [];
    number.value = 0;
    console.log("fileList：",listToString(fileList.value))
    emit("update:modelValue", listToString(fileList.value));
    proxy.$modal.closeLoading();
  }
}

// 上传失败
function handleUploadError(err) {
  console.log("err：",err)
  proxy.$modal.msgError("上传图片失败");
  proxy.$modal.closeLoading();
}

// 预览
function handlePictureCardPreview(file) {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
}

// 对象转成指定字符串分隔
function listToString(list, separator) {
  let strs = "";
  separator = separator || ",";
  for (let i in list) {
    if (undefined !== list[i].url && list[i].url.indexOf("blob:") !== 0) {
      // strs += list[i].url.replace(baseUrl, "") + separator;//去除baseUrl
      strs += list[i].url + separator;
    }
  }
  return strs != "" ? strs.substr(0, strs.length - 1) : "";
}
</script>

<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
:deep(.hide .el-upload--picture-card) {
    display: none;
}
</style>