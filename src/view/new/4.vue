<template>
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
    <FormItem label="文章标题" prop="title">
      <Input v-model="formValidate.title" placeholder=""></Input>
    </FormItem>
    <FormItem label="分类栏目" prop="type">
      <Select v-model="formValidate.type" placeholder="全部栏目">
        <Option value="0">招考政策</Option>
        <Option value="1">高校动态</Option>
        <Option value="2">志愿指南</Option>
      </Select>
    </FormItem>

    <FormItem label="文章来源" prop="source">
      <Input v-model="formValidate.source" placeholder="Enter your e-mail"></Input>
    </FormItem>


    <FormItem label="推荐到首页" prop="isHome">
      <CheckboxGroup v-model="formValidate.isHome">
        <Checkbox label=""></Checkbox>
      </CheckboxGroup>
    </FormItem>
    <FormItem label="Desc" prop="desc">
      <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
      <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
    </FormItem>
  </Form>
</template>
<script>
  export default {
    data() {
      return {
        formValidate: {
          title: '',
          type: '',
          source: '',
          isHome: '',


        },
        ruleValidate: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
          ],
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择类型', trigger: 'change'}
          ],

        }
      }
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!');
          } else {
            this.$Message.error('Fail!');
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      }
    }
  }
</script>
