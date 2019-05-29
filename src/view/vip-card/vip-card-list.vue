<template>
  <div class="list">
    <Card>
      <div class="search" @keyup.enter="search">
        <Form :label-width="70" :show-message="false">
          <Row :gutter="10">
            <Col :xs="12" :sm="8" :md="6">
              <Form-item label="账号" prop="account" :label-width="50">
                <Input name="account" v-model="queryParam.account" />
              </Form-item>
            </Col>
            <Col :xs="12" :sm="8" :md="6">
              <Form-item label="是否激活" prop="activationFlag">
                <Select v-model="queryParam.activationFlag" clearable placeholder="全部">
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
                </Select>
              </Form-item>
            </Col>
            <Col :xs="12" :sm="8" :md="8">
              <Button type="primary" :loading="searchLoading" :disable="searchLoading" icon="md-search"
                @click="search" >搜索</Button>
              <Button type="primary" style="margin-left: 6px"
                @click="generatorModal = true" >批量生成会员卡</Button>
            </Col>
          </Row>
        </Form>
      </div>
      <tables ref="tables" :tableColumns="title" :reload="reload" listUrl="vip/card/listPage"
        :params="queryParam" :onLoading="onLoading" />
    </Card>

    <Modal title="生成会员卡" v-model="generatorModal" :scrollable="true" width="350" :styles="{top: '60px'}">
      <Form ref="generatorForm" :model="generatorData" :rules="generatorRule" :label-width="80">
        <Row>
          <i-col :span="22">
            <Form-item label="数量" prop="size">
              <Input v-model.number="generatorData.size" type="number" />
            </Form-item>
          </i-col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="generatorModal=false">取消</Button>
        <Button type="primary" size="large" :loading="exportLoading" :disable="exportLoading"
          @click="exportExcel">生成</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import Tables from '_c/common/tables'
import axios from '@/libs/api.request'

export default {
  name: 'user_list',
  components: {
    Tables
  },
  data () {
    return {
      reload: 0,
      searchLoading: false,
      exportLoading: false,
      queryParam: {
      },
      generatorModal: false,
      formLoading: false,
      generatorRule: {
        size: [
          { type: 'number', required: true, message: '数量不能为空', trigger: 'blur' },
          { type: 'number', min: 1, max: 1000, message: '数量应为 1 - 1000 之间', trigger: 'blur' }
        ]
      },
      generatorData: {},
      title: [
        {
          title: '账号',
          key: 'account'
        },
        {
          title: '是否激活',
          align: 'center',
          width: 100,
          render: (h, { row }) => {
            return h('span', row.activationFlag ? '是' : '否')
          }
        },
        {
          title: '生成时间',
          align: 'center',
          width: 135,
          render: (h, { row }) => {
            return h('span', dayjs(row.gmtCreate).format('YYYY-MM-DD HH:mm'))
          }
        },
        {
          title: '激活时间',
          align: 'center',
          width: 135,
          render: (h, { row }) => {
            return h('span', dayjs(row.gmtActivation).format('YYYY-MM-DD HH:mm'))
          }
        }
      ]
    }
  },
  mounted: function () {
  },
  methods: {
    search () {
      this.reload = new Date().getTime()
    },
    exportExcel () {
      let self = this
      self.exportLoading = true
      self.$refs.generatorForm.validate((valid) => {
        if (!valid) {
          self.$Message.warning('信息输入错误!')
          self.exportLoading = false
          return
        }
        axios.request({
          url: '/vip/card/batchCreate',
          responseType: 'arraybuffer',
          params: { size: self.generatorData.size },
          method: 'get'
        }).then(function (res) {
          let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = '会员卡账号导出.xlsx'
          link.click()
          self.exportLoading = false
          self.search()
          self.generatorModal = false
        }).catch(function (e) {
          self.exportLoading = false
          self.generatorModal = false
        })
      })
    },
    onLoading (loading) {
      this.searchLoading = loading
    }
  }
}
</script>
