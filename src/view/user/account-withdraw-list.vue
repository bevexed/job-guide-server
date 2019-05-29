<template>
  <div class="list">
    <Card>
      <div class="search" @keyup.enter="search">
        <Form :label-width="70" :show-message="false">
          <Row :gutter="10">
            <Col :xs="12" :sm="8" :md="6">
              <Form-item label="手机号" prop="mobile" :label-width="50">
                  <Input name="mobile" v-model="queryParam.mobile"></Input>
              </Form-item>
            </Col>
            <Col :xs="12" :sm="8" :md="6">
              <Form-item label="审核状态" prop="status">
                <Select v-model="queryParam.status" clearable placeholder="全部">
                  <Option value="pending">待审核</Option>
                  <Option value="reject">审核拒绝</Option>
                  <Option value="pass">审核通过</Option>
                  <Option value="success">提现成功</Option>
                </Select>
              </Form-item>
            </Col>
            <Col :xs="12" :sm="8" :md="6">
              <Button type="primary" :loading="searchLoading" :disable="searchLoading" icon="md-search"
                @click="search" >搜索</Button>
            </Col>
          </Row>
        </Form>
      </div>
      <tables class="compact" ref="tables" :tableColumns="title" :reload="reload" listUrl="account/withdraw/listPage"
        :params="queryParam" :onLoading="onLoading" />
    </Card>
    <Modal title="提现成功" v-model="successModal" :scrollable="true" width="380" :styles="{top: '60px'}">
      <Form ref="successForm" :model="successData" :rules="successRule" :label-width="80">
        <Row>
          <i-col :span="22">
            <Form-item label="备注" prop="remark">
              <Input v-model="successData.remark" type="textarea"></Input>
            </Form-item>
          </i-col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="successModal=false">取消</Button>
        <Button type="primary" size="large" :loading="successLoading" :disable="successLoading"
          @click="auditSuccess">提交</Button>
      </div>
    </Modal>

    <Modal title="提现拒绝" v-model="rejectModal" :scrollable="true" width="380" :styles="{top: '60px'}">
      <Form ref="rejectForm" :model="rejectData" :rules="rejectRule" :label-width="80">
        <Row>
          <i-col :span="22">
            <Form-item label="备注" prop="remark">
              <Input v-model="rejectData.remark" type="textarea"></Input>
            </Form-item>
          </i-col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="rejectModal=false">取消</Button>
        <Button type="primary" size="large" :loading="rejectLoading" :disable="rejectLoading"
          @click="auditReject">提交</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
import dayjs from 'dayjs'
import numeral from 'numeral'
import Tables from '_c/common/tables'
import axios from '@/libs/api.request'

export default {
  name: 'account_withdraw_list',
  components: {
    Tables
  },
  data () {
    return {
      reload: 0,
      searchLoading: false,
      queryParam: {
      },
      withdrawNum: null,
      successModal: false,
      successData: {},
      successRule: {
        remark: [
          { type: 'string', required: true, message: '备注不能为空', trigger: 'blur' },
          { type: 'string', max: 120, message: '备注不能超过120个字', trigger: 'blur' }
        ]
      },
      successLoading: false,
      rejectModal: false,
      rejectData: {},
      rejectRule: {
        remark: [
          { type: 'string', required: true, message: '备注不能为空', trigger: 'blur' },
          { type: 'string', max: 120, message: '备注不能超过120个字', trigger: 'blur' }
        ]
      },
      rejectLoading: false,
      title: [
        {
          title: '用户手机号',
          key: 'userMobile',
          align: 'center'
        },
        {
          title: '提现类型',
          key: 'accountTypeText',
          align: 'center'
        },
        {
          title: '真实姓名',
          key: 'realName',
          align: 'center'
        },
        {
          title: '提现账号',
          key: 'account'
        },
        {
          title: '开户行',
          key: 'bankName'
        },
        {
          title: '提现编号',
          key: 'withdrawNum'
        },
        {
          title: '提现金额',
          align: 'right',
          width: 70,
          render: (h, { row }) => {
            return h('span', numeral(row.amount).format('0,0.00'))
          }
        },
        {
          title: '提现申请时间',
          align: 'center',
          width: 90,
          render: (h, { row }) => {
            return h('span', dayjs(row.gmtCreate).format('YYYY-MM-DD HH:mm'))
          }
        },
        {
          title: '审核时间',
          align: 'center',
          width: 90,
          render: (h, { row }) => {
            if (row.gmtAudit) {
              return h('span', dayjs(row.gmtAudit).format('YYYY-MM-DD HH:mm'))
            } else {
              return h('span', '-')
            }
          }
        },
        {
          title: '申请状态',
          width: 70,
          key: 'statusText',
          align: 'center'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          align: 'center',
          width: 110,
          render: (h, { row }) => {
            let btns = []
            if (row.status === 'pending') {
              let passSuccessBtn = h('a', { on: { click: () => { this.onPassSuccess(row) } } }, '提现成功')
              let rejectBtn = h('a', { on: { click: () => { this.onReject(row) } } }, '拒绝')
              let divider = h('Divider', { props: { type: 'vertical' } })
              btns = [ passSuccessBtn, divider, rejectBtn ]
            }
            return h('div', btns)
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
    onLoading (loading) {
      this.searchLoading = loading
    },
    onPassSuccess (row) {
      this.successModal = true
      this.withdrawNum = row.withdrawNum
    },
    onReject (row) {
      this.rejectModal = true
      this.withdrawNum = row.withdrawNum
    },
    auditSuccess () {
      let self = this
      self.successLoading = true
      self.$refs.successForm.validate((valid) => {
        if (!valid) {
          self.$Message.warning('信息输入错误!')
          self.successLoading = false
          return
        }
        axios.request({
          url: '/account/withdraw/audit/success',
          data: { withdrawNum: self.withdrawNum, remark: self.successData.remark },
          method: 'post'
        }).then(function (res) {
          self.search()
          self.$Message.success('审核拒绝提交成功!')
          self.successLoading = false
          self.successModal = false
        }).catch(function (e) {
          self.successLoading = false
          self.successModal = false
        })
      })
    },
    auditReject () {
      let self = this
      self.rejectLoading = true
      self.$refs.rejectForm.validate((valid) => {
        if (!valid) {
          self.$Message.warning('信息输入错误!')
          self.rejectLoading = false
          return
        }
        axios.request({
          url: '/account/withdraw/audit/reject',
          data: { withdrawNum: self.withdrawNum, remark: self.rejectData.remark },
          method: 'post'
        }).then(function (res) {
          self.search()
          self.$Message.success('审核拒绝提交成功!')
          self.rejectLoading = false
          self.rejectModal = false
        }).catch(function (e) {
          self.rejectLoading = false
          self.rejectModal = false
        })
      })
    }
  },
  watch: {
    rejectModal (val) {
      if (val !== true) {
        this.visible = val
        this.$refs.rejectForm.resetFields()
      }
    },
    successModal (val) {
      if (val !== true) {
        this.visible = val
        this.$refs.successForm.resetFields()
      }
    }
  }
}
</script>
