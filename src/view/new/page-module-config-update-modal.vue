<template>
  <Modal title="网站页面配置修改" v-model="visible">
    <Form ref="form" class="form" :label-width="80"
        :model="param" :rules="rule" >
      <Row>
        <Col :span="11" >
          <Form-item label="模块" prop="moduleCode">
            <Select v-model="param.moduleCode" disabled>
              <Option value="homehot">首页热门视频</Option>
              <Option value="homedevelop">首页职业发展</Option>
              <Option value="homeprofession">首页热门岗位</Option>
              <Option value="homezixun">首页高考资讯</Option>
              <Option value="develop">发展之路</Option>
              <Option value="profession">职业菜单</Option>
            </Select>
          </Form-item>
        </Col>
        <Col :span="11" >
          <Form-item label="排序号" prop="sortNo">
            <Input type="number" v-model.number="param.sortNo"  />
          </Form-item>
        </Col>
      </Row>
      <Row>
        <Col :span="22" >
          <Form-item label="跳转链接" prop="link">
            <Input v-model="param.link" />
          </Form-item>
        </Col>


        <Col :span="22" >
          <Form-item label="图片" prop="image">
            <image-upload ref="imageUpload"
              :default-file="imageFile" file-category="banner"
              @on-file-change="handleImageChange" :num="1" />
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
import { mapActions } from 'vuex'
import axios from '@/libs/api.request'

export default {
  name: 'page-module-config-update-modal',
  components: { ImageUpload },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    configId: {
      type: Number
    },
    updateCallback: {
      type: Function
    }
  },
  data () {
    return {
      visible: this.value,
      loadingQueryCourse: false,
      loadingUpdate: false,
      param: {},
      imageFile: null,
      courseList: [],
      rule: {
        moduleCode: [
          { type: 'string', required: true, message: '请选择模块', trigger: 'blur' }
        ],
        sortNo: [
          { type: 'number', required: true, message: '排序号不能为空', trigger: 'blur' }
        ],
        title: [
          { type: 'string', required: true, message: '标题不能为空', trigger: 'blur' },
          { type: 'string', min: 2, max: 30, message: '标题应为2-30个字', trigger: 'blur' }
        ],
        intro: [
          { type: 'string', required: true, message: '介绍不能为空', trigger: 'blur' },
          { type: 'string', max: 120, message: '介绍不能超过120个字', trigger: 'blur' }
        ],
        image: [
          { type: 'string', required: true, message: '请上传图片', trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
  },
  methods: {
    ...mapActions([
      'getPageModuleConfigById', 'pageModuleConfigUpdate', 'courseListByTitle'
    ]),
    update () {
      this.loadingUpdate = true
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$Message.warning('信息输入错误!')
          this.loadingUpdate = false
          return
        }
        this.pageModuleConfigUpdate(this.param).then(data => {
          this.visible = false
          this.$Message.success('保存成功!')
          this.updateCallback()
          this.loadingUpdate = false
        }, () => {
          this.loadingUpdate = false
        })
      })
    },
    queryCourse (query) {
      if (query !== '') {
        this.loadingQueryCourse = true
        this.courseListByTitle({ title: query }).then(data => {
          this.courseList = data
          this.loadingQueryCourse = false
        }, () => {
          this.loadingQueryCourse = false
        })
      } else {
        this.courseList = []
      }
    },
    handleCourseChange (val) {
      let course = this.getCourse(val)
      if (course) {
        this.param.title = course.title
        this.param.intro = course.intro
        this.param.image = course.cover
        this.imageFile = { fileKey: course.cover, fileUrl: course.coverUrl }
      }
    },
    handleImageChange (file) {
      this.param.image = file && file.fileKey
    },
    loadConfig () {
      let loadMsg = this.$Message.loading('正在加载中...', 0)
      let configId = this.configId
      this.getPageModuleConfigById({ pageModuleConfigId: configId }).then(data => {
        loadMsg()
        this.param = data
        this.imageFile = { fileKey: data.image, fileUrl: data.imageUrl }
        this.visible = true
      })
    },
    getCourse (id) {
      let arr = this.courseList
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          return arr[i]
        }
      }
    },
    loadCourseList () {
      let self = this
      axios.request({
        url: '/course/list',
        method: 'get'
      }).then(function (res) {
        self.courseList = res.data
      }).catch(function (e) {})
    }
  },
  watch: {
    value (val) {
      if (val === true) {
        this.loadConfig()
        this.loadCourseList()
      } else {
        this.visible = val
        this.$refs.form.resetFields()
        this.$refs.imageUpload.clearImage()
      }
    },
    visible (val) {
      this.$emit('input', val)
    }
  }
}
</script>
