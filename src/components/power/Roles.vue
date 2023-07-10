<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="roleList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 栅格系统布局 -->
                        <el-row v-for="(item1, i1) in scope.row.children"
                            :class="['bd-bottom', i1 === 0 ? 'bd-top' : '', 'vcenter']" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环嵌套渲染二三级权限 -->
                                <el-row :class="[i2 === 0 ? '' : 'bd-top', 'vcenter']" v-for="(item2, i2) in item1.children"
                                    :key="item2.id">
                                    <!-- 左边 -->
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{
                                            item2.authName }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 右边 -->
                                    <el-col :span="18">
                                        <el-tag v-for="(item3, i3) in item2.children" :key="item3.id" type="warning"
                                            closable @close="removeRightById(scope.row, item3.id)">{{
                                                item3.authName }}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>

                        <!-- <pre>{{scope.row}}</pre> -->
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                            @click="showEditRoleDialog(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="deleteRole(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini"
                            @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色信息窗口 -->
        <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="50%" @close="addRoleDialogClosed">
            <!-- 主体部分 -->
            <el-form :model="addRoleList" :rules="addRoleListRules" ref="addRoleListRef" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleList.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleList.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑角色信息窗口 -->
        <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="50%" @close="editRoleDialogClosed">
            <!-- 主体部分 -->
            <el-form :model="editRoleList" :rules="editRoleListRules" ref="editRoleListRef" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRoleList.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleList.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 按钮部分 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色信息窗口 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
            <!-- 树形控件 -->
            <!-- 为每一个节点绑定一个唯一的id值，该id来自:data指定的数据源 -->
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRight">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
 
<script>
export default {
    name: '',
    components: {
    },
    data() {
        return {
            // 所有角色列表数据
            roleList: [],

            // 是否展示添加角色对话框
            addRoleDialogVisible: false,
            // 添加角色列表数据
            addRoleList: {
                roleName: '',
                roleDesc: ''
            },
            // 添加角色验证规则
            addRoleListRules: {
                roleName: [
                    { required: true, message: '请输入角色名', trigger: 'blur' },
                    { min: 1, max: 10, message: '角色名的长度需要在1-10个字符之间', trigger: 'blur' }
                ],
                roleDesc: [
                    { min: 2, message: '描述至少要2个字符', trigger: 'blur' }
                ]
            },

            // 是否展示编辑角色对话框
            editRoleDialogVisible: false,
            // 编辑角色列表数据
            editRoleList: {
                roleId: '',
                roleName: '',
                roleDesc: ''
            },
            // 编辑角色验证规则
            editRoleListRules: {
                roleName: [
                    { required: true, message: '请输入角色名', trigger: 'blur' },
                    { min: 1, max: 10, message: '角色名的长度需要在1-10个字符之间', trigger: 'blur' }
                ],
                roleDesc: [
                    { min: 2, message: '描述至少要2个字符', trigger: 'blur' }
                ]
            },
            // 分配权限对话框是否展示
            setRightDialogVisible: false,
            // 所有权限的数据
            rightsList: [],
            // 树形控件的属性绑定对象
            treeProps: {
                // 每一级要展示的属性
                label: 'authName',
                // 要进行父子嵌套的属性
                children: 'children'
            },
            // 树形控件默认勾选项
            defKeys: [],
            // 确定更改权限时使用的id
            roleId: ''
        }
    },
    created() {
        this.getRoleList();
    },
    methods: {
        // 获取所有角色的列表
        async getRoleList() {
            const { data: res } = await this.$http.get('roles');
            if (res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败');
            }

            this.roleList = res.data;
            console.log(this.roleList);
        },
        // 添加角色对话框关闭，清空内容及校验结果
        addRoleDialogClosed() {
            this.$refs.addRoleListRef.resetFields();
        },
        // 正式添加角色
        addRole() {
            this.$refs.addRoleListRef.validate(async valid => {
                if (!valid) return;
                const { data: res } = await this.$http.post('roles', this.addRoleList);
                if (res.meta.status !== 201) return this.$message.error('添加角色失败');
                this.$message.success('添加角色成功！');
                // 隐藏添加用户的对话框
                this.addRoleDialogVisible = false;
                this.getRoleList();
            });
        },
        // 展示编辑对象对话框
        async showEditRoleDialog(id) {
            this.editRoleDialogVisible = true;
            // 获取该id在数据库的数据
            const { data: res } = await this.$http.get('roles/' + id);
            if (res.meta.status !== 200) return this.$message.error('查询角色失败');
            this.editRoleList = res.data;
        },
        // 编辑角色
        editRole() {
            this.$refs.editRoleListRef.validate(async valid => {
                if (!valid) return;
                // 发起编辑请求
                const { data: res } = await this.$http.put('roles/' + this.editRoleList.roleId, {
                    roleName: this.editRoleList.roleName,
                    roleDesc: this.editRoleList.roleDesc
                });
                if (res.meta.status !== 200) return this.$message.error('编辑角色失败');
                this.$message.success('编辑角色成功！');
                // 隐藏添加用户的对话框
                this.editRoleDialogVisible = false;
                this.getRoleList();
            });
        },
        // 编辑角色对话框关闭，清空内容及校验结果
        editRoleDialogClosed() {
            this.$refs.editRoleListRef.resetFields();
        },

        // 删除角色
        async deleteRole(id) {
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err);
            // console.log(confirmResult);
            if (confirmResult === 'cancel') return this.$message.info('已取消删除');

            // 开始删除逻辑
            const { data: res } = await this.$http.delete('roles/' + id);
            if (res.meta.status !== 200) return this.$message.error('删除角色失败');
            this.$message.success('删除角色成功');
            this.getRoleList();
        },

        // 根据id删除对应权限
        async removeRightById(role, rightId) {
            // 弹框提示是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err);

            if (confirmResult !== 'confirm') {
                return this.$message.info('取消了删除');
            }

            // console.log('确认了删除');
            // 具体删除的逻辑
            const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
            if (res.meta.status !== 200) return this.$message.error('删除权限失败');
            // this.getRoleList(); // 这里不建议用这个，因为页面会全部重新渲染
            role.children = res.data;
        },

        // 展示权限分配对话框
        async showSetRightDialog(role) {
            this.roleId = role.id;
            // 获取所有权限的数据
            const {data: res} = await this.$http.get('rights/tree'); 
            if(res.meta.status !== 200) {
                return this.$message.error('获取权限数据失败');
            }

            // 获取到的权限数据
            this.rightsList = res.data;
            console.log(this.rightsList);

            // 递归获取三级节点的id
            this.getLeafKeys(role, this.defKeys);

            this.setRightDialogVisible = true;
        },

        // 获取默认展示项的id
        getLeafKeys(node, arr) {
            // 如果当前node节点不包含children属性，则为三级节点
            if(!node.children) {
                return arr.push(node.id);
            }
            node.children.forEach(item => this.getLeafKeys(item, arr))
        },
        // 权限设置对话框关闭的回调
        setRightDialogClosed() {
            this.defKeys = [];
        },
        // 正式分配权限
        async allotRight() {
            const keys = [
                // 获取所有已选中角色的id数组
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ];
            // 将数组转化为字符串，并指定分隔符
            const idStr = keys.join(',');
            // console.log(keys);
            const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {
                rids: idStr
            });

            if(res.meta.status !== 200) {
                return this.$message.error('分配角色权限失败');
            }

            this.$message.success('分配角色权限成功');
            this.getRoleList();
            this.setRightDialogVisible = false;
        }
    }
}
</script>
 
<style scoped>
.el-tag {
    margin: 10px;
}

.bd-top {
    border-top: 1px solid #eee;
}

.bd-bottom {
    border-bottom: 1px solid #eee
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>