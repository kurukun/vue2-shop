<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 2.为 ECharts 准备一个定义了宽高的 DOM -->
            <div id="main" style="width: 800px;height:600px;"></div>
        </el-card>
    </div>
</template>
 
<script>
// 1.导入echarts
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
    name: '',
    components: {
    },
    created() {

    },
    data() {
        return {
            // 用于实现实现图表鼠标跟随效果的配置项
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        }
    },
    // 此时页面上的元素已被渲染完毕
    async mounted() {
        // 3.基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        const { data: res } = await this.$http.get('reports/type/1');
        if (res.meta.status !== 200) {
            return this.$message.error('获取折线图数据失败');
        }

        // 4.指定图表的配置项和数据
        // 使用lodash的merge方法合并两个对象
        const result = _.merge(res.data, this.options)
        // var option = {
        //     title: {
        //         text: 'ECharts 入门示例'
        //     },
        //     tooltip: {},
        //     legend: {
        //         data: ['销量']
        //     },
        //     xAxis: {
        //         data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        //     },
        //     yAxis: {},
        //     series: [
        //         {
        //             name: '销量',
        //             type: 'bar',
        //             data: [5, 20, 36, 10, 10, 20]
        //         }
        //     ]
        // };
        // 5.使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
    },
    methods: {

    }
}
</script>
 
<style scoped></style>