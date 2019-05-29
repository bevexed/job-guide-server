<template>
  <div>
    <Button @click="deleteSome()" icon="md-trash" type="error">批量删除</Button> &nbsp;&nbsp;&nbsp;
    <Button @click="add()" icon="md-add" type="primary" style="margin-right: 100px">添加资讯</Button>

    <Select v-model="type" style="width: 100px;margin-right: 5px" placeholder="全部栏目">
      <Option value="0">招考政策</Option>
      <Option value="1">高校动态</Option>
      <Option value="2">志愿指南</Option>
    </Select>

    日期范围：
    <DatePicker type="date" @on-change="startTimeChange" placeholder="开始时间" style="width: 200px;margin-right: 5px"></DatePicker>
    <DatePicker type="date" @on-change="endTimeChange" placeholder="结束时间" style="width: 200px;margin-right: 5px"></DatePicker>


    <Input v-model="title" placeholder="标题" style="width: 300px"/>
    <Button @click="getlist()" style="margin-left: 20px" type="success">搜咨询</Button> &nbsp;&nbsp;&nbsp;

    <div style="height: 20px;"></div>

    <Table border ref="selection" @on-selection-change="changeSelect" :columns="columns4" :data="data1">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <a @click="doupdateIsHome(row)">推荐到首页</a> &nbsp;
        <a @click="doupdateIsTop(row)">置顶</a> &nbsp;
        <Button size="small" icon="md-create" style="margin-right: 5px" @click="dofindInformationById(row)"></Button>
        <Button size="small" icon="md-trash" @click="doDeleteOne(row)"></Button>
      </template>

    </Table>

    <div style="height: 20px;"></div>


    <Page :total="total" @on-change="changePage" show-sizer :page-size="size" @on-page-size-change="sizeChange"/>
  </div>
</template>
<script>
  import {deleteInformation, deleteOne, listPage, updateIsHome, updateIsTop} from "../../api/new";

  export default {
    data() {
      return {
        columns4: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '标题',
            key: 'title'
          },
          {
            title: '分类',
            key: 'type',
            render: (h, { row }) => {
              return h('span', row.type===0 ?'招考资讯': row.type===1 ? '高校动态' : '志愿指南')
            }
          },
          {
            title: '来源',
            key: 'source',

          }, {
            title: '更新时间',
            key: 'gmtModified'
          }, {
            title: '浏览次数',
            key: 'browseFrequency'
          }, {
            title: '发布状态',
            key: 'status',
            width: 100,
            render: (h, { row }) => {
              return h('span', row.status === 1 ? '已发布' : '草稿')
            }
          },
          {
            width: 250,
            title: '操作',
            slot: 'action',
            align: 'center'
          }

        ],

        data1: [],

        current: 0,
        size: 10,
        title: null,
        startTime: 0,
        endTime: 0,
        total: 100,

        selected: [],
      }
    },
    mounted() {
      const type = this.$route.path.slice(-1);
      this.type = type
      this.getlist(type);
    },
    methods: {
      handleSelectAll(status) {
        this.$refs.selection.selectAll(status);
      },

      async getlist(type) {
        type = this.type || type;
        console.log(this.$route.name);
        const {current, size, title, startTime, endTime} = this;
        let res = await listPage(current, size, title, startTime, endTime, type);
        this.data1 = res.data.records
        this.current = res.data.current;
        this.total = res.data.total;
        console.log('list', res);
      },

      changePage(e) {
        console.log(e);
        this.current = e;
        this.getlist()
      },

      sizeChange(e) {
        console.log(e);
        this.size = e;
        this.getlist()
      },

      deleteAll(){

      },

      startTimeChange(data, a) {
        console.log(data, a);
        console.log(new Date(data).valueOf());
        this.startTime = new Date(data).valueOf()
      },
      endTimeChange(data, a) {
        console.log(data, a);
        this.endTime = new Date(data).valueOf()
      },


      changeSelect(e) {
        console.log('选', e);
        this.selected = e.map(item => item.id)
      },

      async deleteSome() {
        if (!this.selected.length) {return }
        let res = await deleteInformation(this.selected.join(',') + ',')
        console.log('删除选中', res);
        if (res.code === 200) {
          window.location.reload()
        }
      },

      async doDeleteOne(row) {
        console.log(row.id);
        let res = await deleteOne(row.id);
        if (res.code === 200) {
          window.location.reload()
        }
      },

      async doupdateIsTop(row) {
        console.log(row.id);
        let res = await updateIsTop(row.id);
        if (res.code === 200) {
          this.$Message.success(res.message);
        }
      },

      async doupdateIsHome(row) {
        console.log(row.id);
        let res = await updateIsHome(row.id);
        if (res.code === 200) {
          this.$Message.success(res.message);
        }
      },

      async dofindInformationById(row) {
        this.$router.push({path: '/dd/d/4', query: {id: row.id}})
        // console.log(row.id);
        // let res = await findInformationById(row.id);
        // if (res.code === 200) {
        //   this.$Message.success(res.message);
        // }
      },

      add(){
        this.$router.push({path: '/dd/d/4', query:{type: this.type}})
      },
    },
    watch: {
      '$route.path': function (newVal, oldVal) {
        console.log(newVal, oldVal);
        const type = newVal.slice(-1);
        this.type = type;
        this.getlist(type);
      }
    }
  }
</script>
