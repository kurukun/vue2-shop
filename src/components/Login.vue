<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form class="login_form" ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
                <!-- 用户名区域 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码区域 -->
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-warning" v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
 
<script>
export default {
    name: 'Login',
    components: {
    },
    data() {
        return {
            // 这是登录表单的数据绑定对象
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            // 这是登录表单的验证规则对象
            loginFormRules: {
                // 验证用户名是否合法
                username: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                // 验证密码是否合法
                password: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        // 重置表单数据及校验结果，使用resetFields方法，需要先获取表单实例
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields();
        },
        // 登录按钮回调
         login() {
            // 登陆前的预验证
            this.$refs.loginFormRef.validate(async (result) => {
                // console.log(result);
                if(!result) return;
                // async await之后返回的就不是promise对象而是取得了操作的结果
                const {data: res} = await this.$http.post('login', this.loginForm);
                if(res.meta.status !== 200) {
                    return this.$message.error('登录失败');
                }
                this.$message.success('登录成功');
                // console.log(res);
                // 1.将登陆成功之后的token保存到客户端的sessionStorage，也就是只在网站打开期间生效
                sessionStorage.setItem('token', res.data.token);
                // 2.通过编程式导航跳转到后台主页
                this.$router.push('/home');
            });
        }
    }
}
</script>
 
<style scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
}

.avatar_box {
    position: absolute;
    transform: translate(-50%, -50%);
    background-color: #fff;
    left: 50%;
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
}

.avatar_box img {
    width: 100%;
    height: 100%;
    background-color: #eee;
    border-radius: 50%;
}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.btns {
    display: flex;
    justify-content: flex-end;
}
</style>