<template>
  <upload :upload-data="uploadData"></upload>
</template>
<script>
  import upload from '@/components/upload';

  export default {
    components: { upload },
    data() {
      return {
        uploadData: {
          type: '首页广告',
          size: '750x340',
        },
      };
    },
  };
</script>
