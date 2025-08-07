import {
  Component,
  signal,
  computed,
  effect,
  Signal,
  AfterViewInit,
  Input,
  model,
  inject,
  WritableSignal,
} from '@angular/core';
import { ViewModel } from '../viewmodel/viewmodel';
import { ToDoItem } from '../models/todoitem.model';
import{ ToDoItemComponent } from '../todoitem/todoitem.component'
@Component({
  selector: 'todolist',
  styleUrl: 'todolist.component.css',
  imports:[ToDoItemComponent],
  templateUrl: 'todolist.component.html',
})
export class ToDoListComponent extends ViewModel {
  toDoItems : WritableSignal<ToDoItem>[] = []; 
  modelast : string = ""
  constructor(

  ) {
    super("ToDoList");
     effect(() => {
            if(this.modelast !== this.mode() && (this.mode() === "list" || this.mode() === "save" || this.mode() === "delete"))
            {
              this.mode.set("list");
              this.toDoItems = [];
              this.setListItems();
            }
 });

  }
  setListItems()
  {
     this.modelast = this.mode();
     this.list().items.forEach(item=>{ this.toDoItems.push(signal(<ToDoItem>item))})
  }
 
}
