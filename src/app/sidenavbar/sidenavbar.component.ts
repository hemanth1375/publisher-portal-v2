// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-sidenavbar',
//   templateUrl: './sidenavbar.component.html',
//   styleUrl: './sidenavbar.component.css'
// })
// export class SidenavbarComponent {

// }



import {BreakpointObserver, MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, ViewChild, inject} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router } from '@angular/router';

/** @title Responsive sidenav */
@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrl: './sidenavbar.component.css',
  // standalone: true,
  // imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule],
})
export class SidenavbarComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  // fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  // fillerContent = Array.from(
  //   {length: 50},
  //   () =>
  //     `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  //      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
  //      laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
  //      voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  //      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
  // );

  private _mobileQueryListener: () => void;
sidebarView:any;
isSidebarExpanded = false;
@ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile= true;
  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if(screenSize.matches){
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }
  isCollapsed = true;
  toggleMenu() {
    console.log(this.sidebarView);
    
    if(this.isMobile){
      this.sidenav.toggle();
      this.isCollapsed = false; // On mobile, the menu can never be collapsed
    } else {
      
      if(this.sidebarView=='over'){
        this.sidenav.toggle();
        this.isCollapsed = false;
      }else{
        this.sidenav.open(); // On desktop/tablet, the menu can never be fully closed
        this.isCollapsed = !this.isCollapsed;
      }
      
      
    }
  }
  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
  constructor( private router:Router,private observer: BreakpointObserver) {
    this.router.events.subscribe(() => {
      if(this.router.url === '/apis'){
        this.sidebarView="side"
      }else{
this.sidebarView="over"
      }
      // this.sidebarView = this.router.url !== '/apis';
    });
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}