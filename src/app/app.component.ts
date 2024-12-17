import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakEventType, KeycloakService } from 'keycloak-angular';
import { filter } from 'rxjs';
import { MainService } from './services/main.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'publisher-portal';

  constructor(private router:Router, private readonly keycloak:KeycloakService,private mainSer:MainService){}
  ngOnInit(){
    this.keycloak.keycloakEvents$.pipe(filter((e:any) => e.type === KeycloakEventType.OnAuthSuccess))
  .subscribe({
    next:()=>{
const token:any=this.keycloak.getKeycloakInstance().token
      console.log(this.keycloak.getKeycloakInstance().token);
      localStorage.setItem('token',token)
     
      this.keycloak.getKeycloakInstance().loadUserInfo().then((user:any)=>{
      console.log(user);
      // this.getUserDetails(user.sub)
      this.getUserDetails(user.sub, () => {
        localStorage.setItem('userid',user.sub)
        // Navigate to 'apis' only after user details are fetched
        this.router.navigate(['apis']);
      });
      // localStorage.setItem('userid',user.sub)
      // this.router.navigate(['apis']);
      })
      console.log(this.keycloak.getKeycloakInstance().token);
      console.log(this.keycloak.isLoggedIn());
    }})
  }
  // getUserDetails(id:any){
  //   this.mainSer.getUserDetails(id).subscribe({
  //           next:(res)=>{
  //             console.log(res);
              
  //           }
  //   });
  //   }
  getUserDetails(id: any, callback: () => void) {
    this.mainSer.getUserDetails(id).subscribe({
      next: (res) => {
        console.log(res);
        callback(); // Execute callback after fetching user details
      },
      error: (err) => {
        console.error('Failed to fetch user details:', err);
      },
    });
  }
}
