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
import { UserComponent } from './component/user/user.component';
const routes: Routes =
  [

    { path: '', component: LoginComponent, pathMatch: 'full' },
    // {
    //   path: 'component', canActivate: [AuthGuardService], component: FullLayoutComponent, data: { title: 'pages' },
    //   // path: 'component', component: FullLayoutComponent, data: { title: 'pages' },

    //   children: [
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
    { path: 'general-category', component: GeneralCategoryComponent, canActivate: [AuthGuardService] },
    { path: 'types', component: TypesComponent, canActivate: [AuthGuardService] },
    { path: 'race-track', component: RaceTrackListComponent, canActivate: [AuthGuardService] },
    { path: 'subcategory', component: SubcategorylistComponent, canActivate: [AuthGuardService] },
    { path: 'equipments', component: EquipmentsComponent, canActivate: [AuthGuardService] },
    { path: 'servicemans', component: ServicemansComponent, canActivate: [AuthGuardService] },
    { path: 'serviceman', component: ServicemanComponent, canActivate: [AuthGuardService] },
    { path: 'users', component: UserComponent, canActivate: [AuthGuardService] },

    //   ]
    // },
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
