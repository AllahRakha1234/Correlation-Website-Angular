import { Component, Input } from '@angular/core';
import {OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as ss from 'simple-statistics';
import { Chart, LinearScale, ScatterController, PointElement, Tooltip, Title } from 'chart.js';
import { DataService } from '../../data.service';


@Component({
  selector: 'app-corr-logic',
  templateUrl: './corr-logic.component.html',
  styleUrls: ['./corr-logic.component.css']
})

// export class CorrLogicComponent {
//   // Example data
//   data1 = [1, 2, 3, 4, 5];
//   data2 = [2, 4, 6, 8, 10];
//   correlation_result:number = 0;

//   constructor() {
//     // Calculate Pearson correlation coefficient
//     const correlation = ss.sampleCorrelation(this.data1, this.data2);
//     this.correlation_result = parseFloat(correlation.toFixed(2));

//     console.log('Correlation coefficient:', this.correlation_result);
//   }
// }

export class CorrLogicComponent implements OnInit, AfterViewInit {

  @Input() xValues_corr: string = '';
  @Input() yValues_corr: string = '';
  data1: number[] = [];
  data2: number[] = [];
  correlation_result: number = 0;

  // Add this line to declare chartCanvas
  @ViewChild('correlationChart') chartCanvas!: ElementRef;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Subscribe to the calculateClicked event directly from the service
    this.dataService.calculateClicked$.subscribe(event => {
      
      // Check if the values are not empty
      if (event.x.trim() !== '' && event.y.trim() !== '') {
        // Set the xValues_app and yValues_app properties
        this.xValues_corr = event.x;
        this.yValues_corr = event.y;
        // Assuming xValues_corr and yValues_corr are strings like '[1, 2, 3]'->converting to number
        // Remove brackets and single quotes
        this.xValues_corr = this.xValues_corr.replace(/[\[\]']+/g, ''); 
        this.yValues_corr = this.yValues_corr.replace(/[\[\]']+/g, '');
        this.data1 = this.xValues_corr.split(',').map(Number);
        this.data2 = this.yValues_corr.split(',').map(Number);

        // Perform any additional logic or calculations if needed

        // Check if the arrays have the same length
        if (this.data1.length !== this.data2.length) {
          console.error('X and Y values must have the same length for correlation calculation.');
          return;
        }

        // Log the values (replace with actual logic)
        console.log('X Values (app-corr-logic):', this.data1);
        console.log('Y Values (app-corr-logic):', this.data2);
        const correlation = ss.sampleCorrelation(this.data1, this.data2);
        this.correlation_result = parseFloat(correlation.toFixed(2));
        console.log('Correlation coefficient:', this.correlation_result);

        // After receiving data and calculating correlation, draw the chart
        this.drawCorrelationChart();
      } 
    });
  }


  ngAfterViewInit() {
    // Register required elements and plugins
    Chart.register(LinearScale, ScatterController, PointElement, Tooltip, Title);
    // Do not draw the chart here; it will be drawn after receiving data and calculating correlation in ngOnInit
  }


  drawCorrelationChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
  
    // Destroy existing chart if it exists
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }
  
    const data = {
      datasets: [
        {
          label: 'Scatter Plot',
          data: this.data1.map((value, index) => ({ x: value, y: this.data2[index] })),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 3,
          pointRadius: 1,
          pointHoverRadius: 8,
        }
      ]
    };
  
    const options = {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
        },
        y: {
          type: 'linear',
          position: 'left',
        },
      },
      maintainAspectRatio: false,
      responsive: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      width: 800, // Set the fixed width of the graph
      height: 800,
      devicePixelRatio: 2, // Adjust the devicePixelRatio for better clarity
    } as any;
  
    new Chart(ctx, {
      type: 'scatter',
      data: data,
      options: options
    });
  }

  
}


