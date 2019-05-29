<template>
  <Modal title="课程编辑" v-model="visible">
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
              @on-file-change="handleCoverChange" :num="1" />
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
      <Button type="primary" size="large" :loading="loadingUpdate" @click="update">保存</Button>
    </div>
  </Modal>
</template>
<script>
import ImageUpload from '_c/common/image-upload'
import VideoUpload from '_c/common/video-upload'
import { mapActions } from 'vuex'

export default {
  name: 'course-update-modal',
  components: { ImageUpload, VideoUpload },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: Number
    },
    updateCallback: {
      type: Function
    }
  },
  data () {
    return {
      visible: this.value,
      loadingUpdate: false,
      courseParam: {},
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
          { type: 'string', required: true, message: '请上传封面', trigger: 'blur' }
        ],
        video: [
          { type: 'string', required: true, message: '请上传视频', trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
  },
  methods: {
    ...mapActions([
      'getCourseById',
      'courseUpdate'
    ]),
    update () {
      let self = this
      self.loadingUpdate = true
      self.$refs.courseForm.validate((valid) => {
        if (!valid) {
          self.$Message.warning('信息输入错误!')
          self.loadingUpdate = false
          return
        }
        this.courseUpdate(this.courseParam).then(data => {
          self.visible = false
          self.$Message.success('保存成功!')
          self.updateCallback()
          self.loadingUpdate = false
        }, () => {
          self.loadingUpdate = false
        })
      })
    },
    loadCourse () {
      let loadMsg = this.$Message.loading('正在加载中...', 0)
      let courseId = this.courseId
      this.getCourseById({ courseId }).then(data => {
        loadMsg()
        this.courseParam = data
        this.coverFile = data.coverFile
        this.videoFile = data.videoFile
        this.visible = true
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
      if (val === true) {
        this.loadCourse()
      } else {
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
