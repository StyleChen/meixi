<template>
  <div class="charts">
    <div class="echart">
      <div ref="echarts1" id="echarts1" :style="{width: '465px', height: '300px'}"></div>
    </div>
    <div class="echart mf">
      <div ref="echarts2" id="echarts2" :style="{width: '465px', height: '300px'}"></div>
    </div>
    <div class="userInfo">
      <Row>
        <Col span="2" style="margin-left: 20px;">
          <h3>用户信息</h3>
        </Col>
        <Col span="18">
          <DatePicker :value="userInfoDate" :options="options3" type="date" style="width: 200px" @on-change='changeUserInfoDate'>
          </DatePicker>
        </Col>
        <Col span="3">
          <h3>
            <Icon type="ios-people-outline" size="28" style="margin-top: 6px;vertical-align: top;"></Icon>
            活跃用户 : <span style="color: var(--theme)">{{totalPage}}</span></h3>
        </Col>
      </Row>
    </div>
    <div style="padding: 20px; background: #fff;">
      <Table :columns="columns" :data="datas"></Table>
      <Page :total='totalPage' :page-size='6' style="margin-top: 20px; float:right;" show-elevator @on-change="changePage"></Page>
    </div>
    <div class='userAll'>
      <DatePicker size="small" :value="userInfoDate" :options="options3" type="month" style="width: 100px" @on-change='changeAllDate'>
      </DatePicker>
    </div>
    <div class='userPay'>
      <DatePicker type="daterange" size="small" :value="value2" confirm placement="bottom-end"
        :options="options3" placeholder="Select date" style="width: 200px" @on-change='changePayDate'></DatePicker>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts';
import apis from '@/apis';

