<template>
  <div class="homebody">
    <el-row :gutter="5">
      <el-col :span="20" :offset="2" :xs="8" :sm="12" :md="16" :lg="20" :xl="22">
        <div class="grid-content">
          <el-container class="container-shadow">
            <el-header class="homeheader">
              <Header></Header>
            </el-header>
            <el-main class="homemain">

              <div class="mt-10 mb-30">
                <div class=" floatLeft">
                  <h2>在庫情報一覧</h2>
                </div>
                <div class=" floatRight">
                  <el-button class="ml-5" type="info" @click="handleBack()">ログアウト</el-button>
                </div>
                <div class="cleanBoth"></div>
              </div>
              <div class="mb-20">
                <el-form :inline="true" :model="searchForm" ref="searchForm">
                  <el-form-item label="在庫名称" class="mr-20">
                    <el-input v-model="searchForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="在庫状況" class="mr-20">
                    <el-select v-model="ddd" clearable placeholder="選択する">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <br>
                  <el-form-item label="更新日時" class="mr-20">
                    <el-date-picker v-model="searchForm.date" type="daterange" align="right" unlink-panels
                      range-separator="〜" start-placeholder="開始日" end-placeholder="終了日" :picker-options="pickerOptions">
                    </el-date-picker>
                  </el-form-item>

                  <el-button class="" type="primary" icon="el-icon-search" @click="searchInfo()">
                    検索
                  </el-button>
                  <div class="floatRight mb-20">
                    <el-button class="mr-20" type="success" @click="handleCreate()">追加<i
                        class="el-icon-circle-plus-outline ml-5"></i></el-button>
                    <el-button class="" type="danger" @click="handleDelete(scope.$index, scope.row)">削除<i
                        class="el-icon-delete ml-5"></i>
                    </el-button>
                  </div>
                </el-form>
              </div>

              <div class="clearBoth"></div>

              <el-table :data="dataList" stripe border show-summary>
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="id" align="center" label="在庫ID"></el-table-column>
                <el-table-column prop="name" align="center" label="在庫名称"></el-table-column>
                <el-table-column prop="io_type" align="center" label="単位">
                </el-table-column>
                <el-table-column prop="io_num" align="center" label="在庫数量">
                </el-table-column>

                <el-table-column prop="io_person" align="center" label="更新者">
                </el-table-column>
                <el-table-column prop="io_datetime" align="center" label="更新日時">
                </el-table-column>
                <el-table-column prop="remarks" align="center" label="備考">
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template v-slot="scope">
                    <el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">編集<i
                        class="el-icon-edit ml-5"></i></el-button>
                    <br>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" class="mt-5">
                      削除<i class="el-icon-delete ml-5"></i>
                    </el-button>
                    <br>
                    <el-button size="mini" type="info" @click="handleAddIO(scope.$index, scope.row)" class="mt-5">
                      入出庫<i class="el-icon-shopping-cart-2 ml-5"></i>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination-container">
                <div class="block mt-5">
                  <el-pagination class="pagination" @current-change="handleCurrentChange"
                    :current-page="pagination.currentPage" :page-size="pagination.pageSize" small
                    layout="total, prev, pager, next" :total="pagination.total">
                  </el-pagination>
                </div>
              </div>
            </el-main>
            <el-footer class="homefooter">
              <Footer></Footer>
            </el-footer>
          </el-container>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'HomeView',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      searchForm: {

      },
      dataList: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        search_date: ''
      }
    }
  },
  mounted() {

  },
  methods: {
    searchInfo() {
      let param = "?attendance_date=" + this.pagination.search_date;
      if (this.pagination.search_date !== null) {
        this.$axios.get("http://localhost:8090/attendances/search/" + this.pagination.currentPage + "/" + this.pagination.pageSize + param).then((res) => {
          this.pagination.pageSize = res.data.data.size;
          this.pagination.currentPage = res.data.data.current;
          this.pagination.total = res.data.data.total;
          this.dataList = res.data.data.records;
        }).catch(err => console.log(err));
      } else {
        this.getAll();
      }
    },
    handleCurrentChange(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getAll();
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'Updaterecord',
      })
    },
    handleCreate() {
      this.$router.push({
        name: 'addgoods',
      })
    },
    handleDelete(index, row) {
      this.$confirm("削除は確認しましたか", "メッセージ", { type: "info" }).then(() => {
        this.$axios.delete("http://localhost:8090/attendances/delete/" + row.record_id).then((res) => {
          if (res.data.flag) {
            this.$message.success("削除しました");
          } else {
            this.$message.error("削除できません");
          }
        }).finally(() => {
          this.getAll();
        })
      }).catch(() => {
        this.$message.info("キャンセルしました");
      })

    },
    handleBack() {
      this.$router.push({
        name: 'login',
        // params: {
        //   message: this.employee_info.message,
        // }
      })
    },
  },
  computed: {},
  filters: {},
}
</script>

<style scoped>
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.homebody {
  background-image: url("../assets/img/bg3.jpg");
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}

.container-shadow {
  box-shadow:
    -5px 5px 20px -4px #cac6c6, 5px 5px 20px -4px #cac6c6;

}

.searchArea {
  width: 30%;
}

.homeheader {
  background-clip: padding-box;
  padding: 10px 30px;
  background: #fff;
  border: 1px solid #eaeaea;
}

.homemain {
  background-clip: padding-box;
  padding: 25px 30px;
  background: #fff;
  border: 1px solid #eaeaea;
}

.homefooter {
  background-clip: padding-box;
  padding: 20px 30px;
  text-align: center;
  background: #fff;
  color: #909399;
  border: 1px solid #eaeaea;
}

.searchBox,
.goBack {
  margin: 10px 0;
}
</style>
