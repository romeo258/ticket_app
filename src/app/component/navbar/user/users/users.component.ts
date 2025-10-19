import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-users',
  imports: [CommonModule, RouterLink],
  templateUrl: './users.component.html'
})
export class UsersComponent {
   readonly store = inject(AppStore);
  private readonly location = inject(Location);
  
  constructor() {}

  ngOnInit(): void {
    this.store?.getUsers();
  }

  goBack = () => this.location.back();
}
