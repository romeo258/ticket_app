import { CommonModule, Location } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AppStore } from '../../../../store/app.store';

@Component({
  selector: 'app-user-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent {
  @Input() userUuid: string = undefined;
  mode = signal<'view' | 'edit'>('view');
  store = inject(AppStore);
  private location = inject(Location);
  
  constructor(){}

  ngOnInit(): void {
    if(this.userUuid) {
      this.store.getUser(this.userUuid);
    }
  }

  switchMode = () => this.mode() === 'view' ? this.mode.update(_mode => 'edit') : this.mode.update(_mode => 'view');

  goBack = () => this.location.back();

  updateUser = (form: NgForm) => {
    console.log(form.value);
  };
}
