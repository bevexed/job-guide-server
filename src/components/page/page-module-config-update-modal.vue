<template>
  <Modal title="网站页面配置修改" v-model="visible">
    <Form ref="form" class="form" :label-width="80"
        :model="param" :rules="rule" >
      <Row>
        <Col :span="11" >
          <Form-item label="模块" prop="moduleCode">
            <Select v-model="param.moduleCode" disabled>
              <Option value="home_page_banner">首页Banner</Option>
              <Option value="home_page_hot">热门视频</Option>
              <Option value="home_page_develop">发展之路</Option>
              <Option value="home_page_profession">职业菜单</Option>
              <Option value="develop_banner">发展之路Banner</Option>
              <Option value="profession_banner">职业菜单Banner</Option>
              <Option value="mobile_home_page_banner">移动端首页Banner</Option>
              <Option value="mobile_develop_banner">移动端发展之路Banner</Option>
              <Option value="mobile_profession_banner">移动端职业菜单Banner</Option>
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
        <Col :span="12">
          <Form-item label="课程" prop="courseId" >
            <Select v-model.number="param.courseId" filterable clearable
              @on-change="handleCourseChange">
              <Option v-for="item in courseList" :value="item.id"
                :key="item.id">{{ item.title }}</Option>
            </Select>
            <!-- <Select v-model.number="param.courseId" filterable remote clear
                :remote-method="queryCourse" @on-change="handleCourseChange"
                :loading="loadingQueryCourse">
                <Option v-for="(option, index) in courseList"
                  :value="option.id" :key="index">{{option.title}}</Option>
            </Select> -->

          </Form-item>
        </Col>
        <Col :span="11" style="line-height: 32px; text-align: center; color: red;">
          选择课程，可以填充下面课程信息
        </Col>
        <Col :span="22" >
          <Form-item label="标题" prop="title">
            <Input v-model="param.title" />
          </Form-item>
        </Col>
        <Col :span="22" >
          <Form-item label="介绍" prop="intro">
            <Input v-model="param.intro" type="textarea" :autosize="{minRows: 2,maxRows: 3}" />
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
