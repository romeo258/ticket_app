import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LineChartOptions, BarChartOptions, PieChartOptions } from '../../../interface/chartoption';
import { ITicket } from '../../../interface/ticket';
import { AppStore } from '../../../store/app.store';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DataValue } from '../../../pipe/data.pipe';
import { LabelValue } from '../../../pipe/label.pipe';

@Component({
  selector: 'app-dashboard',
  
  templateUrl: './dashboard.component.html',
  imports: [CommonModule, RouterLink, DataValue, LabelValue, NgApexchartsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  store = inject(AppStore);
  lineChartOptions: Partial<LineChartOptions>;
  columnChartOptions: Partial<BarChartOptions>;
  donutChartOptions: Partial<PieChartOptions>;
  pieChartOptions: Partial<PieChartOptions>;
  // private toastService = inject(ToastService);

  constructor() {
    this.lineChartOptions = {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      /* title: {
        text: "Ticket Trends by Week",
        align: "left"
      }, */
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr"
        ]
      }
    };
    this.pieChartOptions = {
      chart: {
        height: 400,
        type: 'pie',
        events: { click(e, chart, options) {
          console.log(e)
          console.log(chart)
          console.log(options)
        },}
      },
      colors:['#F44336', '#E91E63', '#9C27B0'],
      legend: {
        position: 'bottom',
        fontWeight: 300
      }
    };
    this.donutChartOptions = {
      chart: {
        height: 400,
        type: 'donut'
      },
      legend: {
        position: 'bottom',
        fontWeight: 300
      },
      tooltip: {
        enabled: true,
        y: {
            formatter: (value, { series, seriesIndex, dataPointIndex, w }) => {
              return value
            },
            title: {
                formatter: (serie) => `${serie.split(':')[0]}:`,
            },
        }
    }
    };
    this.columnChartOptions = {
      chart: {
        height: 500,
        type: 'bar'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (value) => `${value} total`,
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ['#304758']
        }
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ],
        position: 'top',
        labels: {
          offsetY: -18
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true,
          offsetY: -35
        }
      },
      fill: {
        colors: ['#06A8E0']
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + ' total';
          }
        }
      },
      title: {
        text: 'Breakdown of tickets by status',
        floating: false,
        offsetY: 480,
        align: 'center',
        style: {
          color: '#444'
        }
      }
    };
  }

  ngOnInit(): void {
    this.store?.getAllTickets();
    // interval(1000 * 60 * 1).subscribe(() => {
    //   this.store?.getAllTickets();
    // });
  }

  // showToast = (message: string) => {
  //   this.toastService.show(message)
  // };

  ticketTotalByStatus = (tickets: ITicket[], status: string) => tickets.filter(ticket => ticket.status === status).length;

  ticketsByStatus = (tickets: ITicket[], status: string) => {
    tickets.filter(ticket => ticket.status === status)
      .map(ticket => [{ status: ticket.status, count: ticket.status }]);
  };
}
