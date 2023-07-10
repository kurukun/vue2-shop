<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/logo.png">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区域 -->
                <!-- router为true开启二级菜单的路由模式，index为路由跳转路径 -->
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单模板区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)"> 
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                <span>{{ subItem.authName }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
 
<script>
export default {
    name: 'Home',
    components: {
    },
    data() {
        return {
            // 左侧菜单数据
            menuList: [],
            // 一级菜单图标
            iconsObj: {
                125: 'el-icon-user',
                103: 'el-icon-warning-outline',
                101: 'el-icon-goods',
                102: 'el-icon-document',
                145: 'el-icon-data-analysis'
            },
            // 控制是否折叠
            isCollapse: false,
            // 被激活的链接地址
            activePath: ''
        }
    },
    created() {
        this.getMenuList();
        this.activePath = sessionStorage.getItem('activePath');
    },
    methods: {
        logout() {
            sessionStorage.clear();
            this.$router.push('/login');
        },
        // 获取所有的菜单
        async getMenuList() {
            const {data: res} = await this.$http.get('menus');
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.menuList = res.data;
            // console.log(res);
        },
        // 折叠或展开菜单
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
        // 保存链接的激活状态
        saveNavState(activePath) {
            sessionStorage.setItem('activePath', activePath);
            this.activePath = activePath;
        }
    }
}
</script>
 
<style scoped>
.home-container {
    height: 100%;
}

.el-header {
    display: flex;
    justify-content: space-between;
    background-color: #373d41;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
}

.el-header div {
    display: flex;
    align-items: center;
}

.el-header img {
    margin-right: 15px;
    height: 50px;
    width: 50px;
}

.el-aside {
    background-color: #333744;
}

.el-aside .el-menu{
    border-right: none;
}

.el-main {
    background-color: #eaedf1;
}

.toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>