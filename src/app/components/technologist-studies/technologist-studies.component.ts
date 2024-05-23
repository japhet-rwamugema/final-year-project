import { Component } from '@angular/core';

@Component({
  selector: 'app-technologist-studies',
  standalone: true,
  imports: [],
  templateUrl: './technologist-studies.component.html',
  styleUrl: './technologist-studies.component.css'
})
export class TechnologistStudiesComponent {

  selectedImages: string[] = []

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImages.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
}
