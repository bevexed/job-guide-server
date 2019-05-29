<template>
  <Modal title="生成用户优惠码" v-model="visible">
    <Form ref="form" class="form" :label-width="90"
        :model="param" :rules="rule" >
      <Row>
        <Col :span="22" >
          <Form-item label="有效时间">
            <Row>
              <Col span="11">
                <DatePicker type="datetime" placeholder="请选择" @on-change="onStartChange"
                  v-model="param.gmtPromoStartText" />
              </Col>
              <Col span="2" style="text-align: center">-</Col>
              <Col span="11">
                <DatePicker type="datetime" placeholder="请选择" @on-change="onEndChange"
                  v-model="param.gmtPromoEndText" />
              </Col>
            </Row>
          </Form-item>
        </Col>
      </Row>
      <Row>
        <Col :span="12">
          <Form-item label="优惠码金额" prop="promoPrice">
            <Input v-model.number="param.promoPrice" placeholder="输入优惠码金额" />
          </Form-item>
        </Col>
      </Row>
      <Row>
        <Col :span="22" style="line-height: 32px; text-align: center; color: red;">
          生成优惠码会覆盖之前的优惠码，请谨慎操作！！！
        </Col>
      </Row>
    </Form>
    <div slot="footer">
      <Button type="text" size="large" @click="visible=false">取消</Button>
      <Button type="primary" size="large" :loading="loadingGenerate" @click="generate">保存</Button>
    </div>
  </Modal>
</template>
<script>
import axios from '@/libs/api.request'
import Tables from '_c/common/tables'
export default {
  name: 'user-promo-generate-modal',
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
    },
    generateCallback: {
      type: Function
    }
  },
  data () {
    return {
      visible: this.value,
      loadingGenerate: false,
      param: {},
      rule: {
        promoPrice: [
          { type: 'integer', required: true, message: '请输入 1- 1000 的整数！', trigger: 'blur' },
          { type: 'integer', min: 1, max: 1000, message: '请输入 1- 1000 的整数！', trigger: 'blur' },
          { validator (rule, value, callback, source, options) {
            if (value === '') {
              return
            }
            let errors = []
            if (!/^\d*$/.test(value)) {
              errors.push('请输入 1- 1000 的整数！')
            }
            callback(errors)
          } }
        ]
      }
    }
  },
  created: function () {
  },
  methods: {
    onStartChange (val, val2) {
      this.param.gmtPromoStart = val || ''
    },
    onEndChange (val) {
      this.param.gmtPromoEnd = val || ''
    },
    generate () {
      let self = this
      self.param.id = this.userId
      self.loadingGenerate = true
      this.$refs.form.validate((valid) => {
        if (!valid) {
          self.$Message.warning('信息输入错误!')
          self.loadingGenerate = false
          return
        }
        axios.request({
          url: '/user/promo/generate',
          data: self.param,
          method: 'post'
        }).then(function (res) {
          self.visible = false
          self.$Message.success('生成成功!')
          self.generateCallback()
          self.loadingGenerate = false
        }).catch(function (e) {
          self.loadingGenerate = false
        })
      })
    }
  },
  watch: {
    value (val) {
      this.visible = val
      if (val === true) {
      } else {
        this.$refs.form.resetFields()
        this.param.gmtPromoStartText = ''
        this.param.gmtPromoStart = ''
        this.param.gmtPromoEndText = ''
        this.param.gmtPromoEnd = ''
      }
    },
    visible (val) {
      this.$emit('input', val)
    }
  }
}
</script>
