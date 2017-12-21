<template>
  <div class="userWrap">
    <Row>
      <Col span="3">
      <p style="text-align: center;">上传图片 <span style="color:#f00;">*</span></p>
      </Col>
      <Col span="21">
      <p style="color: #666666;margin-bottom: 20px;">支持jpg/png格式，单张建议规格（90*90，大小<10M），最多上传6张图片。</p>
      <div class="color-list">
        <div
          class="color-item itemWrap"
          v-for="(uploadItem, index) in uploadList" v-dragging="{ item: uploadItem, list: uploadList, group: 'uploadItem' }"
          :key="uploadItem.url" @click="uploadClick(index)">
          <div :class="['dargColor', {active: bgRed[index]}]"><i class="iconfont icon icon-jiantou"></i></div>
          <div style="float:left;margin-top: 37px;" @click="uploadClick(index)">
            <Upload
              class="upload"
              :max-size="10240"
              type="drag"
              ref="upload"
              :show-upload-list="false"
              :headers="{Accept: 'application/json; charset=utf-8'}"
              :on-success="handleSuccess"
              :format="['jpg','jpeg','png']"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :before-upload="handleBeforeUpload"
              action="http://upload.dreamhiway.com/uploadimg?key=ha&t=750x340">
              <div class="imgWrap" v-if="!uploadItem.url">
                <i class="iconfont icon icon-pic"></i>
                <p class="uploadText">点击或拖拽上传</p>
              </div>
              <div class="uploadImg" v-else>
                <img :src="uploadItem.url" alt="">
              </div>
            </Upload>
          </div>
          <div class="urlPathBox">
            <Input v-model="uploadItem.title" style="width: 340px;" placeholder="请输入精品推荐标题(必填)" class="urlPath"></Input>
            <Input v-model="uploadItem.urlPath" style="width: 340px;" placeholder="请输入链接(选填)" class="urlPath"></Input>
            <Input type="textarea" v-model="uploadItem.content" placeholder="请输入精品推荐内容(必填)" class="urlPath"></Input>
          </div>
          <div class="uploadAction">
            <i v-if="uploadList.length > 1" class="icon iconfont icon-minus" @click="minusUpload(index)"></i>
            <i v-if="uploadList.length < 6" class="icon iconfont icon-plus" @click="plusUpload(index)"></i>
          </div>
        </div>
      </div>
      <Button type="error" style="margin-bottom: 20px;" @click="uploadAll">确认上传</Button>
      </Col>
    </Row>
  </div>
</template>

<script>
  import apis from '@/apis';

  export default {
    data() {
      return {
        bgRed: [false, false, false, false, false, false],
        uploadIndex: 0,
        uploadList: [
          {
            url: '',
            name: '',
            urlPath: '',
            title: '',
            content: '',
          },
        ],
      };
    },
    methods: {
      handleSuccess(res) {
        // 因为上传过程为实例，这里模拟添加 url
        const uploadList = this.uploadList;
        uploadList[this.uploadIndex].url = `http://upload.dreamhiway.com/img/${res.path + res.name}_750x340.jpg`;
        uploadList[this.uploadIndex].name = res.path + res.name;
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: `文件 ${file.name} 格式不正确，请上传 jpg 或 png 格式的图片。`,
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: `文件  ${file.name}  太大，不能超过 2M。`,
        });
      },
      handleBeforeUpload() {
        const check = this.uploadList.length < 6;
        if (!check) {
          this.$Notice.warning({
            title: '最多只能上传 6 张图片。',
          });
        }
        return check;
      },
      uploadClick(index) {
        this.uploadIndex = index;
        this.bgRed.map((val, i) => {
          if (index === i) {
            this.bgRed[i] = true;
          } else {
            this.bgRed[i] = false;
          }
          return this.bgRed;
        });
        this.$forceUpdate(); // 强制渲染组件
      },
      plusUpload(index) {
        const obj = {
          url: '',
          name: '',
          urlPath: '',
          title: '',
          content: '',
        };
        this.uploadList.splice(index + 1, 0, obj);
      },
      minusUpload(index) {
        this.uploadList.splice(index, 1);
      },
      // 首页广告上传
      uploadAll() {
        const data = {};
        data.size = '750x340';
        data.type = '动态精品';
        data.advert = [];
        this.uploadList.map((val, index) => {
          if (val.name) {
            const obj = {};
            obj.title = val.title;
            obj.content = val.content;
            obj.img = val.name;
            obj.url = val.urlPath;
            obj.sort = index;
            data.advert.push(obj);
          }
          return data.advert;
        });
        this.$http.post(apis.AdvertsUpload, data)
          .then(res => res.json()).then((ress) => {
            if (ress.success) {
              this.$Message.success('上传成功');
            }
          });
      },
    },
    mounted() {
      this.$http.post(apis.AdvertsList, { type: '动态精品' })
        .then((res) => {
          res.json().then((ress) => {
            if (ress.success) {
              if (ress.result.length > 0) {
                this.uploadList = [];
              }
              const array = ress.result.sort((obj1, obj2) => {
                const value1 = obj1.sort;
                const value2 = obj2.sort;
                return value1 - value2;     // 升序
              });
              array.map((val) => {
                const obj = {};
                obj.name = val.img;
                obj.url = val.img;
                obj.title = val.title;
                obj.urlPath = val.url;
                obj.content = val.content;
                this.uploadList.push(obj);
                return this.uploadList;
              });
            }
          });
        });
    },
  };
</script>
<style scoped>
  .itemWrap {
    width: 750px;
    /*height: 130px;*/
    overflow: hidden;
    background-color: #edeff1;
    margin-bottom: 8px;
  }
  .dargColor {
    float: left;
    text-align: center;
    vertical-align: middle;
    width: 35px;
    height: 35px;
    margin: 64px 20px 48px 20px ;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    background-color: #d2d2d2;
  }
  .dargColor.active {
    background-color: #d6000f;
  }
  .icon-jiantou {
    font-size: 24px;
    color: #fff;
  }
  .upload {
    border-radius: 5px;
  }
  .upload,
  .uploadImg,
  .ivu-upload-drag{
    float: left;
    width: 90px;
    height: 90px;
    background-color: #edeff1;
    overflow: hidden;
  }
  .ivu-upload-drag {
    border: 1px solid #d2d2d2;
  }
  .uploadText {
    color: #999;
    padding: 0 20px;
  }
  .icon-pic {
    font-size: 30px;
    color: #ddd;
  }
  .urlPathBox {
    float: left;
    width: 420px;
    margin: 10px 0 10px 30px;
  }
  .urlPath {
    margin: 5px 0;
    border-radius: 5px;
  }
  .ivu-input {
    background-color: #edeff1;
    border-color: #d2d2d2;
  }
  .uploadAction {
    float: right;
    margin-top: 60px;
    margin-right: 10px;
  }
  .uploadAction .icon {
    font-size: 24px;
    color: #aaaaaa;
    margin-right: 20px;
  }
  .uploadImg img {
    width: 150px;
  }
</style>
<style>
  .ivu-upload-drag {
    background: #edeff1;
    height: 90px;
    border: 1px solid #d2d2d2;
  }
</style>
