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
                                    <el-descriptions-item label="単位">{{convertUnitName(stockItem.unit)}}
                                    </el-descriptions-item>
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
                                            end-placeholder="終了日" :picker-options="pickerOptions">
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

                            <el-table :data="ioTableDataList" stripe border
                                :default-sort="{prop: 'id', order: 'ascending'}">
                                <el-table-column prop="record_id" align="center" label="記録番号">
                                    <template v-slot="recordIdScope">
                                        {{recordIdScope.row.id+""+recordIdScope.row.inOutNo}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="inOutNo" align="center" label="入出庫回数" v-if="false">
                                </el-table-column>
                                <el-table-column prop="ioType" align="center" label="入出庫タイプ"><template
                                        v-slot="ioTypeScope">{{convertTypeName(ioTypeScope.row.ioType)}}</template>
                                </el-table-column>

                                <el-table-column prop="ioNum" align="center" label="入出庫数量"></el-table-column>
                                <el-table-column prop="updateDate" align="center" label="入出庫日時"><template
                                        v-slot="updateDateScope">
                                        {{ updateDateScope.row.updateDate | convertDate }}
                                    </template></el-table-column>
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
            },
            that: this,
        }
    },
    mounted() {
        this.getStockType();
        this.getIOData();
        console.log(this.$store.state)
    },
    methods: {
        getIOData() {
            this.$store.dispatch("getIOData").then((res) => {
                this.pagination.pageSize = this.$store.state.size;
                this.pagination.currentPage = this.$store.state.current;
                this.pagination.total = this.$store.state.total;
                this.ioTableDataList = this.$store.state.ioRecords;
            }).catch(err => console.log(err));
            this.stockItem.name = this.$route.params.name;
            this.stockItem.num = this.$route.params.io_num;
            this.stockItem.unit = this.$route.params.unit_id;
        },
        getStockType() {
            this.$store.dispatch("getStockType").then((res) => {
                this.ioTypeOptions = this.$store.state.codeNameList;
            }).catch(err => console.log(err));
        },
        searchIOInfo() {
            // let params = {
            //     date: this.searchForm.date,
            //     type: this.searchForm.stockType
            // }

            let param = "?date=" + this.searchForm.date;
            param += "&type=" + this.searchForm.stockType;

            if (this.searchForm.date == '' && this.searchForm.stockType == '') {
                return;
            }
            if (this.searchForm.date !== null) {
                this.$axios.get("/api1/stocks/io/" + this.$store.state.stock_id + "/search/" + this.pagination.currentPage + "/" + this.pagination.pageSize + param).then((res) => {
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
                params: {
                    stock_id: this.$store.state.stock_id,
                }
            })
        },
        handleBack() {
            this.$router.push({
                name: 'home',
            })
        },
        convertUnitName(value) {
            const nameList = this.$store.state.unitNameList;
            if (nameList !== '' && nameList !== undefined && nameList !== null) {
                const unitName = nameList.find((item) => { return item.unit_id === value });
                if (unitName != undefined) {
                    return unitName.name;
                } else {
                    return value;
                }
            } else {
                return value;
            }
        },
        convertTypeName(value) {
            const typeList = this.$store.state.codeNameList;
            if (typeList !== '' && typeList !== undefined && typeList !== null) {
                const codeName = typeList.find((item) => { return item.codeId === value });
                if (codeName != undefined) {
                    return codeName.name;
                } else {
                    return value;
                }
            } else {
                return value;
            }
        },
    },
    computed: {

    },
    filters: {
        convertDate(value) {
            if (value != null) {
                let date = new Date(value);
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '\n ';
                let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
                let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
                let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
                return (Y + M + D + h + m + s);
            }
        },
    },
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
