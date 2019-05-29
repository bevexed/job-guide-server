<template>
  <div class="list">
    <Card>
      <div class="search" @keyup.enter="search">
        <Form :label-width="70" :show-message="false">
          <Row :gutter="10">
            <Col :xs="12" :sm="8" :md="6">
              <Form-item label="用户手机号" :label-width="80">
                  <Input placeholder="支持模糊搜索" name="mobile"
                    v-model="queryParam.userMobile"></Input>
              </Form-item>
            </Col>
            <Col :xs="12" :sm="8" :md="6">
              <Form-item label="支付状态" >
                <Select v-model="queryParam.payStatus" clearable placeholder="全部">
                  <Option value="unpaid">未付款</Option>
                  <Option value="paid">已付款</Option>
                </Select>
              </Form-item>
            </Col>
            </Col>
            <Col :xs="12" :sm="8" :md="6">
              <Button type="primary" :loading="searchLoading" :disable="searchLoading" icon="md-search"
                @click="search" >搜索</Button>
            </Col>
          </Row>
        </Form>
      </div>
      <tables ref="tables" :tableColumns="title" :reload="reload" listUrl="order/listPage"
        :params="queryParam" :onLoading="onLoading" />
    </Card>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import numeral from 'numeral'
import Tables from '_c/common/tables'
export default {
  name: 'user_list',
  components: {
    Tables
  },
  data () {
    return {
      reload: 0,
      searchLoading: false,
      queryParam: {
      },
      title: [
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
          title: '优惠码金额',
          width: 100,
          align: 'right',
          render: (h, { row }) => {
            return h('span', numeral(row.promoPrice).format('0,0.00'))
          }
        },
        {
          title: '优惠券金额',
          width: 100,
          align: 'right',
          render: (h, { row }) => {
            return h('span', numeral(row.couponPrice).format('0,0.00'))
          }
        },
        {
          title: '订单金额',
          width: 90,
          align: 'right',
          render: (h, { row }) => {
            return h('span', numeral(row.amount).format('0,0.00'))
          }
        },
        {
          title: '支付时间',
          align: 'center',
          width: 135,
          render: (h, { row }) => {
            if (row.gmtPay) {
              return h('span', dayjs(row.gmtPay).format('YYYY-MM-DD HH:mm'))
            } else {
              return h('span', '-')
            }
          }
        },
        {
          title: '订单状态',
          key: 'payStatusText',
          align: 'center'
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
    }
  }
}
</script>
