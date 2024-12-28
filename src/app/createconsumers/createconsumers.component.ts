import { Component } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { CreateconsumerService } from '../services/createconsumer.service';
import { Router, ActivatedRoute } from '@angular/router';
import JSEncrypt from 'jsencrypt';
import { CommunicationService } from '../services/communication.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-createconsumers',
  templateUrl: './createconsumers.component.html',
  styleUrl: './createconsumers.component.css'
})
export class CreateconsumersComponent {

  creatConsumerFormGroup: FormGroup

  data!: any
  constructor(private fb: FormBuilder, private cconsumersrv: CreateconsumerService, private router: Router,
    private route: ActivatedRoute, private communicationSer: CommunicationService,
    private toastService: ToastService
  ) {
    // this.creatConsumerFormGroup = this.fb.group({
    //   username: [''],
    //   password: [''],
    //   // confirmPassword: [''],
    //   email: [''],
    //   firstName: [''],
    //   lastName: ['']
    // })
    this.creatConsumerFormGroup = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      // confirmPassword: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });
    
  }

  showSuccess(message: string) {
    this.toastService.show(message, { type: 'success' });
  }
  showError(message: string) {
    this.toastService.show(message, { type: "error" })
  }

  onSubmitCreatConsumerFormGroup() {
    // console.log("onSubmitCreatConsumerFormGroup", this.creatConsumerFormGroup.value);
    const formData = this.creatConsumerFormGroup.value;
    this.data = this.creatConsumerFormGroup.value
    let publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCAhJikCjIosukIwFkp4Kkv8fv7aJa+NzHJc+V6fCfFgrG1R78M4cXZ9T9Su/U0rHkHZzvPjTQ+fyFcAkQYS/mFDOBM/cNuMYw3LAjYu7rCHbjAkPh8AVaUVupd40aTUymgqo93lWH8BlLMbPFLf5LHiLtRehvNrGHmbolp3WesbwIDAQAB"
    let RSAEncrypt = new JSEncrypt();
    RSAEncrypt.setPublicKey(publicKey);
    let encryptedpassword = RSAEncrypt.encrypt(this.creatConsumerFormGroup.get('password')?.value);
    const payload = {
      username: formData.username,
      password: encryptedpassword,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email
    };
    console.log("************************payload", payload);
    this.cconsumersrv.createConsumer(payload).subscribe({
      next: (res) => {
        console.log("cconsumerpostresults", res);
        this.showSuccess(res?.message);
        this.communicationSer.emitConsumerCreated(res)
      },
      error: (err) => {
        this.showError(err?.message)
        console.log("consumererrorget", err);
      }
    })
    this.router.navigate(['consumers'])

  }



}

