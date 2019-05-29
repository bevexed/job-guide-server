<template>
  <div>
    <Button @click="deleteSome()" icon="md-trash" type="error">批量删除</Button> &nbsp;&nbsp;&nbsp;
    <Button @click="add()" icon="md-add" type="primary">添加资讯</Button>

    <div style="height: 20px;"></div>

    <Table border ref="selection" @on-selection-change="changeSelect" :columns="columns4" :data="data1">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <a @click="doupdateIsHome(row)">推荐到首页</a> &nbsp;
        <a @click="doupdateIsTop(row)">置顶</a> &nbsp;
        <Button size="small" icon="md-create" style="margin-right: 5px" @click="show(row)"></Button>
        <Button size="small" icon="md-trash" @click="doDeleteOne(row)"></Button>
      </template>

    </Table>

    <div style="height: 20px;"></div>


    <Page :total="total" @on-change="changePage" show-sizer page-size="size" @on-page-size-change="sizeChange"/>
  </div>
</template>
<script>
  import {deleteInformation, deleteOne, listPage,updateIsTop,updateIsHome} from "../../api/new";

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
            key: 'type'
          },
          {
            title: '来源',
            key: 'source'
          }, {
            title: '更新时间',
            key: 'gmtModified'
          }, {
            title: '浏览次数',
            key: 'browseFrequency'
          }, {
            title: '发布状态',
            key: 'status',
            width: 100
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
        title: '',
        startTime: 0,
        endTime: new Date().valueOf(),
        total: 100,

        selected: [],
      }
    },
    mounted() {
      this.getlist()
    },
    methods: {
      handleSelectAll(status) {
        this.$refs.selection.selectAll(status);
      },

      async getlist() {
        const {current, size, title, startTime, endTime} = this;
        let res = await listPage(current, size, title, startTime, endTime);
        this.data1 = res.data.records
        this.page = res.data.current;
        this.total = res.data.pages
        console.log('list', res);
      },

      changePage(e) {
        console.log(e);
        this.page = e;
        this.getlist()
      },

      sizeChange(e) {
        console.log(e);
        this.size = e;
        this.getlist()
      },

      deleteAll(){

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

      add(){

      }
    },


  }
</script>
