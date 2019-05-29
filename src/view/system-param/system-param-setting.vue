<template>
  <div class="list">
    <Card>
      <Form ref="form" :label-width="100" :show-message="false">
        <Form-item label="会员价格：" prop="vipPrice">
          <Row>
            <Col span="3">
              <p v-show="!editVipPrice">{{ vipPrice }}</p>
              <Input v-show="editVipPrice" name="vipPrice" v-model.number="vipPrice" />
            </Col>
            <Col span="6">
              <Button v-show="!editVipPrice" @click="editVipPrice=true" style="margin: 0 6px;">修改</Button>
              <Button v-show="editVipPrice" type="primary" @click="updateVipPrice()"
                :loading="loadingUpdateVipPrice"
                style="margin: 0 6px;">保存</Button>
              <Button v-show="editVipPrice" @click="editVipPrice=false">取消</Button>
            </Col>
          </Row>
        </Form-item>
        <Form-item label="分享奖金：" prop="shareBonus">
          <Row>
            <Col span="3">
              <p v-show="!editShareBonus">{{ shareBonus }}</p>
              <Input v-show="editShareBonus" name="shareBonus" v-model.number="shareBonus" />
            </Col>
            <Col span="6">
              <Button v-show="!editShareBonus" @click="editShareBonus=true" style="margin: 0 6px;">修改</Button>
              <Button v-show="editShareBonus" type="primary" @click="updateShareBonus()"
                :loading="loadingUpdateShareBouns"
                style="margin: 0 6px;">保存</Button>
              <Button v-show="editShareBonus" @click="editShareBonus=false">取消</Button>
            </Col>
          </Row>
        </Form-item>
        <Form-item label="优惠券金额：" prop="couponPrice">
          <Row>
            <Col span="3">
              <p v-show="!editCouponPrice">{{ couponPrice }}</p>
              <Input v-show="editCouponPrice" name="couponPrice" v-model.number="couponPrice" />
            </Col>
            <Col span="6">
              <Button v-show="!editCouponPrice" @click="editCouponPrice=true" style="margin: 0 6px;">修改</Button>
              <Button v-show="editCouponPrice" type="primary" @click="updateCouponPrice()"
                :loading="loadingUpdateCouponPrice"
                style="margin: 0 6px;">保存</Button>
              <Button v-show="editCouponPrice" @click="editCouponPrice=false">取消</Button>
            </Col>
          </Row>
        </Form-item>
      </Form>
    </Card>
  </div>
</template>
<script>
import axios from '@/libs/api.request'

export default {
  name: 'system_param_setting',
  components: {
  },
  data () {
    return {
      editVipPrice: false,
      editShareBonus: false,
      editCouponPrice: false,
      loadingUpdateVipPrice: false,
      loadingUpdateShareBouns: false,
      loadingUpdateCouponPrice: false,
      vipPrice: null,
      shareBonus: null,
      couponPrice: null
    }
  },
  mounted () {
    this.initSystemParam()
  },
  methods: {
    initSystemParam () {
      let self = this
      axios.request({
        url: '/system/param/list',
        method: 'get'
      }).then(res => {
        let data = res.data
        for (let i = 0; i < data.length; i++) {
          if (data[i].code === 'vip_price') {
            self.vipPrice = data[i].value
          } else if (data[i].code === 'share_bonus') {
            self.shareBonus = data[i].value
          } else if (data[i].code === 'coupon_price') {
            self.couponPrice = data[i].value
          }
        }
      })
    },
    updateVipPrice () {
      let self = this
      let vipPrice = self.vipPrice
      if (!/^\d*$/.test(vipPrice) || parseInt(vipPrice) < 1 || parseInt(vipPrice) > 999) {
        self.$Message.error('会员价格应为 1 - 999 整数！')
        return
      }
      self.loadingUpdateVipPrice = true
      axios.request({
        url: '/system/param/update',
        data: {
          'code': 'vip_price',
          'value': self.vipPrice
        },
        method: 'post'
      }).then(() => {
        self.editVipPrice = false
        self.loadingUpdateVipPrice = false
        self.$Message.info('修改成功')
      }).catch(() => {
        self.loadingUpdateVipPrice = false
      })
    },
    updateShareBonus () {
      let self = this
      let shareBonus = self.shareBonus
      if (!/^\d+$/.test(shareBonus) || parseInt(shareBonus) < 0 || parseInt(shareBonus) > 999) {
        self.$Message.error('分享奖金应为 0 - 999 整数！')
        return
      }
      self.loadingUpdateShareBonus = true
      axios.request({
        url: '/system/param/update',
        data: {
          'code': 'share_bonus',
          'value': self.shareBonus
        },
        method: 'post'
      }).then(() => {
        self.loadingUpdateShareBonus = false
        self.editShareBonus = false
        self.$Message.info('修改成功')
      }).catch(() => {
        self.loadingUpdateShareBonus = false
      })
    },
    updateCouponPrice () {
      let self = this
      let couponPrice = self.couponPrice
      if (!/^\d+$/.test(couponPrice) || parseInt(couponPrice) < 1 || parseInt(couponPrice) > 999) {
        self.$Message.error('优惠券金额应为 1 - 999 整数！')
        return
      }
      self.loadingUpdateCouponPrice = true
      axios.request({
        url: '/system/param/update',
        data: {
          'code': 'coupon_price',
          'value': self.couponPrice
        },
        method: 'post'
      }).then(() => {
        self.loadingUpdateCouponPrice = false
        self.editCouponPrice = false
        self.$Message.info('修改成功')
      }).catch(() => {
        self.loadingUpdateCouponPrice = false
      })
    }
  },
  created () {
  }
}
</script>
