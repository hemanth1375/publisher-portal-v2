import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SecurityAuthService } from '../services/security-auth.service';
import { Subscription } from 'rxjs';
import { CommunicationService } from '../services/communication.service';
import { ApplicationService } from '../services/application.service';




@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrl: './application.component.css'
})
export class ApplicationComponent {

  // displayedColumns: string[] = ['name', 'owner', 'policy', 'workstatus', 'subscriptions', 'actions'];
  displayedColumns: string[] = ['clientId', 'name', 'protocol', 'description', 'baseUrl', 'action'];

  // dataSource = this.applicationResults;
  private subscription: Subscription
  consumerId: any

  navigateToDetails(applicationId: string): void {

    // this.router.navigate([`viewgateway/${id}/dashboard`], { relativeTo: this.route })
    this.router.navigate([`viewapplication/${applicationId}/overview`], { relativeTo: this.route })
    this.isShowApplication = false
  }
  applicationId: any
  isShowApplication: boolean = true
  // isShowParent: boolean = true
  entireJsonData: any
  savedAuthApiKeysResults: any
  goToCreateApplication() {
    this.router.navigate(['createapplication'], { relativeTo: this.route })
    this.isShowApplication = false
  }

  deleteApplication(applicationId: any) {

    this.applicationSrv.deleteApplications(applicationId).subscribe({
      next: (res: any) => {
        console.log("result", res)
        this.getApplications()

      },
      error: (err: any) => {
        console.log("error", err)
      }
    })


  }

  goToviewApplication(item: any) {
    this.router.navigate(['viewapplication'], {
      relativeTo: this.route, // Set relative navigation
      state: { data: item } // Pass state
    }); this.isShowApplication = false
  }

  // applicationdata: application[] = [{
  //   id: 1,
  //   applicationName: "massilapp",
  //   sharedQuota: "10PerMin",
  //   description: "this is the massilapp"
  // }]

  constructor(private router: Router, private route: ActivatedRoute, private securityAuthService: SecurityAuthService, private communicationSer: CommunicationService, private applicationSrv: ApplicationService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(this.router.url);
        if (this.router.url === `/consumers/${this.consumerId}/application`) {
          this.isShowApplication = true;
        } else if (this.router.url === `/consumers/${this.consumerId}/application/createapplication`) {
          this.isShowApplication = false;
        } else if (this.router.url === `/consumers/${this.consumerId}/application/viewapplication`) {
          this.isShowApplication = false
        }
      }
    });

    this.subscription = this.communicationSer.applicationCreated$.subscribe(
      (updatedData: any) => {
        console.log('Updated data received from child component!', updatedData);
        this.getApplications()
      }
    )
  }

  applicationResults: any[] = []
  getApplications() {
    this.applicationSrv.getApplication(this.consumerId).subscribe({
      next: (res) => {
        console.log("result", res);
        this.applicationResults = res.applications
        console.log("applicationResults", this.applicationResults);

      },
      error: (err) => {
        console.log("error", err);
        if (err.error.code === 400) {
          this.applicationResults = []
          console.log("applicationResults", this.applicationResults);
        }
      }
    })
  }

  ngOnInit() {

    // this.route.parent?.paramMap.subscribe(params => {
    //   console.log(params);

    //   this.consumerId = params.get('consumerId');
    //   console.log('consumerId:', this.consumerId);

    //   if (this.consumerId) {
    //     this.applicationSrv.getApplication(this.consumerId).subscribe({
    //       next: (res) => {
    //         console.log("result", res);
    //         this.applicationResults = res.applications
    //         console.log("applicationResults", this.applicationResults);
    //       },
    //       error: (err) => {
    //         console.log("error", err);
    //       }
    //     })
    //   }
    // });

    this.route.paramMap.subscribe(params => {
      this.consumerId = params.get('consumerId');
      console.log('consumerId ID:', this.consumerId);
      if (this.consumerId) {
        this.applicationSrv.getApplication(this.consumerId).subscribe({
          next: (res) => {
            console.log("result", res);
            this.applicationResults = res.applications
            console.log("applicationResults", this.applicationResults);
          },
          error: (err) => {
            console.log("error", err);
          }
        })
      }
    });
  }

}
