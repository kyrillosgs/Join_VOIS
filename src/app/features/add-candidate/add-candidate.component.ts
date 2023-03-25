import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Candidate } from 'src/app/_models/candidate';
import { State } from 'src/app/_models/enums/state';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.css'],
})
export class AddCandidateComponent implements OnInit {
  addCandidateForm!: FormGroup;
  protected submitted: Boolean = false;
  public pdfToUpload!: string;
  public imgToUpload!: string;
  protected states: any[] = [];
  private newFile!: File | null;
  error = '';
  loading = false;
  pdfSubmitted = false;
  sizeError = false;
  formatError = false;
  pdfSize!: number | string;
  pdfName = '';
  linkedinPrefix: string = 'https://www.linkedin.com/in/';

  clearPDF() {
    this.error = this.pdfName = this.pdfSize = this.pdfToUpload = '';
    this.loading =
      this.pdfSubmitted =
      this.sizeError =
      this.formatError =
        false;
    if (
      (document as any)
        .querySelector('#ccv')
        .querySelector('.p-fileupload-content')
        .querySelector('p-progressbar')
    )
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

  imgChange(e: any) {
    let files = e.files;
    if (files && files[0]) {
      this.newFile = files.item(0);
      var reader = new FileReader();

      reader.onload = (e) => {
        this.imgToUpload = (e.target as any).result;
      };

      reader.readAsDataURL(files[0]);
    } else {
      this.imgToUpload = '';
    }
  }

  set submit(val: Boolean) {
    this.submitted = val;
  }

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private router: Router
  ) {}

  get f() {
    return this.addCandidateForm.controls;
  }

  add() {
    this.f['CV'].setValue(this.pdfToUpload);
    this.f['Image'].setValue(this.imgToUpload);
    if (this.addCandidateForm.invalid) return;
    this.loading = true;
    let cand: Candidate = new Candidate(
      0,
      this.f['Name'].value,
      this.f['Email'].value,
      this.f['Phone'].value,
      this.f['Proposed Position'].value,
      this.f['Current Position'].value,
      this.pdfToUpload,
      this.imgToUpload,
      this.f['State'].value,
      this.f['Comments'].value,
      this.f['Recruiter'].value,
      1,
      this.f['Current Employer'].value,
      this.linkedinPrefix + this.f['Linkedin Profile'].value
    );
    this.dataService.addCandidate(cand).subscribe(
      (data) => {
        if (data.success) {
          this.error = '';
          this.loading = false;
          cand.id = data.data.id;
          this.dataService.allCandidates.push(cand);
          this.dataService.drawBoard();
          this.resetAddCandidateForm();
          this.router.navigate(['/home']);
          this.submit = false;
        } else {
          this.error = data.errors.name;
          this.loading = false;
        }
      },
      (error) => {
        this.error = error;
        this.loading = false;
      }
    );
  }

  public resetAddCandidateForm() {
    (document.querySelector('#cimage') as any).querySelector('button')?.click();
    this.addCandidateForm.reset();
    this.submit = false;
    this.clearPDF();
  }

  async ngOnInit(): Promise<void> {
    for (let i in State)
      this.states.push({ optionLabel: (State as any)[i], optionValue: i });
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
      'Proposed Position': ['', [Validators.required]],
      'Current Position': ['', [Validators.required]],
      'Linkedin Profile': ['', [Validators.required]],
      State: ['', [Validators.required]],
      'Current Employer': ['', [Validators.required]],
      Recruiter: ['', [Validators.required]],
      Comments: ['', [Validators.required]],
      CV: [this.pdfToUpload, [Validators.required]],
      Image: [''],
    });
  }
}
