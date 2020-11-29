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

        for (var index in data[0].Time) {
            myData.push({
                time: data[0].Time[index],
                Werktag1: data[0].Werktag[index],
                Werktag2: data[1].Werktag[index],
                Werktag3: data[2].Werktag[index],
                Werktag4: data[3].Werktag[index],
                Werktag5: data[4].Werktag[index],
                Werktag6: data[5].Werktag[index],
            });
        }
        console.log(myData);

        chart.data = myData;
        chart.dateFormatter.inputDateFormat = 'HH:mm:ss';
        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.minGridDistance = 30;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // Create series
        function createSeries(field, name) {
            var series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = field;
            series.dataFields.dateX = 'time';
            series.name = name;
            series.tooltipText = '{dateX}: [b]{valueY}[/]';
            series.strokeWidth = 2;

            series.smoothing = 'monotoneX';

            // var bullet = series.bullets.push(new am4charts.CircleBullet());
            // bullet.circle.stroke = am4core.color('#fff');
            // bullet.circle.strokeWidth = 2;

            return series;
        }

        createSeries('Werktag1', 'Werktag #1');
        createSeries('Werktag2', 'Werktag #2');
        createSeries('Werktag3', 'Werktag #3');
        createSeries('Werktag4', 'Werktag #4');
        createSeries('Werktag5', 'Werktag #5');

        createSeries('Werktag6', 'Werktag #6');

        chart.legend = new am4charts.Legend();
        chart.cursor = new am4charts.XYCursor();
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
