import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NameComponent } from './name/name.component'
import { GameComponent } from './game/game.component'
import { GamemobileComponent } from './gamemobile/gamemobile.component'

const routes: Routes = [
  {
    path: '',
    component: NameComponent
  },
  {
    path: 'web-game',
    component: GameComponent
  },
  {
    path: 'mob-game',
    component: GamemobileComponent
  },
  {
    path: '**',
    redirectTo: '/'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
