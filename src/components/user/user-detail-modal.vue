<template>
  <Modal title="用户相关信息" v-model="visible" width="800" :footer-hide="true">
    <Tabs v-model="currentTab" :animated="false">
      <TabPane label="邀请注册列表" name="registerTab">
        <tables :initLoading="false" ref="registerTables" :tableColumns="registerTitle" listUrl="user/inviter/listPage"
          :params="registerQueryParam" :routerReplace="false"/>
      </TabPane>
      <TabPane label="邀请购买会员列表" name="orderTab">
        <tables :initLoading="false" ref="orderTables" :tableColumns="orderTitle" listUrl="order/inviter/listPage"
          :params="orderQueryParam" :routerReplace="false"/>
      </TabPane>
      <TabPane label="优惠码推荐购买列表" name="promoTab">
        <tables :initLoading="false" ref="promoTables" :tableColumns="promoTitle" listUrl="order/promoInviter/listPage"
          :params="promoQueryParam" :routerReplace="false"/>
      </TabPane>
      <TabPane label="资金变动列表" name="fundsTab">
        <tables :initLoading="false" ref="fundsTables" :tableColumns="fundsTitle" listUrl="account/funds/record/listPage"
          :params="fundsQueryParam" :routerReplace="false"/>
      </TabPane>
    </Tabs>
  </Modal>
</template>
<script>
import dayjs from 'dayjs'
import numeral from 'numeral'
import Tables from '_c/common/tables'
export default {
  name: 'user-detail-modal',
  components: {
    Tables
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Number
    }
  },
  data () {
    return {
      visible: this.value,
      currentTab: 'registerTab',
      registerQueryParam: {
        inviterId: this.userId
      },
      registerTitle: [
        {
          title: '编号',
          key: 'id',
          width: 80
        },
        {
          title: '手机号',
          key: 'mobile',
          align: 'center'
        },
        {
          title: '是否会员',
          align: 'center',
          render: (h, { row }) => {
            return h('span', row.vipFlag ? '是' : '否')
          }
        },
        {
          title: '注册时间',
          align: 'center',
          width: 135,
          render: (h, { row }) => {
            return h('span', dayjs(row.gmtCreate).format('YYYY-MM-DD HH:mm'))
          }
        }
      ],
      orderQueryParam: {
        inviterId: this.userId
      },
      orderTitle: [
        {
          title: '订单编号',
          key: 'orderNum'
        },
        {
          title: '用户手机号',
          key: 'userMobile',
          align: 'center'
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
          title: '支付金额',
          width: 90,
          align: 'right',
          render: (h, { row }) => {
            return h('span', numeral(row.payAmount).format('0,0.00'))
          }
        },
        {
          title: '支付时间',
          align: 'center',
          width: 135,
          render: (h, { row }) => {
            return h('span', dayjs(row.gmtPay).format('YYYY-MM-DD HH:mm'))
          }
        }
      ],
      promoQueryParam: {
        promoInviterId: this.userId
      },
      promoTitle: [
        {
          title: '订单编号',
          key: 'orderNum'
        },
        {
          title: '用户手机号',
          key: 'userMobile',
          align: 'center'
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
          title: '支付金额',
          width: 90,
          align: 'right',
          render: (h, { row }) => {
            return h('span', numeral(row.payAmount).format('0,0.00'))
          }
        },
        {
          title: '支付时间',
          align: 'center',
          width: 135,
          render: (h, { row }) => {
            return h('span', dayjs(row.gmtPay).format('YYYY-MM-DD HH:mm'))
          }
        }
      ],
      fundsQueryParam: {
        userId: this.userId
      },
      fundsTitle: [
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '业务编号',
          key: 'businessNum'
        },
        {
          title: '触发时间',
          align: 'center',
          width: 135,
          render: (h, { row }) => {
            return h('span', dayjs(row.gmtCreate).format('YYYY-MM-DD HH:mm'))
          }
        },
        {
          title: '金额',
          key: 'amount',
          width: 90,
          align: 'right',
          render: (h, { row }) => {
            return h('span', numeral(row.amount).format('0,0.00'))
          }
        }
      ]
    }
  },
  created: function () {
  },
  methods: {
  },
  watch: {
    value (val) {
      this.visible = val
      if (val === true) {
        this.currentTab = 'registerTab'
      } else {
        this.$refs.registerTables.clearData()
        this.$refs.orderTables.clearData()
        this.$refs.fundsTables.clearData()
        this.$refs.promoTables.clearData()
      }
    },
    visible (val) {
      this.$emit('input', val)
    },
    currentTab (val) {
      if (val === 'registerTab') {
        this.registerQueryParam.inviterId = this.userId
        this.$refs.registerTables.search()
      } else if (val === 'orderTab') {
        this.orderQueryParam.inviterId = this.userId
        this.$refs.orderTables.search()
      } else if (val === 'fundsTab') {
        this.fundsQueryParam.userId = this.userId
        this.$refs.fundsTables.search()
      } else if (val === 'promoTab') {
        this.promoQueryParam.promoInviterId = this.userId
        this.$refs.promoTables.search()
      }
    }
  }
}
</script>
 <style lang="less">
  .ivu-modal-body {
    padding-top: 8px;
  }
 </style>
