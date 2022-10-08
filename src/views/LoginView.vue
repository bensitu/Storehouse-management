<template>
    <div class="loginbody">
        <div class="logindata">
            <div class="logintext">
                <h3>倉庫管理システム</h3>
            </div>
            <div class="formdata">
                <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
                    <el-form-item prop="username">
                        <el-input type="text" v-model.trim="loginForm.username" clearable placeholder="ユーザーID"
                            auto-complete="off" prefix-icon="el-icon-user-solid"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" v-model="loginForm.password" clearable placeholder="パスワード"
                            show-password auto-complete="off" prefix-icon="el-icon-lock"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tool">
                <div>
                    <el-checkbox v-model="checked" @change="remenber">ユーザーIDとパスワードを保存する</el-checkbox>
                </div>
            </div>
            <div class="butt">
                <el-button type="primary" @click.native.prevent="login('form')">ログイン</el-button>
                <el-button class="shou" @click="register">新規登録</el-button>
            </div>
        </div>
    </div>
</template>
  
<script>
// @ is an alias to /src

export default {
    name: 'LoginView',
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!validUsername(value)) {
                callback(new Error('Please enter the correct user name'))
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('The password can not be less than 6 digits'))
            } else {
                callback()
            }
        }
        return {
            loginForm: {
                password: '',
                username: '',
            },
            checked: false,
            loginRules: {
                username: [
                    { required: true, message: 'ユーザーIDを入力してください', trigger: 'blur' },
                    { max: 11, message: "11文字を超えて入力することはできません、11文字を入力してください", trigger: "blur" },
                ],
                password: [
                    { required: true, message: "パスワードを入力してください", trigger: "blur" },
                    { max: 50, message: "50文字を超えて入力することはできません、50文字を入力してください", trigger: "blur" },
                ],
            },
        };
    },
    mounted() {
        if (localStorage.getItem("news")) {
            this.form = JSON.parse(localStorage.getItem("news"))
            this.checked = true
        }
    },
    methods: {
        login(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    login(this.form)
                        .then((res) => {
                            if (res.code === 200) {
                                setToken(res.data.token);
                                localStorage.setItem("USERNAME", res.data.username);
                                this.$message({
                                    message: "登录成功啦",
                                    type: "success",
                                    showClose: true,
                                });
                                this.$router.replace("/");
                            } else {
                                this.$message({
                                    message: "账户名或密码错误",
                                    type: "error",
                                    showClose: true,
                                });
                            }
                        })
                        .catch((err) => {
                            this.$message({
                                message: "账户名或密码错误",
                                type: "error",
                                showClose: true,
                            });
                        });
                } else {
                    return false;
                }
            });
        },
        remenber(data) {
            this.checked = data
            if (this.checked) {
                localStorage.setItem("news", JSON.stringify(this.form))
            } else {
                localStorage.removeItem("news")
            }
        },
        register() {
            this.$message({
                type: "info",
                message: "開発中",
                showClose: true
            })
        },
    },
}
</script>

<style scoped>
.loginbody {
    min-width: 1000px;
    background-image: url("../assets/img/bg.jpg");
    background-position: center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
    padding-top: 50px;
}

.logintext {
    line-height: 20px;
    text-align: center;
    font-size: 20px;
    font-weight: bolder;
    margin: 0 auto 20px auto;
    color: #505458;
}

.logindata {
    width: 350px;
    /* transform: translate(-50%); */
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    padding: 25px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}

.tool {
    display: flex;
    justify-content: space-between;
    color: #606266;
}

.butt {
    margin-top: 10px;
    text-align: center;
}

.shou {
    cursor: pointer;
    color: #606266;
}


/*ui*/
/* /deep/ .el-form-item__label {
  font-weight: bolder;
  font-size: 15px;
  text-align: left;
}

/deep/ .el-button {
  width: 100%;
  margin-bottom: 10px;

} */
</style>
