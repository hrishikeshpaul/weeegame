import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";


import { DialogComponent } from '../dialog/dialog.component'

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.css'],

})
export class NameComponent implements OnInit {

  name = '';
  err = '';
  device;
  @ViewChild('nameInput') ip: ElementRef;

  constructor(private route: Router, public dialog: MatDialog) {
    localStorage.setItem('highestScore', '0')
  }

  ngOnInit() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      this.device = 'pc'
    } else {
      this.device = 'mb'
    }
    setTimeout(() => {
      this.ip.nativeElement.focus();
    }, 10);
  }

  public startGame() {
    if (this.name.length > 0) {
      localStorage.setItem('name', this.name.trim())
      if (this.device == 'mb') {
        this.route.navigate(['/web-game'])
      } else {
        this.route.navigate(['/mob-game'])
      }
    } else {
      this.err = 'Please enter a name'
    }

  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      device: this.device
    }
    this.dialog.open(DialogComponent, dialogConfig);
  }

}
