import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModelModule } from './models/model.module';
import { FormsModule } from "@angular/forms";
import { StoreModule } from "./store/store.module";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorHandlerService } from './errorHandler.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ModelModule,
    FormsModule,
    StoreModule
  ],
  providers: [ErrorHandlerService, { provide: HTTP_INTERCEPTORS, useExisting: ErrorHandlerService, multi:true }],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}
