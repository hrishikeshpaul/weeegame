import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";


import {DialogComponent} from '../dialog/dialog.component'

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.css'],
  
})
export class NameComponent {

  name = '';
  err = '';

  constructor(private route: Router, public dialog: MatDialog) {
      localStorage.setItem('highestScore', '0')
  }

  public startGame() {
    if(this.name.length > 0) {
      localStorage.setItem('name', this.name.trim())
      this.route.navigate(['/game'])
    } else {
      this.err = 'Please enter a name'
    }
      
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        this.dialog.open(DialogComponent, dialogConfig);
  }

}
