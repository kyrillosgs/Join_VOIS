import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.css'],
})
export class AddCandidateComponent implements OnInit {
  addCandidateForm!: FormGroup;
  protected submitted: Boolean = false;
  public pdfToUpload!: string;
  private newFile!: File | null;
  error = '';
  loading = false;
  pdfSubmitted = false;
  sizeError = false;
  formatError = false;
  pdfSize!: number | string;
  pdfName = '';

  clearPDF() {
    this.error = this.pdfName = this.pdfSize = this.pdfToUpload = '';
    this.loading =
      this.pdfSubmitted =
      this.sizeError =
      this.formatError =
        false;
    (document as any)
      .querySelector('#ccv')
      .querySelector('.p-fileupload-content')
      .querySelector('p-progressbar').hidden = true;
  }

  pdfError(err: string) {
    if (err) {
      this.pdfSubmitted = true;
      (this as any)[err] = true;
    }
    this.pdfToUpload = '';
    this.newFile = null;
    (document.querySelector('#ccv') as any).value = '';
  }

  pdfChange = (e: any) => {
    this.pdfSubmitted = true;
    this.sizeError = false;
    this.formatError = false;
    let files = e.files;
    if (files && files[0]) {
      this.pdfSize = (files[0].size / 1024 / 1024).toFixed(4);
      this.pdfName = files[0].name;
      let filesize = this.pdfSize;
      if (files[0].type !== 'application/pdf') {
        this.pdfError('formatError');
        return;
      } else if ((filesize as any) > 10) {
        this.pdfError('sizeError');
        return;
      }
      this.newFile = files.item(0);
      var reader = new FileReader();

      reader.onload = (e) => {
        this.pdfToUpload = (e.target as any).result;
      };

      reader.readAsDataURL(files[0]);
      this.pdfSubmitted = false;
      try {
        if (
          (document as any)
            .querySelector('#ccv')
            .querySelector('.p-fileupload-content')
            .querySelector('p-progressbar').hidden
        )
          (document as any)
            .querySelector('#ccv')
            .querySelector('.p-fileupload-content')
            .querySelector('p-progressbar').hidden = false;
      } catch (er) {}
    } else {
      this.pdfToUpload = '';
    }
  };

  set submit(val: Boolean) {
    this.submitted = val;
  }

  constructor(private formBuilder: FormBuilder) {}

  get f() {
    return this.addCandidateForm.controls;
  }

  add() {}

  async ngOnInit(): Promise<void> {
    this.addCandidateForm = this.formBuilder.group({
      Name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]+(([',. -][a-zA-Z])?[a-zA-Z]*)*$/u),
          Validators.minLength(3),
        ],
      ],
      Email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i),
        ],
      ],
      Phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/u),
          Validators.minLength(4),
        ],
      ],
      CV: [this.pdfToUpload],
    });
  }
}
