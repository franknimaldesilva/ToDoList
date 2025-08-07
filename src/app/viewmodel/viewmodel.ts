import { Component,inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListStore } from '../services/store';
import { List, IList } from '../models/list.model';
import { ToDoItem } from '../models/todoitem.model';
import { IListItem ,ListItem } from '../models/listitem.model';
export  abstract class ViewModel {

  store = inject(ListStore);
  list = signal<List>(new List());
  editItem? : IListItem = undefined;
  mode = signal("list");
   constructor(public listName: string) {
    this.setList(listName).then(() => { this.setListItems()});
  }

  async setList(listNm: string) {
    this.listName = listNm;
    const loclist: IList | undefined = await this.store.getList(this.listName);
    if (loclist) {
      this.list.set(loclist);
    }

  }
  setMode(view:string)
  {
    this.mode.set(view);
  }
  abstract setListItems() : void;
  setValidity(event: any)
  {
    if(this.editItem)
    {
         this.editItem.setPropertyValue(event.currentTarget.id,event.currentTarget.value);
         if(!this.editItem.validateProp(event.currentTarget.id + "ValidationPtr"))
         {
            event.currentTarget.setCustomValidity(this.editItem.getPropertyErrorMessage(event.currentTarget.id));
           
         }
    }
    
  }
}
