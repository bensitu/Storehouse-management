<template>
    <div class="ioinfobody">
        <el-row :gutter="5">
            <el-col :span="20" :offset="2" :xs="8" :sm="12" :md="16" :lg="20" :xl="22">
                <div class="grid-content">
                    <el-container class="container-shadow">
                        <el-header class="infoheader">
                            <Header></Header>
                        </el-header>
                        <el-main class="ioinfomain">
                            <div class="formContent">
                                <h2 class="h2title mb-30">入出庫情報登録</h2>
                                <el-form :model="ioForm" :rules="rules" ref="ioForm" label-width="120px" class="">
                                    <el-form-item label="在庫ID" prop="id">
                                        <el-input v-model="ioForm.id"></el-input>
                                    </el-form-item>
                                    <el-form-item label="在庫名称" prop="name">
                                        <el-input v-model="ioForm.name"></el-input>
                                    </el-form-item>

                                    <el-form-item label="単位" prop="unit_name">
                                        <el-input v-model="ioForm.unit_name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="在庫数量" prop="stock_num">
                                        <el-input v-model="ioForm.stock_num"></el-input>
                                    </el-form-item>
                                    <el-form-item label="入出庫タイプ" prop="io_type">
                                        <el-select v-model="ioForm.io_type" clearable placeholder="入出庫タイプ選択">
                                            <el-option v-for="item in ioTypeOptions" :key="item.value"
                                                :label="item.label" :value="item.value">
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
                                        <el-button type="primary" @click="onSubmit('ioForm')">登録</el-button>
                                        <el-button type="info" @click="handleBack()">戻る</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-main>
                        <el-footer class="infofooter">
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
                remarks: ''
            },
            rules: {
                io_type: [
                    { type: 'array', required: true, message: 'タイプを選択してください', trigger: 'blur' }

                ],
                io_num: [
                    { min: 0, max: 11, type: 'number', required: true, message: '0以上数字を入力してください', trigger: 'blur' },
                    { required: true, message: '数字を入力してください', trigger: 'blur' }
                ],

            },
            ioTypeOptions: [],
        }
    },
    mounted() {

    },
    methods: {
        onSubmit(formName) {
            if (this.form.attendance_date != null || this.form.attendance_date !== "" || this.form.attendance_date !== undefined) {
                this.form.record_id = this.employee_info.employee_id + (this.form.attendance_date).replace(/-/g, '') + ((this.tempId < 10) ? ("0" + this.tempId) : this.tempId);
                this.tempId++;
                this.form.create_user_id = this.employee_info.employee_id;
                this.form.update_user_id = this.employee_info.employee_id;
                this.form.create_date = new Date();
                this.form.update_date = new Date();
                this.form.rec_del_flg = 0;
                this.form.flow_status_id = 0;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post("http://localhost:8090/attendances", this.form).then((res) => {
                            if (res.data.flag) {
                                this.$message.success("登録完了しました");
                                this.$router.push({
                                    name: 'home',
                                    params: {
                                        employee_id: this.employee_info.employee_id,
                                    }
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

.ioinfobody {
    background-image: url("../assets/img/bg2.jpg");
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

.infoheader {
    background-clip: padding-box;
    padding: 10px 30px;
    background: #fff;
    border: 1px solid #eaeaea;
}

.ioinfomain {
    background-clip: padding-box;
    padding: 25px 30px;
    background: #fff;
    border: 1px solid #eaeaea;

}

.infofooter {
    background-clip: padding-box;
    padding: 20px 30px;
    text-align: center;
    background: #fff;
    color: #909399;
    border: 1px solid #eaeaea;
}

.h2title {
    text-align: center;
}

.formContent {
    width: 50%;
    margin: 0 auto;
}
</style>