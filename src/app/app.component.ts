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
  transResult:any;

  pathList:string[] = [];

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
      if (value.path) {
        value.filePath = value.path;
        this.getFileLists(value)
      }
      if (value.defaultLocalePath) {
        value.filePath = value.defaultLocalePath;
        this.getFileLists(value);
      }

      if (value.enLocalePath) {
        value.filePath = value.enLocalePath;
        this.getFileLists(value);
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
      title: '新增key與目標字串',
      html:
      '<input id="swal-key" placeholder="key(Locale檔案中的key)" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">'
      + '<br>'
      + '<br>'
      + '<input id="swal-target" placeholder="目標字串" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">',
            preConfirm: function () {
                return new Promise(function (resolve) {
                  let keyDom = document.getElementById('swal-key') as HTMLInputElement;
                  let targetDom = document.getElementById('swal-target') as HTMLInputElement;
                  if (keyDom && targetDom) {
                    resolve([
                      keyDom.value,
                      targetDom.value
                    ])}
            })
            },
      showCancelButton: true,
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(result)
        if (result.value) {
          this.addToReplaceTargets(result.value);
        } else {
          Swal.fire({
            icon: 'error',
            text: '格式錯誤',
          })
        }
      }
    })
  }

  addToReplaceTargets(value:any) {
    if (value[0] && value[1]) {
      this.replaceTargets.push({
        key: value[0],
        targetStr: value[1]
      })
    } else {
      Swal.fire({
        icon: 'error',
        text: '格式錯誤',
      })
    }
  }

  removeThisReplaceTarget(idx:number) {
    this.replaceTargets.splice(idx, 1);
  }

  trans() {
    let obj = this.formGroup.value;
    obj.replaceTargets = this.replaceTargets;
    this.appService.trans(obj).subscribe(
      res => {
        if (res) {
          this.transResult = res;
        } else {
          Swal.fire({
            icon: 'info',
            title: '沒有目標字串需要取代，請確認',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }
    )
  }

  commit() {
    Swal.fire({
      title: '確認後即會更動檔案內容',
      confirmButtonText: 'Confirm',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.appService.commitChange(this.transResult).subscribe(
          res => {
            console.log(res);
            if (res) {
              this.transResult = null;
              this.replaceTargets = [];
              this.updatePreview(this.formGroup.value);
              Swal.fire({
                icon: 'success',
                title: '寫檔成功',
                showConfirmButton: false,
                timer: 900
              })
            } else {
              this.transResult = null;
              Swal.fire({
                icon: 'error',
                title: '寫檔錯誤',
                showConfirmButton: false,
                timer: 900
              })
            }
          })
      }
    })
  }

  cancel() {
    this.transResult = null;
  }

  getFileLists(transFile:TransFile) {
    this.appService.getFileLists(transFile).subscribe(
      res => {
        if (res) {
          this.pathList = res;
        }
      }
    )
  }


}
