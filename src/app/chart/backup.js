import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from '../api.service';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css'],
})
export class ChartComponent {
    private chart: am4charts.XYChart;
    data: any = [];

    constructor(
        @Inject(PLATFORM_ID) private platformId,
        private zone: NgZone,
        private api: ApiService
    ) { }

    ngOnInit() {
        this.api.fetchData().subscribe((res) => {
            this.data['Winter'] = res['one day load profile'].Winter;
            this.data['Summer'] = res['one day load profile'].Summer;
            this.data['Rest'] = res['one day load profile'].Rest;
            // console.log("data", this.data["Winter"]?.Time);
        });
    }

    // Run the function only in the browser
    browserOnly(f: () => void) {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                f();
            });
        }
    }

    displayChart(data, chartTitle) {
        am4core.useTheme(am4themes_animated);

        let chart = am4core.create(chartTitle, am4charts.XYChart);
        chart.paddingRight = 20;

        let myData = [];
        let colors = [
            am4core.color('red'),
            am4core.color('blue'),
            am4core.color('green'),
            am4core.color('purple'),
            am4core.color('orange'),
            am4core.color('yellow'),
            am4core.color('brown'),
        ];

        for (let i = 0; i < data.length; i++) {
            for (var index in data[i].Time) {
                myData.push({
                    time: data[i].Time[index],
                    Werktag: data[i].Werktag[index],
                    lineColor: colors[0],
                });
            }
        }
        console.log(myData);
        debugger;
        chart.data = myData;
        chart.dateFormatter.inputDateFormat = 'HH:mm:ss';

        let title = chart.titles.create();
        title.text = chartTitle;
        title.fontSize = 25;
        title.marginBottom = 30;

        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());

        // dateAxis.baseInterval = {
        //   timeUnit: "minute", "count": 60
        // }
        // dateAxis.renderer.grid.template.location= 1;
        // dateAxis.renderer.minGridDistance = 15;
        // dateAxis.renderer.labels.template.location = 0.0001;

        dateAxis.renderer.labels.template.rotation = -90;
        dateAxis.renderer.labels.template.horizontalCenter = 'middle';
        dateAxis.renderer.labels.template.verticalCenter = 'middle';

        dateAxis.title.text = 'Time';
        // title.fontSize = 15 ;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        // valueAxis.renderer.baseGrid.disabled = true;
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minWidth = 35;
        valueAxis.title.text = 'WerkTag';

        title.fontSize = 15;

        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = 'time';
        series.dataFields.valueY = 'Werktag';

        //series.tooltipText = '{time}: {valueY.value}';

        series.propertyFields.stroke = 'lineColor';
        series.propertyFields.fill = 'lineColor';

        // var circleBullet = series.bullets.push(new am4charts.CircleBullet());
        // circleBullet.circle.stroke = am4core.color('#fff');
        // circleBullet.circle.strokeWidth = 2;
        // circleBullet.tooltipText = 'Value: [bold]{valueY.value}[/]';

        chart.cursor = new am4charts.XYCursor();

        // let scrollbarX = new am4charts.XYChartScrollbar();
        // scrollbarX.series.push(series);
        // chart.scrollbarX = scrollbarX;

        this.chart = chart;
    }

    ngAfterViewInit() {
        setTimeout(() => {
            // Chart code goes in here
            this.browserOnly(() => {
                this.displayChart(this.data['Winter'], 'Winter');
            });
        }, 1500);

        setTimeout(() => {
            // Chart code goes in here
            this.browserOnly(() => {
                this.displayChart(this.data['Summer'], 'Summer');
            });
        }, 1500);

        setTimeout(() => {
            // Chart code goes in here
            this.browserOnly(() => {
                this.displayChart(this.data['Rest'], 'Rest');
            });
        }, 1500);
    }

    ngOnDestroy() {
        // Clean up chart when the component is removed
        this.browserOnly(() => {
            if (this.chart) {
                this.chart.dispose();
            }
        });
    }
}
