<template>
  <Modal title="课程添加" v-model="visible">
    <Form ref="courseForm" class="form" :label-width="80"
        :model="courseParam" :rules="courseRule" >
      <Row>
        <Col :span="14" >
          <Form-item label="标题" prop="title">
            <Input v-model="courseParam.title" />
          </Form-item>
        </Col>
        <Col :span="8" >
          <Form-item prop="freeFlag">
            <Checkbox v-model="courseParam.freeFlag">免费</Checkbox>
          </Form-item>
        </Col>
        <Col :span="22" >
          <Form-item label="介绍" prop="intro">
            <Input v-model="courseParam.intro" type="textarea" :autosize="{minRows: 2,maxRows: 3}" />
          </Form-item>
        </Col>
        <Col :span="22" >
          <Form-item label="封面" prop="cover">
            <image-upload ref="coverUpload"
              :default-file="coverFile" file-category="course_cover"
              @on-file-change="handleCoverChange" />
          </Form-item>
        </Col>
        <Col :span="22" >
          <Form-item label="视频" prop="video">
            <video-upload ref="videoUpload"
              :default-file="videoFile" file-category="course_video"
              @on-file-change="handleVideoChange" />
          </Form-item>
        </Col>
      </Row>
    </Form>
    <div slot="footer">
      <Button type="text" size="large" @click="visible=false">取消</Button>
      <Button type="primary" size="large" :loading="loadingSave" @click="save">保存</Button>
    </div>
  </Modal>
</template>
<script>
import ImageUpload from '_c/common/image-upload'
import VideoUpload from '_c/common/video-upload'
import { mapActions } from 'vuex'

export default {
  name: 'course-save-modal',
  components: { ImageUpload, VideoUpload },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    saveCallback: {
      type: Function
    }
  },
  data () {
    return {
      visible: this.value,
      loadingSave: false,
      courseParam: {
        cover: '',
        video: ''
      },
      coverFile: null,
      videoFile: null,
      courseRule: {
        title: [
          { type: 'string', required: true, message: '标题不能为空', trigger: 'blur' },
          { type: 'string', min: 2, max: 30, message: '标题应为2-30个字', trigger: 'blur' }
        ],
        intro: [
          { type: 'string', required: true, message: '介绍不能为空', trigger: 'blur' },
          { type: 'string', max: 120, message: '介绍不能超过120个字', trigger: 'blur' }
        ],
        cover: [
          // { type: 'string', required: true, message: '请上传封面', trigger: 'change' },
          { validator: (rule, value, callback, source, options) => {
            console.log(value)
            let errors = []
            if (!value || value === '') {
              errors.push('请上传封面')
            }
            callback(errors)
          } }
        ],
        video: [
          // { type: 'string', required: true, message: '请上传视频', trigger: 'change' },
          { validator: (rule, value, callback, source, options) => {
            console.log(value)
            let errors = []
            if (!value || value === '') {
              errors.push('请上传视频')
            }
            callback(errors)
          } }
        ]
      }
    }
  },
  created: function () {
  },
  methods: {
    ...mapActions([
      'courseSave'
    ]),
    save () {
      let self = this
      self.loadingSave = true
      self.$refs.courseForm.validate((valid) => {
        if (!valid) {
          self.$Message.warning('信息输入错误!')
          self.loadingSave = false
          return
        }
        this.courseSave(this.courseParam).then(data => {
          self.visible = false
          self.$Message.success('保存成功!')
          self.saveCallback()
          self.loadingSave = false
        }, () => {
          self.loadingSave = false
        })
      })
    },
    handleCoverChange (file) {
      this.courseParam.cover = file && file.fileKey
    },
    handleVideoChange (file) {
      this.courseParam.video = file && file.fileKey
    }
  },
  watch: {
    value (val) {
      this.visible = val
      if (val !== true) {
        this.visible = val
        this.$refs.courseForm.resetFields()
        this.$refs.coverUpload.clearImage()
        this.$refs.videoUpload.clearVideo()
      }
    },
    visible (val) {
      this.$emit('input', val)
    }
  }
}
</script>
