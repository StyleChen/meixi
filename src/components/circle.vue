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
          type: '圈子广告',
          size: '750x180',
        },
      };
    },
  };
</script>

