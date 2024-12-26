import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SecurityAuthService } from '../services/security-auth.service';

interface application {
  id: number,
  applicationName: string,
  sharedQuota: string,
  description: string
}
interface PeriodicElement {
  name: string;
  owner: string;
  policy: string;
  workstatus: string;
  subscriptions: string;
  actions: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: 'Resource 1',
    owner: 'Owner A',
    policy: 'Policy X',
    workstatus: 'Active',
    subscriptions: 'Subscription A',
    actions: 'Edit/Delete',
  },
  {
    name: 'Resource 2',
    owner: 'Owner B',
    policy: 'Policy Y',
    workstatus: 'Inactive',
    subscriptions: 'Subscription B',
    actions: 'Edit/Delete',
  },
  {
    name: 'Resource 3',
    owner: 'Owner C',
    policy: 'Policy Z',
    workstatus: 'Active',
    subscriptions: 'Subscription C',
    actions: 'Edit/Delete',
  },
];

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrl: './application.component.css'
})
export class ApplicationComponent {

  displayedColumns: string[] = ['name', 'owner', 'policy', 'workstatus', 'subscriptions', 'actions'];
  dataSource = ELEMENT_DATA;


  navigateToDetails(name: string): void {
    // this.router.navigate(['/details', name]); // Navigates to a "details" route with the name as a parameter
    this.router.navigate(['viewapplication/1/overview'], { relativeTo: this.route })
    this.isShowApplication=false
  }
  isShowApplication: boolean = true
  // isShowParent: boolean = true
  entireJsonData: any
  savedAuthApiKeysResults: any
  goToCreateApplication() {
    this.router.navigate(['createapplication'], { relativeTo: this.route })
    this.isShowApplication = false
  }

  goToviewApplication(item:any) {
    this.router.navigate(['viewapplication'], {
      relativeTo: this.route, // Set relative navigation
      state: { data: item } // Pass state
    });    this.isShowApplication = false
  }

  applicationdata: application[] = [{
    id: 1,
    applicationName: "massilapp",
    sharedQuota: "10PerMin",
    description: "this is the massilapp"
  }]

  constructor(private router: Router, private route: ActivatedRoute, private securityAuthService: SecurityAuthService) {
    this.router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        console.log(this.router.url);

        if (this.router.url === '/consumer/application') {
          this.isShowApplication = true;
        } else if (this.router.url === '/consumer/application/createapplication') {
          this.isShowApplication = false;
        } else if (this.router.url === '/consumer/application/viewapplication') {
          this.isShowApplication = false
        }
      }
    });
  }

  ngOnInit() {
    this.securityAuthService.getSecurityAuth().subscribe({
      next: (result) => {
        console.log("*********************securityAuthServiceresult", result);
        this.entireJsonData = result
        this.savedAuthApiKeysResults = result?.['auth/api-keys']
        console.log("authValidatorArrayResult", this.savedAuthApiKeysResults);
      },
      error: (err) => {
        console.log("securityAuthService error", err);
      }


    })
  }

}