export default {
  data() {
    return {
      myChart1: {},
      myChart2: {},
      xAxisData: [],
      xAxisData2: [],
      seriesData: [],
      seriesData2: [],
      seriesData3: [],
      userInfoDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      value2: [
        `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`,
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      ],
      options3: {
        disabledDate(date) {
          /* eslint-disable */
          return date && date.valueOf() > Date.now();
        },
      },
      columns: [
        {
          title: 'mac地址',
          key: 'mac',
        },
        {
          title: '手机类型',
          key: 'model',
        },
        {
          title: '操作系统',
          key: 'os',
        },
        {
          title: '今日使用时间',
          key: 'date',
        },
        {
          title: '最近使用时间',
          key: 'newly',
        },
        {
          title: '今日使用次数',
          key: 'count',
        },
      ],
      datas: [],
      totalPage: 0,
    };
  },
  methods: {
    // 用户量
    getWeekData(time = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`) {
      this.$http.post(apis.CountUserWeek, { date: time })
        .then(res => res.json()).then((ress) => {
          if (ress.success) {
            this.seriesData = [];
            this.xAxisData = [];
            ress.result.map((val) => {
              this.seriesData.push(val.user);
              this.xAxisData.push(`第${val['wk/mm']}周`);
              return true;
            });
            this.myChart1 = echarts.init(this.$refs.echarts1);
            this.myChart1.setOption({
              title: {
                text: '用户量',
                textStyle: {
                  color: '#333',
                  fontSize: 16,
                  fontWeight: 300,
                },
                top: 10,
                left: 20,
              },
              tooltip: {},
              legend: {
                show: true,
                data: [
                  {
                    name: '用户量',
                  },
                ],
                top: 20,
                right: 20,
              },
              toolbox: {
                show: true,
                orient: 'horizontal',
                itemSize: 15,
                itemGap: 10,
                right: 20,
                showTitle: true,
                feature: {
                  saveAsImage: {
                    type: 'png',
                    backgroundColor: '#fff',
                    excludeComponents: ['toolbox'],
                    show: true,
                    title: '保存为图片',
                    pixelRatio: 1,
                  },
                  dataView: {
                    show: true,
                    title: '数据视图',
                    readOnly: true,
                  },
                },
              },
              xAxis: {
                data: this.xAxisData,
                name: '时间',
              },
              yAxis: {
                name: '活跃用户',
                nameTextStyle: {
                  color: '#ffb94d',
                },
              },
              series: [{
                type: 'line',
                name: '活跃用户',
                showSymbol: true,
                clipOverflow: false,
                data: this.seriesData,
                lineStyle: {
                  normal: {
                    color: '#ffb94d',
                  },
                },
                itemStyle: {
                  normal: {
                    color: '#ffb94d',
                  },
                },
              }],
            });
          }
        });
    },
    // 充值数据
    getPayList(begintime = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`,
      endtime = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`) {
      this.$http.post(apis.CountPayList, { beginTime: begintime, endTime: endtime })
        .then(res => res.json()).then((ress) => {
          if (ress.success) {
            /* eslint-disable */
            this.seriesData3 = [];
            for (let i in ress.result) {
              this.seriesData3.push({
                name: ress.result[i].mode,
                value: ress.result[i].fee,
              });
            }
            this.myChart2 = echarts.init(this.$refs.echarts2);
            this.myChart2.setOption({
              title: {
                text: '充值信息',
                textStyle: {
                  color: '#333',
                  fontSize: 16,
                  fontWeight: 300,
                },
                top: 10,
                left: 20,
              },
              legend: {
                data: this.seriesData3,
                top: 40,
                left: 20,
                icon: 'rect',
              },
              tooltip: {
                trigger: 'item',
                formatter: '{a}<br/>{b} : {c}({d}%)',
              },
              toolbox: {
                show: true,
                orient: 'horizontal',
                itemSize: 15,
                itemGap: 10,
                right: 20,
                showTitle: true,
                feature: {
                  saveAsImage: {
                    type: 'png',
                    backgroundColor: '#fff',
                    excludeComponents: ['toolbox'],
                    show: true,
                    title: '保存为图片',
                    pixelRatio: 1,
                  },
                  dataView: {
                    show: true,
                    title: '数据视图',
                    readOnly: true,
                  },
                },
              },
              series: [{
                type: 'pie',
                name: '活跃用户',
                showSymbol: true,
                clipOverflow: false,
                data: this.seriesData3,
                center: ['50%', '60%'],
                radius: [0, '60%'],
                label: {
                  show: true,
                  formatter: '{b}: {d}: {c}: {d}',
                },
              }],
            });
          }
        });
    },
    // 用户信息列表
    getUserDay(time = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      pageIndexs = 1) {
      this.$http.post(apis.CountUserDay, { date: time, pageIndex: pageIndexs, pageSize: 6 })
        .then(res => res.json()).then((res) => {
          if (res.success) {
            this.datas = res.result.data;
            this.totalPage = res.result.total;
          }
        })
    },
    // 翻页
    changePage(indexs) {
      this.getUserDay(this.userInfoDate, indexs);
    },
    // 用户信息列表日期更改
    changeUserInfoDate(val) {
      this.userInfoDate = val;
      this.getUserDay(val, 1);
    },
    // 用户量日期更改
    changeAllDate(val) {
      this.getWeekData(val);
    },
    // 充值数据日期更改
    changePayDate(val) {
      this.getPayList(val[0], val[1]);
    },
  },
  mounted() {
    this.getWeekData();
    this.getPayList();
    this.getUserDay();
  },
};
</script>
<style scoped>
  .charts {
    width: calc(100% + 40px);
    height: 100%;
    background: #edeff1;
    margin: 0 -20px;
    position: relative;
  }
  .echart {
    width: 465px;
    height: 300px;
    float: left;
    background: #ffffff;
    margin-bottom: 10px;
  }
  .mf {
    margin-left: 10px;
  }
  .userInfo {
    line-height: 40px;
    background: #fff;
    margin-top: 10px;
    clear: both;
    padding-top: 15px;
  }
  .userAll {
    position: absolute;
    top: 12px;
    left: 80px;
    z-index: 99;
  }
  .userPay {
    position: absolute;
    right: 170px;
    top: 12px;
    z-index: 99;
  }
</style>

