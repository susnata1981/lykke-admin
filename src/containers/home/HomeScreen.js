import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fprice } from '../../common/util'
import moment from 'moment'
import _ from 'lodash';
import styles from '../../styles/test.scss'


const STATUS_COMPLETE = 'COMPLETE';
const TIMEUNIT = Object.freeze({ DAY: 1, WEEK: 2, MONTH: 3 });

export default class HomeScreen extends Component {

  static propTypes = {
    businessList: PropTypes.object.isRequired,
    checkins: PropTypes.object.isRequired,
    _getCheckins: PropTypes.func.isRequired,
    _getBusinessList: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      completedCheckins: [],
      incompleteCheckins: [],
      libraryLoaded: false,
      timeUnitForRevenueChart: TIMEUNIT.DAY,
      timeUnitForVisitsChart: TIMEUNIT.DAY,
    }
  }

  componentWillReceiveProps(nextProps) {
    const completedCheckins = Object.keys(nextProps.checkins)
      .map(key => nextProps.checkins[key])
      .filter(item => item.status === STATUS_COMPLETE)

    const incompleteCheckins = Object.keys(nextProps.checkins)
      .map(key => nextProps.checkins[key])
      .filter(item => item.status !== STATUS_COMPLETE)

    this.setState({
      completedCheckins,
      incompleteCheckins,
    });
    console.log('Unfinished checkins');
    console.log(incompleteCheckins);
  }

  componentDidMount() {
    this.props._getCheckins();
    this.props._getBusinessList();
    this.props._getItems();
    window.google.charts.load('current', { 'packages': ['corechart'] });

    window.google.charts.setOnLoadCallback(() => {
      this.setState({ libraryLoaded: true });
    });
  }

  groupCheckins = () => {
    const dayToCheckinMap = {};
    this.state.completedCheckins.forEach(item => {
      let date = new Date(item.timeCreated).toLocaleDateString();
      dayToCheckinMap[date] = dayToCheckinMap[date] || [];
      dayToCheckinMap[date].push(item);
    });

    return dayToCheckinMap;
  }

  /**
   * TimeUnit -> ['DAY', 'WEEK', 'MONTH']
   */
  group = (checkins = [], timeUnit = TIMEUNIT.DAY) => {
    if (checkins.length == 0) {
      return [];
    }

    switch (timeUnit) {
      case TIMEUNIT.WEEK:
        return _(checkins).groupBy(d => {
          let s = moment(d.timeCreated);
          let e = moment(d.timeCreated).add(-1, 'w');
          const unit = 'week';
          d['key'] = `${moment(d.timeCreated).startOf(unit).format('MM/DD/YY')} - ${moment(d.timeCreated).endOf(unit).format('MM/DD/YY')}`;
          return moment(d.timeCreated).startOf('week');
        }).value();
      case TIMEUNIT.MONTH:
        return _(checkins).groupBy(d => {
          const unit = 'month';
          d['key'] = `${moment(d.timeCreated).startOf(unit).format('MM/DD/YY')} - ${moment(d.timeCreated).endOf(unit).format('MM/DD/YY')}`;
          return moment(d.timeCreated).month();
        }).value();
      case TIMEUNIT.DAY:
      default:
        return _(checkins).groupBy(d => {
          const unit = 'day';
          d['key'] = `${moment(d.timeCreated).startOf(unit).format('MM/DD/YY')}`;
          return moment(d.timeCreated).day();
        }).value();
    }
  }

  getTimeUnitString = (timeUnit) => {
    return Object.keys(TIMEUNIT).filter(item => TIMEUNIT[item] === timeUnit);
  }

  drawSaleAndPaymentChart = (timeUnit = TIMEUNIT.DAY) => {
    if (this.state.completedCheckins.length == 0) {
      return;
    }

    var data = new window.google.visualization.DataTable();
    data.addColumn('string', this.getTimeUnitString(timeUnit));
    data.addColumn('number', 'Sales');
    data.addColumn('number', 'Payment');

    const dayToCheckinsMap = this.group(this.state.completedCheckins, timeUnit);

    const allData = [];
    Object.keys(dayToCheckinsMap).map((date, i) => {
      let checkinItems = dayToCheckinsMap[date];
      let totalSales = checkinItems.reduce((sum, curr) => sum = sum + curr.order.total, 0);
      let totalPayment = checkinItems.reduce((sum, curr) => sum = sum + curr.payment.amount, 0);
      let totalVisits = checkinItems.length;
      allData.push([checkinItems[0].key, totalSales, totalPayment]);
    });
    data.addRows(allData);

    var options = {
      chart: {
        title: 'Revenue + Payment',
      },
      series: {
        0: { axis: 'Sales', lineWidth: 4, pointSize: 8 },
        1: { axis: 'Payment', lineWidth: 4, pointSize: 8 },
      },
      chartArea: {
        top: 60,
      },
      axes: {
        y: {
          Sales: { label: 'Sales (Rs)' },
          Payment: { label: 'Payment (Rs)' },
        }
      },
      animation: {
        startup: true,
        duration: 340,
      },
      backgroundColor: '#f2f2f2',
      hAxis: {
        title: `${this.getTimeUnitString(this.state.timeUnitForRevenueChart)}`
      },
      vAxis: {
        title: 'Money (Rs.)',
      },
    };
    var chart = new window.google.visualization.LineChart(document.getElementById('chart1'));
    chart.draw(data, options);
  }

  drawVisitCountChart = (timeUnit = TIMEUNIT.DAY) => {
    if (this.state.completedCheckins.length == 0) {
      return;
    }

    var data = new window.google.visualization.DataTable();
    data.addColumn('string', this.getTimeUnitString(timeUnit));
    data.addColumn('number', 'Total Visits');
    const dayToCheckinsMap = this.group(this.state.completedCheckins, timeUnit);

    const allData = [];
    Object.keys(dayToCheckinsMap).map((date, i) => {
      let checkinItems = dayToCheckinsMap[date];
      let totalVisits = checkinItems.length;
      allData.push([checkinItems[0].key, totalVisits]);
    });
    data.addRows(allData);

    var options = {
      chart: {
        title: 'Visits',
      },
      backgroundColor: `${styles.primaryLight}`,
      animation: {
        startup: true,
        duration: 340,
      },
      series: {
        0: { axis: 'Visit', lineWidth: 4, pointSize: 8 },
      },
      chartArea: {
        top: 60,
      },
      hAxis: {
        title: `${this.getTimeUnitString(this.state.timeUnitForVisitsChart)}`
      },
      vAxis: {
        title: 'Count',
      },
      lineWidth: 4,
    };
    var chart = new window.google.visualization.LineChart(document.getElementById('chart2'));
    chart.draw(data, options);
  }

  render() {
    if (this.state.libraryLoaded) {
      this.drawSaleAndPaymentChart(this.state.timeUnitForRevenueChart);
      this.drawVisitCountChart(this.state.timeUnitForVisitsChart);
    }
    console.log('this.state.completedCheckins');
    console.log(this.state.completedCheckins);
    const totalSales = this.state.completedCheckins.reduce((sum, curr) => _.get(curr, 'order.total', 0) + sum, 0);
    const totalPayments = this.state.completedCheckins.reduce((sum, curr) => sum + _.get(curr, 'payment.amount', 0), 0);

    console.log(totalSales);
    return (
      <div>
        <div className='row'>
          <div className='col-md-6'>
            <div className=''>
              <h3 className='textPrimary text-center'>Total Sales</h3>
              <h1 className='display-4 textPrimaryDark text-center'>{fprice(totalSales)}</h1>
            </div>
          </div>
          <div className='col-md-6'>
            <div className=''>
              <h3 className='textPrimary text-center'>Total Payment Received</h3>
              <h1 class="display-4 textPrimaryDark text-center">{fprice(totalPayments)}</h1>
            </div>
          </div>
        </div>
        <div className='row my-4'>
          <div className='col-md-6'>
            <div className='p-2' style={styles.bgPrimaryDark}>
              <h3 className='textPrimary text-center'>Total Visits</h3>
              <h1 class="display-4 textPrimaryDark text-center">{this.state.completedCheckins.length}</h1>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='p-2' style={styles.bgPrimaryDark}>
              <h3 className='textPrimary text-center'>Total Unfinished Visits</h3>
              <h1 class="display-4 textPrimaryDark text-center">{this.state.incompleteCheckins.length}</h1>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='offset-md-9'>
            <button className='btn btn-link' onClick={() => { this.setState({ timeUnitForRevenueChart: TIMEUNIT.DAY }) }}><p className='small m-0 p-0'>DAY</p></button>
            <button className='btn btn-link' onClick={() => { this.setState({ timeUnitForRevenueChart: TIMEUNIT.WEEK }) }}><p className='small m-0 p-0'>WEEK</p></button>
            <button className='btn btn-link' onClick={() => { this.setState({ timeUnitForRevenueChart: TIMEUNIT.MONTH }) }}><p className='small m-0 p-0'>MONTH</p></button>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div id="chart1" style={chart}>
            </div>
          </div>
        </div>

        <div className='row mt-4'>
          <div className='offset-md-9'>
            <button className='btn btn-link' onClick={() => { this.setState({ timeUnitForVisitsChart: TIMEUNIT.DAY }) }}><p className='small m-0 p-0'>DAY</p></button>
            <button className='btn btn-link' onClick={() => { this.setState({ timeUnitForVisitsChart: TIMEUNIT.WEEK }) }}><p className='small m-0 p-0'>WEEK</p></button>
            <button className='btn btn-link' onClick={() => { this.setState({ timeUnitForVisitsChart: TIMEUNIT.MONTH }) }}><p className='small m-0 p-0'>MONTH</p></button>
          </div>
        </div>

        <div className='row'>
          <div className='col-md-12'>
            <div id="chart2" style={chart}>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

const chart = {
  height: 500,
}
