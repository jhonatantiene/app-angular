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
    const ctx = canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
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

    if (canvas === this.mrrCanvas && this.chartMrr) {
      this.chartMrr.destroy();
    } else if (canvas === this.churnedCanvas && this.chartChurned) {
      this.chartChurned.destroy();
    }

    const chart = new Chart(ctx, {
      type: type,
      data: {
        labels: labels,
        datasets: [
          {
            label: title,
            data: data,
            backgroundColor: color
          },
        ],
      },
      options: chartOptions,
    });

    if (canvas === this.mrrCanvas) {
      this.chartMrr = chart;
    } else if (canvas === this.churnedCanvas) {
      this.chartChurned = chart;
    }
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData: FormData = new FormData();
    formData.append('file', file);

    this.crud.processFileCsv(formData).subscribe((res) => {
      this.buttonYears = true;
      this.file = res;
      this.years = []
      res.forEach((v) => {
        this.years.push(v.year);
      });
    });
  }

  async updateMrrAndChurned(year: string) {
    await this.updateMrr(year);
    await this.updateChurned(year);
  }

  async updateMrr(year: string) {
    const labels = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];
    const data = [];

    for (const value of this.file) {
      if (value.year === year) {
        for (const mrr of value.monthlyMetrics) {
          data.push(mrr.mrr);
        }
        this.createChart(this.mrrCanvas, 'bar', labels, 'Monthly Recurring Revenue (MRR)', data);
        break;
      }
    }
  }

  async updateChurned(year: string) {
    const labels = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];
    const data = [];

    for (const value of this.file) {
      if (value.year === year) {
        for (const churn of value.monthlyMetrics) {
          data.push(churn.churnRate);
        }
        this.createChart(this.churnedCanvas, 'bar', labels, 'Churn Rate', data, 'rgba(255, 0, 0, 0.432)');
        break;
      }
    }
  }
}
