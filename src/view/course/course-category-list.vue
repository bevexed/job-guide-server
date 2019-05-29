<template>
  <div class="list">
    <Card>
      <div class="search" @keyup.enter="search">
        <Form :label-width="70" :show-message="false">
          <Row :gutter="10">
            <Col :xs="12" :sm="8" :md="6">
              <Form-item label="课程大类" prop="parentId">
                <Select v-model="queryParam.parentId" clearable>
                  <Option v-for="item in categoryList"
                    :value="item.id + ''" :key="item.id">{{ item.name }}</Option>
                </Select>
              </Form-item>
            </Col>
            <Col :xs="12" :sm="8" :md="6">
              <Button type="primary" :loading="searchLoading" :disable="searchLoading" icon="md-search"
                @click="search" >搜索</Button>
              <Button type="primary" style="margin-left: 6px" icon="md-add"
                @click="onSaveCourseCategory" >添加类型</Button>
            </Col>
          </Row>
        </Form>
      </div>
      <tables ref="tables" :tableColumns="title" :reload="reload" listUrl="course/category/listPage"
        :params="queryParam" :onLoading="onLoading" />
    </Card>
    <course-category-update-modal :courseCategoryId="courseCategoryId" :updateCallback="search"
      v-model="showCourseCategoryUpdateModal" />
    <course-category-save-modal :saveCallback="search" v-model="showCourseCategorySaveModal" />
  </div>
</template>
<script>
import Tables from '_c/common/tables'
import CourseCategoryUpdateModal from '_c/course/course-category-update-modal'
import CourseCategorySaveModal from '_c/course/course-category-save-modal'
import { mapActions } from 'vuex'
import axios from '@/libs/api.request'

export default {
  name: 'course_category_list',
  components: {
    Tables, CourseCategoryUpdateModal, CourseCategorySaveModal
  },
  data () {
    return {
      reload: 0,
      searchLoading: false,
      queryParam: {
      },
      categoryList: [],
      showCourseCategoryUpdateModal: false,
      showCourseCategorySaveModal: false,
      courseCategoryId: null,
      title: [
        {
          title: '类型名称',
          key: 'name'
        },
        {
          title: '大类名称',
          key: 'parentName',
          render: (h, { row }) => {
            return h('span', row.parentName || '-')
          }
        },
        {
          title: '排序号',
          key: 'sortNo'
        },
        {
          title: '状态',
          align: 'center',
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
              h('a', { on: { click: () => { this.onUpdateCourseCategory(row) } } }, '编辑'),
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
    onUpdateCourseCategory (row) {
      this.showCourseCategoryUpdateModal = true
      this.courseCategoryId = row.id
    },
    onSaveCourseCategory () {
      this.showCourseCategorySaveModal = true
    },
    onLoading (loading) {
      this.searchLoading = loading
    },
    onDisabled (row) {
      let self = this
      this.$Modal.confirm({
        title: '提示',
        content: '确定禁用 <b>' + row.name + '</b> ？',
        width: 300,
        loading: true,
        onOk: () => {
          axios.request({
            url: '/course/category/disabled',
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
        content: '确定启用 <b>' + row.name + '</b> ？',
        width: 300,
        loading: true,
        onOk: () => {
          axios.request({
            url: '/course/category/enabled',
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
