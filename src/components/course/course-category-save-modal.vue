<template>
  <Modal title="课程分类添加" v-model="visible">
    <Form ref="courseCategoryForm" class="form" :label-width="100"
        :model="courseCategoryParam" :rules="courseCategoryRule" >
      <Row>
        <Col :span="16" >
          <Form-item label="名称" prop="name">
            <Input v-model="courseCategoryParam.name" />
          </Form-item>
        </Col>
        <Col :span="16" >
          <Form-item label="课程大类" prop="parentId">
            <Select v-model.number="courseCategoryParam.parentId"
              @on-change="handleCategory">
              <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </Form-item>
        </Col>
         <Col :span="16" >
          <Form-item label="排序号" prop="sortNo">
            <Input type="number" v-model.number="courseCategoryParam.sortNo" placeholder="影响网站显示顺序" />
          </Form-item>
        </Col>
        <div v-show="showProfessionScope">
          <Col :span="20" >
            <Form-item label="该专业可从事的岗位 / 课程" prop="canListId">
              <Select v-model="courseCategoryParam.canIdList" multiple filterable >
                <Option v-for="item in courseList" :value="item.id"
                  :key="item.id">{{ item.title }}</Option>
              </Select>
            </Form-item>
          </Col>
          <Col :span="20" >
            <Form-item label="跨专业可从事的岗位 / 课程" prop="crossListId">
              <Select v-model="courseCategoryParam.crossIdList" multiple filterable >
                <Option v-for="item in courseList" :value="item.id"
                  :key="item.id">{{ item.title }}</Option>
              </Select>
            </Form-item>
          </Col>
          <Col :span="20" >
            <Form-item label="不限专业可从事的岗位 / 课程" prop="unlimitedListId">
              <Select v-model="courseCategoryParam.unlimitedIdList" multiple filterable >
                <Option v-for="item in courseList" :value="item.id"
                  :key="item.id">{{ item.title }}</Option>
              </Select>
            </Form-item>
          </Col>
        </div>
        <div v-show="showCourseSelect">
          <Col :span="20" >
            <Form-item label="课程" prop="canListId">
              <Select v-model="courseCategoryParam.courseIdList" multiple filterable >
                <Option v-for="item in courseList" :value="item.id"
                  :key="item.id">{{ item.title }}</Option>
              </Select>
            </Form-item>
          </Col>
        </div>
      </Row>
    </Form>
    <div slot="footer">
      <Button type="text" size="large" @click="visible=false">取消</Button>
      <Button type="primary" size="large" :loading="loadingSave" @click="save">保存</Button>
    </div>
  </Modal>
</template>
<script>
import { mapActions } from 'vuex'
import axios from '@/libs/api.request'

export default {
  name: 'course-category-save-modal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    courseCategoryId: {
      type: Number
    },
    saveCallback: {
      type: Function
    }
  },
  data () {
    return {
      visible: this.value,
      loadingSave: false,
      showProfessionScope: false,
      showCourseSelect: false,
      courseCategoryParam: {},
      categoryList: [],
      courseList: [],
      courseCategoryRule: {
        name: [
          { type: 'string', required: true, message: '名称不能为空', trigger: 'blur' },
          { type: 'string', min: 2, max: 30, message: '名称应为2-30个字', trigger: 'blur' }
        ],
        sortNo: [
          { type: 'number', required: true, message: '排序号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
    this.courseCategoryBigList().then(data => {
      this.categoryList = data
    })
  },
  methods: {
    ...mapActions([
      'courseCategoryBigList',
      'courseCategorySave'
    ]),
    save () {
      let self = this
      self.loadingSave = true
      self.$refs.courseCategoryForm.validate((valid) => {
        if (!valid) {
          self.$Message.warning('信息输入错误!')
          self.loadingSave = false
          return
        }
        this.courseCategorySave(this.courseCategoryParam).then(data => {
          self.visible = false
          self.$Message.success('保存成功!')
          self.saveCallback()
          self.loadingSave = false
        }, () => {
          self.loadingSave = false
        })
      })
    },
    handleCategory (val) {
      if (!val) {
        this.courseCategoryParam.praentId = null
        return
      }
      this.showProfessionScope = this.getCategoryCode(val) === 'profession'
      this.showCourseSelect = this.getCategoryCode(val) !== 'profession'
    },
    getCategoryCode (id) {
      let arr = this.categoryList
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          return arr[i].code
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
      this.visible = val
      if (val !== true) {
        this.$refs.courseCategoryForm.resetFields()
        this.showProfessionScope = false
        this.showCourseSelect = false
        this.courseCategoryParam.canIdList = []
        this.courseCategoryParam.crossIdList = []
        this.courseCategoryParam.unlimitedListId = []
        this.courseCategoryParam.courseIdList = []
      } else {
        this.loadCourseList()
      }
    },
    visible (val) {
      this.$emit('input', val)
    }
  }
}
</script>
