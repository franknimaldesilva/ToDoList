import {
  Component,
  signal,
  effect,
  computed,
  Signal,
  AfterViewInit,
  Input,
  model,
  inject,
  WritableSignal,
} from '@angular/core';
import { ToDoItem } from '../models/todoitem.model';
import { ListStore } from '../services/store';
import { ViewModel } from '../viewmodel/viewmodel';
@Component({
  selector: 'todoitem',
  styleUrl: 'todoitem.component.css',
  templateUrl: 'todoitem.component.html',
})
export class ToDoItemComponent extends ViewModel {

  toDoItem = model<ToDoItem>(this.store.getNewItem("ToDoList") as ToDoItem); 
  parentmode = model("list");

  
  constructor(
    
  ) {
     super("ToDoList");
    
      effect(() => {
            if(this.parentmode() === "newitem")
            {
                this.setMode("edit");
            }
            else
            {
                  this.setMode("view");
            }
     this.editItem = this.toDoItem()

 });
  }
  deleteItem()
 {
    if(confirm("This will remove this task?"))
    {
          this.store.removeListItem("ToDoList",this.toDoItem().id).then(() =>{
             this.parentmode.set("delete");
             document.getElementById(this.toDoItem().id)?.remove();
            }
            );
    }
 }
  save()
  {
    if(this.editItem?.validate())
    {
      this.store.setListItem("ToDoList",this.toDoItem()).then(()=>{
     this.parentmode.set("save");});
    }
  }
  setListItems()
  {
  }
}
