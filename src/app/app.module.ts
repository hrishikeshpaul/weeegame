import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NameComponent } from './name/name.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from  '@angular/common/http';

import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule} from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav"
import { MatListModule } from "@angular/material/list"
import {MatIconModule} from "@angular/material/icon"
import { MatProgressBarModule} from "@angular/material/progress-bar"

import { GameComponent } from './game/game.component';
import { DialogComponent } from './dialog/dialog.component';

import {MatDialogModule} from "@angular/material/dialog";

let MatModules = [
  MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    MatButtonModule,
    MatDialogModule,
    MatSidenavModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    MatProgressBarModule
]

@NgModule({
  declarations: [
    AppComponent,
    NameComponent,
    GameComponent,
    DialogComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatModules,
    HttpClientModule
  ],
  exports: [
    MatModules
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
