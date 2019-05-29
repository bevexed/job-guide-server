<style scoped lang="less">
  .common-upload {

    .upload-list {
      margin: 5px 0;
      display: inline-block;
      height: 60px;
      text-align: center;
      line-height: 60px;
      border: 1px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      position: relative;
      box-shadow: 0 1px 1px rgba(0, 0, 0, .2);

      img {
        height: 100%;
      }
    }
  }
</style>
<template>
  <div class="common-upload">
    <ul v-if="imageFile">
      <li class="upload-list" >
        <img :src="imageFile.fileUrl">
      </li>
    </ul>
    <Upload ref="upload" :headers="headers" :data="param"
            :show-upload-list="true"
            :on-success="onSuccess"
            :before-upload="beforeUpload"
            accept="image/*" :action="action">
      <Button type="primary" icon="md-cloud-upload">上传图片</Button>
    </Upload>
  </div>
</template>
<script>
import axios from '@/libs/api.request'
export default {
  name: 'ImageUpload',
  props: {
    defaultFile: {
      type: Object
    },
    fileCategory: {
      type: String
    }
  },
  data () {
    return {
      action: '',
      headers: {
      },
      param: {
      },
      imageFile: this.defaultFile
    }
  },
  methods: {
    handleView () {
    },
    onSuccess (res, file, fileList) {
      this.$Message.destroy()
      this.$refs.upload.clearFiles()
      this.$Message.info('上传成功')
      this.imageFile = res.data
      this.emitInput(this.imageFile)
    },
    beforeUpload (file) {
      let self = this
      let suffix = file.name.substring(file.name.lastIndexOf('.'))

      self.$Message.loading('上传中...', 0)
      return new Promise((resolve, reject) => {
        axios.request({
          url: '/file/object/policy',
          params: { 'category': this.fileCategory },
          method: 'get'
        }).then(function (res) {
          let data = res.data
          self.action = data.host
          self.param = {
            'OSSAccessKeyId': data.accessKeyId,
            'policy': data.policy,
            'signature': data.signature,
            'key': data.fileKey + suffix,
            'callback': data.callback,
            'x:filename': file.name,
            'x:category': self.fileCategory,
            'x:folder': data.folder,
            'success_action_status': '200'
          }
          resolve(res.data)
        }).catch(function (e) {})
      })
    },
    clearImage () {
      this.imageFile = null
      this.$emit('on-file-change', null)
      this.$emit('input', null)
    },
    emitInput (file) {
      console.log('000' + file)
      this.$emit('on-file-change', file)
      this.$emit('input', file && file.fileKey)
    }
  },
  watch: {
    defaultFile () {
      this.imageFile = this.defaultFile
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
