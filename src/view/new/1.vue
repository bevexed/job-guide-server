<template>
  <div>
    <Button @click="deleteAll()" icon="md-trash" type="error">批量删除</Button> &nbsp;&nbsp;&nbsp;
    <Button @click="add()" icon="md-add" type="primary">添加资讯</Button>

    <div style="height: 20px;"></div>

    <Table border ref="selection" :columns="columns4" :data="data1">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="show(index)">View</Button>
        <Button type="error" size="small" @click="remove(index)">Delete</Button>
      </template>

    </Table>

    <div style="height: 20px;"></div>


    <Page :total="total" @on-change="changePage"/>
  </div>
</template>
<script>
  import {listPage} from "../../api/new";

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
            key: 'status'
          },
          {
            title: '操作',
            slot: 'action',
            width: 150,
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
        const {current, size, title, startTime, endTime} = this
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

      deleteAll(){

      },

      add(){

      }
    },


  }
</script>
