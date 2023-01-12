import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AppService } from './app.service';
import { ReplaceTarget,TransFile,TransResult } from './model/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  content:string = '';
  replaceTargets: ReplaceTarget[] = [];

  public formGroup: FormGroup = this.formBuilder.group({
    path: [null, Validators.required],
    charset: ['UTF-8', Validators.required],
    defaultLocalePath: [null, Validators.required],
    enLocalePath: [null, Validators.required],
  });

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService) {}

  ngOnInit(): void {
    this.formGroup.valueChanges.subscribe((value) => {
      if (value.path && value.charset) {
        this.updatePreview(value);
      }
    });
  }

  updatePreview(transFile: TransFile) {
    this.content = '';
    this.appService.preview(transFile).subscribe(
      res => {
        if (res && res.content) {
          this.content = res.content;
        }
      }
    )
  }

  addReplceTarget() {
    Swal.fire({
      title: '新增key與目標字串, 以 ":" 分開',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        let value:string = result.value;
        if (value.includes(":")) {
          this.addToReplaceTargets(value);
        } else {
          Swal.fire({
            icon: 'error',
            text: '格式錯誤',
          })
        }
      }
    })
  }

  addToReplaceTargets(str:string) {
    let strArray = str.split(":");
    this.replaceTargets.push({
      key: strArray[0],
      targetStr: strArray[1]
    })
  }

  removeThisReplaceTarget(idx:number) {
    this.replaceTargets.splice(idx, 1);
  }

  trans() {
    let obj = this.formGroup.value;
    obj.replaceTargets = this.replaceTargets;
    this.appService.trans(obj).subscribe(
      res => {
        console.log(res);
      }
    )
  }


}
