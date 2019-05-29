<template>
  <div class="list">
    <Card>
      <div class="search" @keyup.enter="search">
        <Form :label-width="70" :show-message="false">
          <Row :gutter="10">
            <Col :xs="12" :sm="8" :md="6">
              <Form-item label="手机号" prop="mobile" :label-width="50">
                  <Input placeholder="支持模糊搜索" name="mobile" v-model="queryParam.mobile"></Input>
              </Form-item>
            </Col>
            <Col :xs="12" :sm="8" :md="6">
              <Form-item label="账号" prop="account" :label-width="50">
                <Input name="account" v-model="queryParam.account"></Input>
              </Form-item>
            </Col>
            <Col :xs="12" :sm="8" :md="6">
              <Form-item label="是否会员" prop="vipFlag">
                <Select v-model="queryParam.vipFlag" clearable placeholder="全部">
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
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
      <tables ref="tables" :tableColumns="title" :reload="reload" listUrl="user/listPage"
        class="compact" :params="queryParam" :onLoading="onLoading" />
    </Card>
    <user-detail-modal :userId="userId" v-model="showUserDetailModal" />
    <user-promo-generate-modal :userId="userId" :generateCallback="search"
      v-model="showUserPromoGenerateModal" />
  </div>
</template>
<script>
import dayjs from 'dayjs'
import numeral from 'numeral'
import axios from '@/libs/api.request'
import Tables from '_c/common/tables'
import UserDetailModal from '_c/user/user-detail-modal'
import UserPromoGenerateModal from '_c/user/user-promo-generate-modal'
export default {
  name: 'user_list',
  components: {
    Tables, UserDetailModal, UserPromoGenerateModal
  },
  data () {
    return {
      reload: 0,
      searchLoading: false,
      queryParam: {
      },
      userId: null,
      showUserDetailModal: false,
      showUserPromoGenerateModal: false,
      title: [
        {
          title: '手机号',
          width: 95,
          key: 'mobile',
          align: 'center'
        },
        {
          title: '账号',
          key: 'account'
        },
        {
          title: '是否会员',
          width: 70,
          align: 'center',
          render: (h, { row }) => {
            return h('span', row.vipFlag ? '是' : '否')
          }
        },
        {
          title: '注册时间',
          align: 'center',
          width: 120,
          render: (h, { row }) => {
            return h('span', dayjs(row.gmtCreate).format('YYYY-MM-DD HH:mm'))
          }
        },
        {
          title: '账号余额',
          width: 75,
          key: 'accountBalance',
          align: 'right',
          render: (h, { row }) => {
            return h('span', numeral(row.accountBalance).format('0,0.00'))
          }
        },
        {
          title: '优惠码',
          key: 'promoCode'
        },
        {
          title: '优惠码金额',
          width: 85,
          align: 'right',
          render: (h, { row }) => {
            return h('span', numeral(row.promoPrice).format('0,0.00'))
          }
        },
        {
          title: '优惠码有效时间',
          align: 'center',
          width: 120,
          render: (h, { row }) => {
            if (row.gmtPromoStart && row.gmtPromoEnd) {
              return h('div', [
                h('span', dayjs(row.gmtPromoStart).format('YYYY-MM-DD HH:mm')),
                // h('span', ' - '),
                h('span', dayjs(row.gmtPromoEnd).format('YYYY-MM-DD HH:mm'))
              ])
            }
            return h('span', '-')
          }
        },
        {
          title: '优惠码状态',
          width: 85,
          align: 'center',
          render: (h, { row }) => {
            let color = row.promoStatus === 'disabled' ? 'red' : ''
            return h('span', { style: { color: color } }, row.promoStatusText)
          }
        },
        {
          title: '操作',
          width: 130,
          align: 'center',
          render: (h, { row }) => {
            let divider = h('Divider', { props: { type: 'vertical' } })
            let promoStatusBtn = null
            if (row.promoCode) {
              if (row.promoStatus === 'enabled') {
                promoStatusBtn = h('a', { on: { click: () => { this.onPromoDisabled(row) } } }, '禁用优惠码')
              } else {
                promoStatusBtn = h('a', { on: { click: () => { this.onPromoEnabled(row) } } }, '启用优惠码')
              }
            }
            return h('div', [
              h('a', { on: { click: () => { this.onDetail(row) } } }, '详情'),
              divider,
              h('a', { on: { click: () => { this.onPromoGenerate(row) } } }, '生成优惠码'),
              promoStatusBtn
            ])
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
    onDetail (row) {
      this.showUserDetailModal = true
      this.userId = row.id
    },
    onPromoGenerate (row) {
      this.showUserPromoGenerateModal = true
      this.userId = row.id
    },
    onLoading (loading) {
      this.searchLoading = loading
    },
    onPromoDisabled (row) {
      let self = this
      this.$Modal.confirm({
        title: '提示',
        content: '确定禁用 <b>' + row.mobile + '</b> 的优惠码？',
        width: 300,
        loading: true,
        onOk: () => {
          axios.request({
            url: '/user/promo/disabled',
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
    onPromoEnabled (row) {
      let self = this
      this.$Modal.confirm({
        title: '提示',
        content: '确定启用 <b>' + row.mobile + '</b> 的优惠码？',
        width: 300,
        loading: true,
        onOk: () => {
          axios.request({
            url: '/user/promo/enabled',
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
