<template>
  <div class="list">
    <Card>
      <div class="search" @keyup.enter="search">
        <Form :label-width="70" :show-message="false">
          <Row :gutter="10">
            <Col :xs="12" :sm="8" :md="6">
              <Form-item label="模块" prop="moduleCode">
                <Select v-model="queryParam.moduleCode" clearable placeholder="全部">
                  <Option value="home_page_banner">首页Banner</Option>
                  <Option value="home_page_hot">热门视频</Option>
                  <Option value="home_page_develop">发展之路</Option>
                  <Option value="home_page_profession">职业菜单</Option>
                  <Option value="develop_banner">发展之路Banner</Option>
                  <Option value="profession_banner">职业菜单Banner</Option>
                  <Option value="mobile_home_page_banner">移动端首页Banner</Option>
                  <Option value="mobile_develop_banner">移动端发展之路Banner</Option>
                  <Option value="mobile_profession_banner">移动端职业菜单Banner</Option>
                  <Option value="home_page_zhixun">高考咨询Banner</Option>
                </Select>
              </Form-item>
            </Col>
            <Col :xs="12" :sm="8" :md="6">
              <Form-item label="标题" prop="title">
                  <Input placeholder="支持模糊搜索" name="title" v-model="queryParam.title"></Input>
              </Form-item>
            </Col>
            <Col :xs="12" :sm="8" :md="6">
              <Form-item label="状态" prop="status" :label-width="50">
                <Select v-model="queryParam.status" clearable placeholder="全部">
                  <Option value="enabled">启用</Option>
                  <Option value="disabled">禁用</Option>
                </Select>
              </Form-item>
            </Col>
            <Col :xs="12" :sm="8" :md="6">
              <Button type="primary" :loading="searchLoading" :disable="searchLoading" icon="md-search"
                @click="search" >搜索</Button>
              <Button type="primary" style="margin-left: 6px" icon="md-add"
                @click="onSaveConfig" >添加配置</Button>
            </Col>
          </Row>
        </Form>
      </div>
      <tables ref="tables" :tableColumns="title" :reload="reload" listUrl="page/module/config/listPage"
        :params="queryParam" :onLoading="onLoading" />
    </Card>
    <page-module-config-update-modal :configId="configId" :updateCallback="search"
      v-model="showConfigUpdateModal" />
    <page-module-config-save-modal :saveCallback="search" v-model="showConfigSaveModal" />
  </div>
</template>
<script>
import Tables from '_c/common/tables'
import PageModuleConfigUpdateModal from '_c/page/page-module-config-update-modal'
import PageModuleConfigSaveModal from '_c/page/page-module-config-save-modal'
import { mapActions } from 'vuex'
import axios from '@/libs/api.request'

export default {
  name: 'page_module_config_list',
  components: {
    Tables, PageModuleConfigUpdateModal, PageModuleConfigSaveModal
  },
  data () {
    return {
      reload: 0,
      searchLoading: false,
      queryParam: {
      },
      showConfigUpdateModal: false,
      showConfigSaveModal: false,
      configId: null,
      title: [
        {
          title: '模块',
          key: 'moduleCodeText'
        },
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '介绍',
          key: 'intro'
        },
        {
          title: '排序号',
          width: 90,
          key: 'sortNo'
        },
        {
          title: '状态',
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
              h('a', { on: { click: () => { this.onUpdateConfig(row) } } }, '编辑'),
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
  },
  methods: {
    ...mapActions([
    ]),
    search () {
      this.reload = new Date().getTime()
    },
    onUpdateCourseCategory (row) {
      this.showCourseCategoryUpdateModal = true
      this.courseCategoryId = row.id
    },
    onSaveConfig () {
      this.showConfigSaveModal = true
    },
    onUpdateConfig (row) {
      this.configId = row.id
      this.showConfigUpdateModal = true
    },
    onLoading (loading) {
      this.searchLoading = loading
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
            url: '/page/module/config/disabled',
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
            url: '/page/module/config/enabled',
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
