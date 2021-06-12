import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AuthGuardService } from './service/form/auth/auth-guard.service';
import { GeneralCategoryComponent } from './component/general-category/general-category.component';
import { TypesComponent } from './component/types/types.component';
import { RaceTrackListComponent } from './component/race-track-list/race-track-list.component';
import { SubcategorylistComponent } from './component/subcategorylist/subcategorylist.component';
import { EquipmentsComponent } from './component/equipments/equipments.component';
import { ServicemansComponent } from './component/servicemans/servicemans.component';
import { ServicemanComponent } from './component/serviceman/serviceman.component';
import { LandingPageMainComponent } from './component/landing-page-main/landing-page-main.component';
import { LandingPageListComponent } from './component/landing-page-list/landing-page-list.component';
import { LandingPageDetailsComponent } from './component/landing-page-details/landing-page-details.component';
import { LandingPagePrivacyComponent } from './component/landing-page-privacy/landing-page-privacy.component';
import { AboutUsComponent } from './component/about-us/about-us.component';
import { OurLocationComponent } from "./component/our-location/our-location.component";
import { MechanicsComponent } from "./component/mechanics/mechanics.component";
import { EquipmentsNewComponent } from "./component/equipments-new/equipments-new.component";
import { EventsComponent } from "./component/events/events.component";
const routes: Routes =
  [
    // { path: '', redirectTo: 'login', pathMatch: 'full' },

    // {
    //   path: '', component: SimpleLayoutComponent, data: { title: 'login' },
    //   children: [{ path: 'login', component: LoginComponent },
    //  ]
    // },
    { path: '', component: LandingPageMainComponent, pathMatch: 'full' },
    { path: 'raceTracks', component: LandingPageListComponent },
    { path: 'raceTracks/:id', component: LandingPageDetailsComponent },
    { path: 'privacyPolicy', component: LandingPagePrivacyComponent },
    { path: 'about', component: AboutUsComponent },
    { path: 'locations', component: OurLocationComponent },
    { path: 'mechanics', component: MechanicsComponent },
    { path: 'equipments', component: EquipmentsNewComponent },
    { path: 'events', component: EventsComponent },
    // { path: 'login', component: LoginComponent },
    // {
    //   path: 'component', canActivate: [AuthGuardService], component: FullLayoutComponent, data: { title: 'pages' },
    //   // path: 'component', component: FullLayoutComponent, data: { title: 'pages' },

    //   children: [
      // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
      // { path: 'general-category', component: GeneralCategoryComponent, canActivate: [AuthGuardService] },
      // { path: 'types', component: TypesComponent, canActivate: [AuthGuardService] },
      // { path: 'race-track', component: RaceTrackListComponent, canActivate: [AuthGuardService] },
      // { path: 'subcategory', component: SubcategorylistComponent, canActivate: [AuthGuardService] },
      // { path: 'equipments', component: EquipmentsComponent, canActivate: [AuthGuardService] },
      // { path: 'servicemans', component: ServicemansComponent, canActivate: [AuthGuardService] },
      // { path: 'serviceman', component: ServicemanComponent, canActivate: [AuthGuardService] },

    //   ]
    // },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
