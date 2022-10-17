<template>
    <div class="layout">
        <el-row :gutter="0">
            <el-col :span="20" :offset="2" :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                <div class="grid-content">
                    <el-container class="container-shadow">
                        <el-header class="header">
                            <Header></Header>
                        </el-header>
                        <el-main class="main">
                            <div class="formContent">
                                <h2 class="h2title mb-30">入出庫情報登録</h2>
                                <el-form :model="ioForm" :rules="ioRules" ref="ioForm" label-width="120px" class="">
                                    <el-form-item label="在庫ID" prop="id">
                                        <el-input v-model="ioForm.id" readonly class="ioreadonly">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item label="在庫名称" prop="name">
                                        <el-input v-model="ioForm.name" readonly class="ioreadonly"></el-input>
                                    </el-form-item>
                                    <el-form-item label="単位" prop="unit_name">
                                        <el-input v-model="ioForm.unit_name" readonly class="ioreadonly"></el-input>
                                    </el-form-item>
                                    <el-form-item label="在庫数量" prop="stock_num">
                                        <el-input v-model="ioForm.stock_num" readonly class="ioreadonly"></el-input>
                                    </el-form-item>
                                    <el-form-item label="入出庫タイプ" prop="io_type">
                                        <el-select v-model="ioForm.io_type" clearable placeholder="入出庫タイプ選択">
                                            <el-option v-for="item in ioTypeOptions" :key="item.unit_id"
                                                :label="item.name" :value="item.unit_id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="入出庫数量" prop="io_num">
                                        <el-input v-model.number="ioForm.io_num"></el-input>
                                    </el-form-item>

                                    <el-form-item label="備考" prop="remarks">
                                        <el-input type="textarea" v-model="ioForm.remarks"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="onSubmit('ioForm')" class="ml-0 mr-10 mb-10">
                                            登録</el-button>
                                        <el-button type="info" @click="handleBack()" class="ml-0 mr-10 mb-10">戻る
                                        </el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
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
    name: 'AddIOView',
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            ioForm: {
                id: '',
                name: '',
                unit_name: '',
                stock_num: '',
                io_type: '',
                io_num: '',
                remarks: '',
                create_user_id: '',
                update_user_id: '',
                del_flg: 0,
            },
            ioRules: {
                io_type: [
                    { type: 'array', required: true, message: 'タイプを選択してください', trigger: 'blur' }

                ],
                io_num: [
                    { min: 0, max: 11, type: 'number', required: true, message: '0以上数字を入力してください', trigger: 'blur' },
                    { required: true, message: '数字を入力してください', trigger: 'blur' }
                ],

            },
            ioTypeOptions: [],
            employee_info: {
                employee_id: '',
            }
        }
    },
    mounted() {
        this.getStockType();
    },
    methods: {
        async getStockType() {
            await this.$axios.get("/api1/codes").then((res) => {
                this.ioTypeOptions = res.data.data.map((item, index) => { return Object.assign({}, { 'unit_id': item.codeId, 'name': item.name }) })
                console.log(this.ioTypeOptions);
            })
        },
        async getIODetails() {

        },
        onSubmit(formName) {
            if (this.ioForm.attendance_date != null || this.ioForm.attendance_date !== "" || this.ioForm.attendance_date !== undefined) {
                this.ioForm.record_id = this.employee_info.employee_id + (this.form.attendance_date).replace(/-/g, '') + ((this.tempId < 10) ? ("0" + this.tempId) : this.tempId);
                this.tempId++;
                this.ioForm.create_user_id = this.employee_info.employee_id;
                this.ioForm.update_user_id = this.employee_info.employee_id;
                this.ioForm.create_date = new Date();
                this.ioForm.update_date = new Date();
                this.ioForm.del_flg = 0;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post("/api1/stocks/io/add", this.ioForm).then((res) => {
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
                name: 'ioinfo',
            })
        },
        resetform() {
            this.form = {}
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
    background-image: url("../assets/img/bg2.jpg");
    background-position: center;
    min-height: 100vh;
    width: 100%;
    background-size: cover;
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

:deep(.ioreadonly) .el-input__inner {
    border: 0 !important;
    outline: none;
}
</style>