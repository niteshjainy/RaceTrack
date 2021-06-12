import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
// import { AngularFireAuthModule } from '@angular/fire/auth';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './directives/header/header.component';
import { SidebarComponent } from './directives/sidebar/sidebar.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from './service/form/auth/auth-guard.service';
import { HttpClientModule } from '@angular/common/http';
import { FormService } from './service/form/form.service';
import { ApiService } from './service/api.service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { dateFormatPipe } from './directives/date-format-pipe/date-format-pipe.component';
import { CloudinaryModule, CloudinaryConfiguration } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { PhotoAlbum } from './model/photo-album.service';
import { GrdFilterPipe } from './directives/serchfilter/search';
import { ImageComponent } from './directives/image/image.component';
import { FileUploadModule } from 'ng2-file-upload';
import { Md5 } from 'ts-md5/dist/md5';
// import { NgxPaginationModule } from 'ngx-pagination';
import { GeneralCategoryComponent } from './component/general-category/general-category.component';
// import { FullCalendarModule } from 'ng-fullcalendar';
import { FullCalendarModule } from '@fullcalendar/angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RatingModule } from 'ngx-bootstrap/rating';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxSpinnerModule } from "ngx-spinner";

import { DragScrollModule } from 'ngx-drag-scroll';
// import { AgmCoreModule } from '@agm/core';
// import { ChartsModule } from 'ng2-charts';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; //importing the module
import { TypesComponent } from './component/types/types.component';
import { RaceTrackListComponent } from './component/race-track-list/race-track-list.component';
import { SubcategorylistComponent } from './component/subcategorylist/subcategorylist.component';
import { EquipmentsComponent } from './component/equipments/equipments.component';
import { ServicemansComponent } from './component/servicemans/servicemans.component';
import { ServicemanComponent } from './component/serviceman/serviceman.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LandingPageListComponent } from './component/landing-page-list/landing-page-list.component';
import { LandingPageDetailsComponent } from './component/landing-page-details/landing-page-details.component';
import { LandingPagePrivacyComponent } from './component/landing-page-privacy/landing-page-privacy.component';
import { LandingPageMainComponent } from './component/landing-page-main/landing-page-main.component';
import { PublicHeaderComponent } from './directives/public-header/public-header.component';
import { PublicFooterComponent } from './directives/public-footer/public-footer.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { ToastrModule } from 'ngx-toastr';


import { AboutUsComponent } from './component/about-us/about-us.component';
import { OurLocationComponent } from "./component/our-location/our-location.component";
import { MechanicsComponent } from "./component/mechanics/mechanics.component";
import { EquipmentsNewComponent } from "./component/equipments-new/equipments-new.component";
import { EventsComponent } from "./component/events/events.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    LoginComponent,
    dateFormatPipe,
    GrdFilterPipe,
    ImageComponent,
    GeneralCategoryComponent,
    TypesComponent,
    RaceTrackListComponent,
    SubcategorylistComponent,
    EquipmentsComponent,
    ServicemansComponent,
    ServicemanComponent,
    LandingPageMainComponent,
    LandingPageListComponent,
    LandingPageDetailsComponent,
    LandingPagePrivacyComponent,
    PublicHeaderComponent,
    PublicFooterComponent,
    AboutUsComponent,
    OurLocationComponent,
    MechanicsComponent,
    EquipmentsNewComponent,
    EventsComponent,
  ],
  imports: [
    // ChartsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    // AngularFireAuthModule,
    // AngularFirestoreModule,
    // NgxPaginationModule,
    FileUploadModule,
    BrowserAnimationsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FullCalendarModule,
    Ng2SearchPipeModule,
    NgMultiSelectDropDownModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyCTeop_aYmRMZCR67P-NKfvKlxoFyNt3z4',
    //   libraries: ['places']
    // }),
    CloudinaryModule.forRoot({ Cloudinary }, { cloud_name: 'dgmepvauo' } as CloudinaryConfiguration),
    BsDatepickerModule.forRoot(),
    RatingModule.forRoot(),
    CarouselModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    DragScrollModule,
    Ng5SliderModule,
    NgxSpinnerModule,
    AutocompleteLibModule,
    ToastrModule.forRoot()
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    CookieService, AuthGuardService, FormService, ApiService, PhotoAlbum, ImageComponent, Md5,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
