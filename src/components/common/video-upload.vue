<template>
  <div>
    <a v-if="videoFile" target="blank" :href="videoFile.fileUrl" >{{ videoFile.fullName }}</a>
    <Upload ref="upload" :headers="headers" :data="param"
            :multiple="false"
            :disabled="disabled"
            :on-success="onSuccess"
            :before-upload="beforeUpload"
            :max-size="2048000"
            accept="video/mp4,video/x-m4v,video/*" :action="action">
      <Button type="primary"
            :loading="btnLoading"
            icon="md-cloud-upload">{{btnText}}</Button>
    </Upload>
  </div>
</template>
<script>
import axios from '@/libs/api.request'
export default {
  name: 'VideoUpload',
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
      disabled: false,
      btnLoading: false,
      btnText: '上传视频',
      headers: {
      },
      param: {
      },
      videoFile: this.defaultFile
    }
  },
  methods: {
    onSuccess (res, file, fileList) {
      this.$Message.destroy()
      this.$refs.upload.clearFiles()
      this.disabled = false
      this.btnLoading = false
      this.btnText = '上传视频'
      this.$Message.info('上传成功')
      this.videoFile = res.data
      this.emitInput(this.videoFile)
    },
    beforeUpload (file) {
      let self = this
      let suffix = file.name.substring(file.name.lastIndexOf('.'))
      self.disabled = true
      self.btnLoading = true
      self.btnText = '上传中...'
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
    clearVideo () {
      this.videoFile = null
      this.$emit('on-file-change', null)
      this.$emit('input', null)
    },
    emitInput (file) {
      this.$emit('on-file-change', file)
      this.$emit('input', file && file.fileKey)
    }
  },
  watch: {
    defaultFile () {
      this.videoFile = this.defaultFile
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
