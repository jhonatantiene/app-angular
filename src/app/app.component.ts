import { Component, OnInit } from '@angular/core';
import { CrudService } from './services/crud.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private crud: CrudService) {}

  ngOnInit(): void {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const formData: FormData = new FormData();
    formData.append('file', file);

    console.log(formData.get('file'))
    this.crud.processFileCsv(formData).subscribe((res: any) => {
      console.log(res)
    })
  }
}