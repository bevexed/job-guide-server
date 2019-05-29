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
      <Input v-model="formValidate.source" placeholder="填写文章来源"></Input>
    </FormItem>

    <!--    <FormItem label="缩略图">-->
    <!--      <input type="file" @change="chooseimg">-->
    <!--    </FormItem>-->
    <Form-item label="缩略图" prop="thumbnail">
      <image-upload ref="imageUpload"
                    :default-file="imageFile"
                    file-category="banner"
                    @on-file-change="handleImageChange"
                    :num="1"/>
    </Form-item>


    <quill-editor v-model="articleContent"
                  style="margin: 20px"
                  ref="myQuillEditor"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)">
    </quill-editor>

    <FormItem label="推荐到首页">
      <Checkbox v-model="formValidate.isHome"></Checkbox>
    </FormItem>

    <FormItem label="是否置顶">
      <Checkbox v-model="formValidate.isTop"></Checkbox>
    </FormItem>


    <div style="margin: 20px">
      <Button type="success" style="margin-left: 8px" @click="handleSubmit('formValidate',1)">发布</Button>
      <Button type="primary" style="margin-left: 8px" @click="doupdateInformation('formValidate',0)">保存草稿</Button>
      <!--      <Button type="warning" style="margin-left: 8px" @click="handleSubmit('formValidate')">效果预览</Button>-->
      <Button type="error" style="margin-left: 8px" @click="$router.go(-1)">取消</Button>
      <!--      <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>-->
    </div>
  </Form>
</template>
<script>
  import {addInformation, findInformationById, updateInformation} from "../../api/new";
  import ImageUpload from '_c/common/image-upload'

  export default {
    components: {ImageUpload},
    data() {
      return {
        imageFile: null,
        articleContent: '',
        param: {},
        editorOption: {
          // some quill options
        },

        thumbnail: {},

        formValidate: {
          title: '',
          type: '',
          source: '',
          isHome: false,
          isTop: false,


          status: 0

        },
        ruleValidate: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
          ],
          source: [
            {required: true, message: '来源不能为空', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择类型', trigger: 'change'}
          ],

        }
      }
    },

    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    mounted() {
      console.log('this is current quill instance object', this.editor)
      this.dofindInformationById()
    },

    methods: {

      async dofindInformationById() {
        console.log(this.$route.query);
        let res = await findInformationById(this.$route.query.id);
        if (res.code === 200) {
          this.thumbnail = res.data.thumbnail;
          this.imageFile = res.data.thumbnail;
          this.formValidate = res.data;
          this.articleContent = res.data.articleContent

          console.log('onload', this);
          // this.$Message.success(res.message);
        }
      },
      onEditorBlur(quill) {
        console.log('editor blur!', quill)
      },
      onEditorFocus(quill) {
        console.log('editor focus!', quill)
      },
      onEditorReady(quill) {
        console.log('editor ready!', quill)
      },
      onEditorChange({quill, html, text}) {
        console.log('editor change!', quill, html, text)
        this.content = html
      },
      handleImageChange(file) {
        console.log('filePath', file);
        this.param.thumbnail = file && file.fileKey;
        this.thumbnail = file.fileUrl;
      },

      async handleSubmit(name, status) {
        console.log(this);
        if (this.$route.query.id) {
          this.doupdateInformation(name, status);
          return
        }

        this.$refs[name].validate(async (valid) => {
          if (valid) {
            const {title, type, source, isHome, isTop} = this.formValidate;
            const {articleContent, thumbnail} = this;
            let res = await addInformation(type, title, source, articleContent, isHome, isTop, thumbnail);
            console.log(res);

            this.$Message.success('操作成功');
          } else {
            this.$Message.error('Fail!');
          }
        })
      },


      async doupdateInformation(name, status) {
        this.status = status;
        console.log(this);
        this.$refs[name].validate(async (valid) => {
          if (valid) {
            const {title, type, source, isHome, isTop} = this.formValidate;
            const {articleContent, thumbnail, status} = this;
            let res = await updateInformation(this.$route.query.id, type, title, source, articleContent, isHome, isTop, thumbnail, status);
            console.log(res);

            this.$Message.success('Success!');
          } else {
            this.$Message.error('Fail!');
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      chooseimg(e) {
        // console.log(e);
        // this.thumbnail = e.target.files[0]
        console.log(this.thumbnail);

        let file = e.target.files[0];
        if (file) {
          this.thumbnail = file
          console.log(this.file)
          let reader = new FileReader()
          let that = this;
          reader.readAsDataURL(file)
          reader.onload = function (e) {
            // 这里的this 指向reader
            console.log(e);
            that.thumbnail = this.result
            console.log('base64',that.thumbnail);
          }
          console.log(this.thumbnail);
        }
      }
    }
  }
</script>
