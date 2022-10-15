<template>
  <div class="layout">
    <el-row :gutter="5">
      <el-col :span="20" :offset="2" :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
        <div class="grid-content">
          <el-container class="container-shadow">
            <el-header class="header">
              <Header></Header>
            </el-header>
            <el-main class="main">
              <div class="floatRight">
                <el-button class="ml-5" type="success" @click="handleAddUnit()">単位追加<i
                    class="el-icon-circle-plus-outline ml-5"></i></el-button>
              </div>
              <div class="formContent">
                <h2 class="h2title mb-30">在庫情報登録</h2>

                <el-form :model="goodsForm" :rules="goodsRules" ref="goodsForm" label-width="120px" class="">
                  <el-form-item label="在庫ID" prop="id">
                    <el-input v-model="goodsForm.id"></el-input>
                  </el-form-item>
                  <el-form-item label="在庫名称" prop="name">
                    <el-input v-model="goodsForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="単位" prop="unit_name">
                    <el-select v-model="goodsForm.unit" clearable placeholder="単位選択">
                      <el-option v-for="item in unitOptions" :key="item.unit_id" :label="item.name"
                        :value="item.unit_id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="備考" prop="remarks">
                    <el-input type="textarea" v-model="goodsForm.remarks"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit('goodsForm')">登録</el-button>
                    <el-button type="warning" @click="resetform()">クリア</el-button>
                    <el-button type="info" @click="handleBack()">戻る</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="clearBoth"></div>
            </el-main>
            <el-footer>
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
  name: 'AddGoodsView',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      goodsForm: {
        id: '',
        name: '',
        unit_name: '',
        stock_num: '',
        io_type: '',
        io_num: '',
        create_user_id: '',
        update_user_id: '',
        remarks: ''
      },
      goodsRules: {
        id: [
          { required: true, message: '在庫IDを入力してください', trigger: 'blur' },
          { min: 0, max: 6, message: '6位以下英数字を入力してください', trigger: 'blur' }

        ],
        name: [
          { required: true, message: '在庫名称を入力してください', trigger: 'blur' },
          { min: 0, max: 50, message: '50位以下入力してください', trigger: 'blur' }

        ],
        unit_name: [
          { required: true, message: '単位を選択してください', trigger: 'blur' }
        ],
      },
      unitOptions: [],
      employee_info: {
        employee_id: '',
      }
    }
  },
  mounted() {
    this.getUnit()
  },
  methods: {
    async getUnit() {
      await this.$axios.get("/api1/units").then((res) => {
        this.unitOptions = res.data.data.map((item, index) => { return Object.assign({}, { 'unit_id': item.unitId, 'name': item.name }) })
      }).catch(err => console.log(err));
    },
    onSubmit(formName) {
      if (this.goodsForm.id != null && this.goodsForm.id !== "" && this.goodsForm.id !== undefined) {
        this.goodsForm.stock_num = 0;
        this.goodsForm.create_user_id = this.employee_info.employee_id;
        this.goodsForm.update_user_id = this.employee_info.employee_id;
        this.goodsForm.create_date = new Date();
        this.goodsForm.update_date = new Date();
        this.goodsForm.del_flg = 0;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post("/api1/stocks", this.form).then((res) => {
              if (res.data.flag) {
                this.$message.success("登録完了しました");
                this.$router.push({
                  name: 'home',
                })
              } else {
                this.$message.error("エラー、登録できません");
              }
            })
          } else {
            this.$message.error("エラー、フォームに必要データがありません。データを入力してください。");
            return false;
          }
        });
      }
    },
    handleBack() {
      this.$router.push({
        name: 'home',
      })
    },
    resetform() {
      this.goodsForm = {
        id: '',
        name: '',
        unit_name: '',
        stock_num: '',
        io_type: '',
        io_num: '',
        create_user_id: '',
        create_date: new Date(),
        update_user_id: '',
        update_date: new Date(),
        remarks: '',
      }
    },
    handleAddUnit() {
      this.$router.push({
        name: 'addunit',
      })
      this.$message({
        type: "info",
        message: "開発中",
        showClose: true
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

.layout {
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

.header {
  background-clip: padding-box;
  padding: 10px 30px;
  background: #fff;
  border: 1px solid #eaeaea;
}

.main {
  background-clip: padding-box;
  padding: 25px 30px;
  background: #fff;
  border: 1px solid #eaeaea;

}

.el-footer {
  padding: 0;
}

.h2title {
  text-align: center;
}

.formContent {
  width: 50%;
  margin: 0 auto;
}
</style>