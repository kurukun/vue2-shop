<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <el-table :data="cateList" style="width: 100%;margin-bottom: 20px;" row-key="cat_id" border
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                <el-table-column prop="cat_name" label="分类名称">
                </el-table-column>
                <el-table-column label="是否有效">
                    <template slot-scope="scope">
                        <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
                        <i class="el-icon-error" v-else style="color: red"></i>
                    </template>
                </el-table-column>
                <el-table-column label="排序">
                    <template slot-scope="scope">
                        <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                        <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                        <el-tag type="warning" size="mini" v-else>三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDiologClosed">
            <!-- 添加分类的表单 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- options 用来指定数据源 -->
                    <!-- props 用来指定配置对象 -->
                    <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps"
                        @change="parentCateChanged" clearable>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
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
            // 查询条件
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 商品分类的数据列表，默认为空
            cateList: [],
            // 总数据条数
            total: 0,
            // 控制添加分类对话框的显示与隐藏
            addCateDialogVisible: false,
            // 添加分类的表单数据
            addCateForm: {
                // 将要添加的分类的名称
                cat_name: '',
                // 父级分类的id
                cat_pid: 0,
                // 分类的等级，默认为一级分类
                cat_level: 0,
            },
            // 添加分类的表单的验证规则对象
            addCateFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            // 父级分类的列表
            parentCateList: [],
            // 指定级联选择器的配置对象
            cascaderProps: {
                expandTrigger: 'hover',
                // 选中之后实际获得的值
                value: 'cat_id',
                // 选项展示的值
                label: 'cat_name',
                // 实现嵌套的属性
                children: 'children',
                // 实现一级节点可选
                checkStrictly: true
            },
            // 选中的分级分类的id数据
            selectedKeys: []
        }
    },
    created() {
        this.getCateList();
    },
    methods: {
        // 获取商品分类数据
        async getCateList() {
            const { data: res } = await this.$http.get('categories', {
                params: this.queryInfo
            });
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败');
            }

            // console.log(res.data);
            console.log(res.data.result);
            // 把数据列表，赋值给 cateList
            this.cateList = res.data.result;
            this.total = res.data.total;
        },

        // 分页相关
        // 监听pagesize改变的事件回调，每页多少条数据
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getCateList();
        },
        // 监听 pagenum 改变
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getCateList();
        },
        // 点击按钮，展示添加分类的对话框
        showAddCateDialog() {
            // 先获取父级分类的数据列表再展示对话框
            this.getParentCateList();
            this.addCateDialogVisible = true;
        },
        // 获取父级分类的数据列表
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories?type=2');
            if (res.meta.status !== 200) {
                return this.$message.error('获取父级分类数据失败');
            }
            console.log(res.data);
            this.parentCateList = res.data;
        },
        // 级联选择器选择项发生变化时触发这个函数
        parentCateChanged() {
            // console.log(this.selectedKeys);
            // 如果selectedKeys数组中的长度大于0，证明选中了父级分类，反之没有
            if(this.selectedKeys.length > 0) {
                // 父级分类的id取数组最后一项
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
                // 为当前的分类等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length;
                return;
            }
            this.addCateForm.cat_pid = 0;
            // 为当前的分类等级赋值
            this.addCateForm.cat_level = 0;
        },
        // 点击按钮添加新的分类
        addCate() {
            // console.log(this.addCateForm);
            this.$refs.addCateFormRef.validate(async valid => {
                if(!valid) return;
                const {data: res}  = await this.$http.post('categories', this.addCateForm);
                if(res.meta.status !== 201) {
                    return this.$message.error('添加分类失败！');
                }
                this.$message.success('添加分类成功！');
                this.getCateList();
                this.addCateDialogVisible = false; 
            });
        },
        // 监听对话框的关闭事件，重置表单数据
        addCateDiologClosed() {
            this.$refs.addCateFormRef.resetFields();
            this.selectedKeys = [];
            this.addCateForm.cat_level = 0;
            this.addCateForm.cat_pid = 0;
        }
    }
}
</script>
 
<style scoped>
.el-cascader {
    width: 100%;
}
</style>