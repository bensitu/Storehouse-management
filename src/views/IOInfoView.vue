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
                            <div class="mt-10 mb-30">
                                <div class="floatLeft">
                                    <h2>入出庫情報一覧</h2>
                                </div>
                                <div class="floatRight">
                                    <el-button class="ml-5" type="info" @click="handleBack()">戻る</el-button>
                                </div>
                                <div class="clearBoth"></div>
                            </div>
                            <div class="mb-20">
                                <el-descriptions style="font-size: 16px;" :column="3">
                                    <el-descriptions-item label="在庫名称">{{stockItem.name}}</el-descriptions-item>
                                    <el-descriptions-item label="単位">{{stockItem.unit}}</el-descriptions-item>
                                    <el-descriptions-item label="在庫数量">{{stockItem.num}}</el-descriptions-item>
                                </el-descriptions>
                                <!-- <div class="mb-20">
                                    <div class="floatLeft" style="width: 33%;">
                                        <p><span class="mr-5">在庫名称：</span><span class="mr-5">ssssssss</span></p>
                                    </div>
                                    <div class="floatLeft" style="width: 33%;">
                                        <p><span class="mr-5">単位：</span><span class="mr-5">個</span>
                                        </p>
                                    </div>
                                    <div class="floatLeft" style="width: 33%;">
                                        <p><span class="mr-5">在庫数量：</span><span class="mr-5">99999</span></p>
                                    </div>
                                    <div class="clearBoth"></div>
                                </div> -->
                            </div>

                            <div class="functionNav mb-20">
                                <div class="searchBox floatLeft">
                                    <div>
                                        <el-date-picker class="mb-10 mr-15" v-model="searchForm.date" type="daterange"
                                            align="right" unlink-panels range-separator="〜" start-placeholder="開始日"
                                            end-placeholder="終了日" :picker-options="pickerOptions" @blur="showInfo()">
                                        </el-date-picker>
                                        <el-select class="mb-10 mr-15" v-model="searchForm.stockType" clearable
                                            placeholder="入出庫タイプ選択">
                                            <el-option v-for="item in ioTypeOptions" :key="item.unit_id"
                                                :label="item.name" :value="item.unit_id">
                                            </el-option>
                                        </el-select>
                                        <el-button class="mb-10" type="primary" icon="el-icon-search"
                                            @click="searchIOInfo()">
                                            検索
                                        </el-button>
                                    </div>
                                </div>
                                <div class="clearBoth"></div>
                            </div>
                            <div class="newRecord mb-20">
                                <el-button type="success" @click="handleCreate()">追加<i
                                        class="el-icon-circle-plus-outline ml-5"></i></el-button>
                            </div>

                            <el-table :data="ioTableDataList" stripe border show-summary :summary-method="getSummaries"
                                :default-sort="{prop: 'id', order: 'ascending'}">
                                <el-table-column prop="record_id" align="center" label="記録番号"></el-table-column>
                                <el-table-column prop="ioType" align="center" label="入出庫タイプ"></el-table-column>
                                <el-table-column prop="ioNum" align="center" label="入出庫数量"></el-table-column>
                                <el-table-column prop="updateDate" align="center" label="入出庫日時"></el-table-column>
                                <el-table-column prop="updateUser" align="center" label="入出庫者"></el-table-column>
                                <el-table-column prop="remarks" align="center" label="備考"></el-table-column>
                            </el-table>
                            <div class="pagination-container">
                                <div class="block mt-5">
                                    <el-pagination class="pagination" @current-change="handleCurrentChange"
                                        :current-page="pagination.currentPage" :page-size="pagination.pageSize" small
                                        layout="total, prev, pager, next" :total="pagination.total">
                                    </el-pagination>
                                </div>
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
    name: 'IOInfoView',
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            stockItem: {
                id: '',
                name: '',
                unit: '',
                num: 0,
            },
            searchForm: {
                date: [],
                stockType: '',
            },
            ioTypeOptions: [],
            ioTableDataList: [],
            io_type: '',
            io_num: 0,
            io_datetime: '',
            io_person: '',
            remarks: '',
            pickerOptions: {
                shortcuts: [{
                    text: '最近一週間',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一ヶ月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三ヶ月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            pagination: {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                search_date: ''
            }
        }
    },
    mounted() {
        this.getStockType();
        this.getIOData();
    },
    methods: {
        async getIOData() {
            this.stockItem.id = this.$route.params.stock_id;
            console.log(this.$route.params);
            this.stockItem.name = this.$route.params.name;
            this.stockItem.num = this.$route.params.io_num;
            //let param = "?id=" + this.stockItem.id;
            await this.$axios.get("/api1/stocks/io/" + this.stockItem.id + "/" + this.pagination.currentPage + "/" + this.pagination.pageSize).then((res) => {
                this.pagination.pageSize = res.data.data.size;
                this.pagination.currentPage = res.data.data.current;
                this.pagination.total = res.data.data.total;
                this.ioTableDataList = res.data.data.records;
            }).catch(err => console.log(err));
        },
        async getStockType() {
            await this.$axios.get("/api1/codes").then((res) => {
                this.ioTypeOptions = res.data.data.map((item, index) => { return Object.assign({}, { 'unit_id': item.codeId, 'name': item.name }) })
            })
        },
        searchIOInfo() {
            let params = {
                date: this.searchForm.date,
                type: this.searchForm.stockType
            }
            let date = "date=" + this.searchForm.date;
            let stockType = "type=" + this.searchForm.stockType;
            if (this.searchForm.date == '' && this.searchForm.stockType == '') {
                return;
            }
            if (this.searchForm.date !== null) {
                // this.$axios({
                //     method: 'GET',
                //     url: '/api/stocks/io/search/',
                //     params: params,
                // }).then()
                this.$axios.get("/api1/stocks/io/search/" + this.pagination.currentPage + "/" + this.pagination.pageSize + "?" + date + "&" + stockType).then((res) => {
                    this.pagination.pageSize = res.data.data.size;
                    this.pagination.currentPage = res.data.data.current;
                    this.pagination.total = res.data.data.total;
                    this.ioTableDataList = res.data.data.records;
                }).catch(err => console.log(err));
            } else {
                this.getIOData();
            }
        },
        handleCurrentChange(currentPage) {
            this.pagination.currentPage = currentPage;
            this.getIOData();
        },

        handleCreate() {
            this.$router.push({
                name: 'addio',
            })
        },
        handleBack() {
            this.$router.push({
                name: 'home',
            })
        },
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合計';
                    return;
                }
                if (index === 1 || index === 3 || index === 4 || index === 5) {
                    sums[index] = '';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);
                    sums[index] += '';
                } else {
                    sums[index] = '';
                }
            });
            return sums;
        },
        showInfo() {
            console.log()
        }
    },
    computed: {
        getRecordId() {
            console.log(this.searchForm.date)

        }
    },
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

.searchBox,
.goBack {
    margin: 10px 0;
}
</style>
