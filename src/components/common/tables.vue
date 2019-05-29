<template>
  <div>
    <Table ref="table" :columns="innerColumns" :data="tableData" stripe border
          @on-selection-change="selectionChange" size="small"></Table>
    <Page style="margin: 10px 0 0 0;"
          :total="totalCount" :current="page.current" size="small"
          :pageSize="page.size" @on-change="changeCurrent" show-total></Page>
  </div>
</template>

<script>
import axios from '@/libs/api.request'
export default {
  name: 'tables',
  props: {
    initLoading: {
      type: Boolean,
      default () {
        return true
      }
    },
    routerReplace: {
      type: Boolean,
      default () {
        return true
      }
    },
    listUrl: {
      type: [String],
      default () {
        return ''
      }
    },
    params: {
      type: [Object],
      default () {
        return {}
      }
    },
    tableColumns: {
      type: Array,
      default () {
        return []
      }
    },
    reload: {
      type: Number,
      default () {
        return new Date().getTime()
      }
    },
    onLoading: {
      type: Function,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      innerColumns: this.tableColumns,
      tableData: [],
      queryParam: {},
      totalCount: 0,
      page: {
        current: 1,
        size: 10
      }
    }
  },
  mounted: function () {
  },
  methods: {
    search () {
      this.searchList('init')
    },
    searchList (type) {
      var self = this
      if (type === 'init') {
        this.page.current = 1
      }
      this.queryParam = Object.assign(this.params, this.page)
      this.handleLoading(true)
      const loading = this.$Message.loading({
        content: '查询中...',
        duration: 0
      })
      axios.request({
        url: this.listUrl,
        params: self.queryParam,
        method: 'get'
      }).then(function (res) {
        self.tableData = res.data.records
        self.totalCount = res.data.total
        self.handleLoading(false)
        loading()
        if (self.routerReplace) {
          self.$router.replace({
            query: self.queryParam
          })
        }
      }).catch(function (e) {
        self.handleLoading(false)
        loading()
      })
      // this.$http.get(this.listUrl, {params: self.queryParam}).then(function (res) {
      //   self.tableData = res.data.data
      //   self.totalCount = res.data.totalCount
      //   self.handleLoading(false)

      //   self.$router.replace({
      //     query: self.queryParam
      //   })
      //   loading()
      // }).catch(function (e) {
      //   self.handleLoading(false)
      //   loading()
      // })
    },
    changeCurrent (current) {
      this.page.current = current
      this.searchList()
    },
    handleLoading (loading) {
      if (this.onLoading) {
        this.onLoading(loading)
      }
    },
    selectionChange (selection) {
      this.$emit('on-selection-change', selection)
    },
    clearData () {
      this.tableData = []
      this.totalCount = 0
    }
  },
  watch: {
    params (val) {
      this.queryParam = val
    },
    reload (val) {
      if (val) {
        this.search()
      }
    }
  },
  created: function () {
    let routeQuery = this.$route.query
    routeQuery.current && (this.page.current = parseInt(routeQuery.current))
    routeQuery.size && (this.page.size = parseInt(routeQuery.size))
    delete routeQuery.current
    delete routeQuery.size
    Object.assign(this.params, routeQuery)
    if (this.initLoading) {
      this.searchList()
    }
  }
}
</script>
