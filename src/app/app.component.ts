import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CrudService } from './services/crud.service';
import Chart, { ChartType, ChartOptions } from 'chart.js/auto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('mrrCanvas') mrrCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('churnedCanvas') churnedCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private crud: CrudService) {}

  years: string[] = [];
  buttonYears: boolean = false;
  file: any;
  chartMrr: any;
  chartChurned: any;
  selectedYear: string = '';

  ngOnInit(): void {
    // Initialize component
  }

  parseCurrency(value: string): number {
    const cleanedValue = value.replace(/[^\d,.-]/g, '').replace(',', '.');
    return parseFloat(cleanedValue);
  }

  createChart(
    canvas: ElementRef<HTMLCanvasElement>,
    type: ChartType,
    labels: any[],
    title: string,
    data: number[],
    color?: string
  ) {
    const ctx = canvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    const chartOptions: ChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: title,
        },
      },
    };

    const chart = new Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: [
          {
            label: title,
            data: data,
            backgroundColor: color,
          },
        ],
      },
      options: chartOptions,
    });

    return chart;
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData: FormData = new FormData();
    formData.append('file', file);

    if (file.name.includes('.xlsx')) {
      this.crud.processFileXlsx(formData).subscribe((res) => {
        this.buttonYears = true;
        this.file = res;
        this.years = res.map((v: any) => v.year);
      });
    }

    if (file.name.includes('.csv')) {
      this.crud.processFileCsv(formData).subscribe(
        (res) => {
          this.buttonYears = true;
          this.file = res;
          this.years = res.map((v: any) => v.year);
        },
        (error) => {
          console.error('Error processing CSV file:', error);
        }
      );
    }
  }

  async updateMrrAndChurned(year: string) {
    const yearData = this.file.find((data: any) => data.year === year);
    if (!yearData) return;

    const labels = yearData.monthlyMetrics.map((metric: any) => metric.month);
    const mrrData = yearData.monthlyMetrics.map((metric: any) => metric.mrr);
    const churnedData = yearData.monthlyMetrics.map((metric: any) => metric.churnRate);

    if (this.chartMrr) {
      this.chartMrr.destroy();
    }
    this.chartMrr = this.createChart(
      this.mrrCanvas,
      'bar',
      labels,
      'Monthly Recurring Revenue (MRR)',
      mrrData
    );

    if (this.chartChurned) {
      this.chartChurned.destroy();
    }
    this.chartChurned = this.createChart(
      this.churnedCanvas,
      'bar',
      labels,
      'Churn Rate',
      churnedData,
      'rgba(255, 0, 0, 0.432)'
    );
  }
}
