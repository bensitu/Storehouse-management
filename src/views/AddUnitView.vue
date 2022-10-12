<template>
    <div class="ioinfobody">
        <el-row :gutter="5">
            <el-col :span="20" :offset="2" :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
                <div class="grid-content">
                    <el-container class="container-shadow">
                        <el-header class="unitheader">
                            <Header></Header>
                        </el-header>
                        <el-main class="unitmain">
                            <div class="formContent">
                                <h2 class="h2title mb-30">単位登録</h2>

                                <el-form :model="unitForm" :rules="unitRules" ref="unitForm" label-width="120px"
                                    class="">
                                    <el-form-item label="単位名称" prop="name">
                                        <el-input v-model="unitForm.name"></el-input>
                                    </el-form-item>

                                    <el-form-item label="備考" prop="remarks">
                                        <el-input type="textarea" v-model="unitForm.remarks"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="onSubmit('unitForm')">登録</el-button>
                                        <el-button type="warning" @click="resetform()">クリア</el-button>
                                        <el-button type="info" @click="handleBack()">戻る</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>

                        </el-main>
                        <el-footer class="unitfooter">
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
    name: 'AddUnit',
    components: {
        Header,
        Footer,
    },
    data() {
        let checkUnit = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('単位名を入力してください'));
            }
            setTimeout(() => {
                let reg = /^[\u4E00-\u9FA5]+$/;
                if (!reg.test(value)) {
                    callback(new Error('漢字を入力してください'));
                } else if (this.checkExistingUnit(value)) {
                    callback(new Error('この単位はすでに存在します'));
                }
            }, 500);
        };
        return {
            unitForm: {
                unit_id: '',
                name: '',
                create_user_id: '',
                update_user_id: '',
                remarks: ''
            },
            unitRules: {
                name: [
                    { required: true, message: '在庫名称を入力してください', trigger: 'blur' },
                    { min: 0, max: 50, message: '50位以下入力してください', trigger: 'blur' },
                    { validator: checkUnit, trigger: 'blur' }

                ],
            },
            unitOptions: ['张'],
            unitExist: false,
            employee_info: {
                employee_id: '',
            }
        }
    },
    mounted() {

    },
    methods: {
        async getUnit() {
            await this.$axios.get("/api/units").then((res) => {
                this.unitOptions = res.data.data.name;
            }).catch(err => console.log(err));
        },
        checkExistingUnit(value) {
            if ((this.unitOptions).indexOf(value) > -1) {
                //检查输入名称是否与unitOptions里面的相同
                console.log("Yes");
                this.unitExist = true;
                return true;
            } else {
                this.unitExist = false;
                return false;
            }
        },
        onSubmit(formName) {
            if (this.unitForm.name != null && this.unitForm.name !== "" && this.unitForm.name !== undefined) {
                if (this.unitExist) {
                    return;
                }
                this.unitForm.create_user_id = this.employee_info.employee_id;
                this.unitForm.update_user_id = this.employee_info.employee_id;
                this.unitForm.create_date = new Date();
                this.unitForm.update_date = new Date();
                this.unitForm.del_flg = 0;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post("/api/units", this.form).then((res) => {
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
                name: 'addgoods',
            })
        },
        resetform() {
            this.unitForm = {
                name: '',
                create_user_id: '',
                create_date: new Date(),
                update_user_id: '',
                update_date: new Date(),
                remarks: '',
            }
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

.unitheader {
    background-clip: padding-box;
    padding: 10px 30px;
    background: #fff;
    border: 1px solid #eaeaea;
}

.unitmain {
    background-clip: padding-box;
    padding: 25px 30px;
    background: #fff;
    border: 1px solid #eaeaea;

}

.unitfooter {
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