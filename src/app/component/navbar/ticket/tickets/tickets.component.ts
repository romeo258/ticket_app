import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { AppStore } from '../../../../store/app.store';
import { debounceTime, distinct, filter, Subject } from 'rxjs';
import { defaultQuery, IQuery } from '../../../../interface/query';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExtractArrayValue } from '../../../../pipe/extractvalue.pipe';

@Component({
  selector: 'app-tickets',
  imports: [CommonModule, RouterLink, ExtractArrayValue],
  templateUrl: './tickets.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketsComponent {
  protected store = inject(AppStore);
  private destroyRef = inject(DestroyRef);
  private readonly inputSubject: Subject<IQuery> = new Subject();

    ngOnInit(): void {
    if (!this.store?.tickets()) {
      this.store?.getTickets(defaultQuery);
    }
    this.inputSubject
      .pipe(debounceTime(500), distinct(), filter(query => !!query.filter), takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => {
        this.store?.setCurrentPage(query.page);
        this.store.getTickets(query);
      });
    }

  // searchTickets = (query: IQuery) => this.inputSubject.next(query);
  searchTickets = (query: IQuery) => {
  const cleanedFilter = query.filter?.trim() || '';

  this.store.getTickets({
    ...query,
    filter: cleanedFilter
  });
};


  filterTickets = (query: IQuery) => {
    this.store?.setCurrentPage(query.page);
    this.store.getTickets(query);
  };

  log = (event: any) => {
    const values: string[] = [];
    for (let i = 0; i < event.target.selectedOptions.length; i++) {
      values.push(event.target.selectedOptions[i].value)
    };
  };
}
