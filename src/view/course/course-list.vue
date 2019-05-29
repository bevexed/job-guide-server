<template>
  <div class="list">
    <Card>
      <div class="search" @keyup.enter="search">
        <Form :label-width="70" :show-message="false">
          <Row :gutter="10">
            <Col :xs="12" :sm="8" :md="6">
              <Form-item label="标题" prop="title">
                  <Input placeholder="支持模糊搜索" name="title" v-model="queryParam.title"></Input>
              </Form-item>
            </Col>
            <Col :xs="12" :sm="8" :md="6">
              <Form-item label="是否免费" prop="freeFlag">
                <Select v-model="queryParam.freeFlag" clearable
                  placeholder="全部">
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
                </Select>
              </Form-item>
            </Col>
            <Col :xs="12" :sm="8" :md="6">
              <Form-item label="状态" prop="status" :label-width="50">
                <Select v-model="queryParam.status" clearable placeholder="全部">
                  <Option value="enabled">启用</Option>
                  <Option value="disabled">禁用</Option>
                  <Option value="disabled">禁用</Option>
                </Select>
              </Form-item>
            </Col>
            <Col :md="6">
              <Button type="primary" :loading="searchLoading" :disable="searchLoading" icon="md-search"
                @click="search" >搜索</Button>
              <Button type="primary" style="margin-left: 6px" icon="md-add"
                @click="onSaveCourse" >添加课程</Button>
            </Col>
          </Row>
        </Form>
      </div>
      <tables ref="tables" :tableColumns="title" :reload="reload" listUrl="course/listPage"
        :params="queryParam" :onLoading="onLoading" />
    </Card>
    <course-update-modal :courseId="courseId" :updateCallback="search" v-model="showCourseUpdateModal" />
    <course-save-modal :saveCallback="search" v-model="showCourseSaveModal" />
  </div>
</template>
<script>
import dayjs from 'dayjs'
import Tables from '_c/common/tables'
import CourseUpdateModal from '_c/course/course-update-modal'
import CourseSaveModal from '_c/course/course-save-modal'
import { mapActions } from 'vuex'
import axios from '@/libs/api.request'

export default {
  name: 'course_list',
  components: {
    Tables, CourseUpdateModal, CourseSaveModal
  },
  data () {
    return {
      reload: 0,
      searchLoading: false,
      queryParam: {
      },
      categoryList: [],
      courseId: null,
      showCourseUpdateModal: false,
      showCourseSaveModal: false,
      title: [
        {
          title: '编号',
          key: 'id',
          width: 60
        },
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '是否免费',
          width: 85,
          align: 'center',
          render: (h, { row }) => {
            return h('span', row.freeFlag ? '是' : '否')
          }
        },
        {
          title: '播放次数',
          width: 85,
          key: 'playCount',
          align: 'right'
        },
        {
          title: '创建时间',
          align: 'center',
          width: 135,
          render: (h, { row }) => {
            return h('span', dayjs(row.gmtCreate).format('YYYY-MM-DD HH:mm'))
          }
        },
        {
          title: '课程状态',
          align: 'center',
          width: 90,
          render: (h, { row }) => {
            let color = row.status === 'disabled' ? 'red' : ''
            return h('span', { style: { color: color } }, row.statusText)
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 110,
          render: (h, { row }) => {
            let statusBtn = null
            if (row.status === 'enabled') {
              statusBtn = h('a', { on: { click: () => { this.onDisabled(row) } } }, '禁用')
            } else {
              statusBtn = h('a', { on: { click: () => { this.onEnabled(row) } } }, '启用')
            }
            return h('div', [
              h('a', { on: { click: () => { this.onUpdateCourse(row) } } }, '编辑'),
              h('Divider', {
                props: {
                  type: 'vertical'
                }
              }),
              statusBtn
            ])
          }
        }
      ]
    }
  },
  mounted: function () {
  },
  created: function () {
    this.courseCategoryBigList().then(data => {
      this.categoryList = data
    })
  },
  methods: {
    ...mapActions([
      'courseCategoryBigList'
    ]),
    search () {
      this.reload = new Date().getTime()
    },
    onSaveCourse () {
      this.showCourseSaveModal = true
    },
    onLoading (loading) {
      this.searchLoading = loading
    },
    onUpdateCourse (row) {
      let self = this
      self.showCourseUpdateModal = true
      self.courseId = row.id
    },
    onDisabled (row) {
      let self = this
      this.$Modal.confirm({
        title: '提示',
        content: '确定禁用 <b>' + row.title + '</b> ？',
        width: 300,
        loading: true,
        onOk: () => {
          axios.request({
            url: '/course/disabled',
            data: { id: row.id },
            method: 'post'
          }).then(function (res) {
            self.search()
            self.$Message.success('禁用成功!')
            self.$Modal.remove()
          }).catch(function (e) {})
        }
      })
    },
    onEnabled (row) {
      let self = this
      this.$Modal.confirm({
        title: '提示',
        content: '确定启用 <b>' + row.title + '</b> ？',
        width: 300,
        loading: true,
        onOk: () => {
          axios.request({
            url: '/course/enabled',
            data: { id: row.id },
            method: 'post'
          }).then(function (res) {
            self.search()
            self.$Message.success('启用成功!')
            self.$Modal.remove()
          }).catch(function (e) {})
        }
      })
    }
  }
}
</script>
