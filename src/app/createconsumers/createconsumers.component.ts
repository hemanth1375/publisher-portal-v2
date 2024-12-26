import { Component } from '@angular/core';
import { Form, FormGroup, FormBuilder } from '@angular/forms'
import { CreateconsumerService } from '../services/createconsumer.service';
import { Router, ActivatedRoute } from '@angular/router';
import JSEncrypt from 'jsencrypt';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-createconsumers',
  templateUrl: './createconsumers.component.html',
  styleUrl: './createconsumers.component.css'
})
export class CreateconsumersComponent {

  creatConsumerFormGroup: FormGroup

  data!: any
  constructor(private fb: FormBuilder, private cconsumersrv: CreateconsumerService, private router: Router, private route: ActivatedRoute, private communicationSer: CommunicationService) {
    this.creatConsumerFormGroup = this.fb.group({
      username: [''],
      password: [''],
      // confirmPassword: [''],
      email: [''],
      firstName: [''],
      lastName: ['']
    })
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
        this.communicationSer.emitConsumerCreated(res)

      },
      error: (err) => {
        console.log("consumererrorget", err);
      }
    })
    this.router.navigate(['consumers'])

  }



}

