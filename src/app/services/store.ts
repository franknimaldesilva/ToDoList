import { Injectable } from "@angular/core";
import { IListItem } from "../models/listitem.model";
import { IList, List } from "../models/list.model";
import { ToDoItem } from "../models/todoitem.model";


export interface IListStore {
  getListItem(listName: string, key: string): Promise<IListItem | undefined>;
  setListItem(listName: string, item: IListItem): Promise<boolean>;
  removeListItem(listName: string, key: string): Promise<void>;
  hasListItemChanged(listName: string, item: IListItem): Promise<boolean>;
  getList(listName: string): Promise<IList | undefined>;
  getNewItem(listName: string): IListItem | undefined;
  loadFromServer(listName: string): Promise<IList | undefined>;
  saveToServer(listName: string, item: IListItem): Promise<boolean>;
  removeFromServer(listName: string,key: string): Promise<void>;
}

@Injectable({
  providedIn: "root"
})
export class ListStore implements IListStore{
  data = new Map();
  apiRoot: string = "https://localhost:7116/api";
  refresh = false;
  theList : IList | undefined;
  getNewItem(listName: string): IListItem | undefined {
    switch (listName) {
      case "ToDoList" :
        return new ToDoItem();
      default:
        return undefined
     }
  }
  async setListItem(listName: string, item: IListItem): Promise<boolean> {
    let list: IList | undefined = await this.getList(listName);
    if (list) {
      list.setListItem(item); 
    }

    return await this.saveToServer(listName, item);
    
  }
  async removeListItem(listName: string, key: string): Promise<void> {
    let list: IList | undefined = await this.getList(listName);
    if (list) {
      list.removeListItem(key);
    }
    await this.removeFromServer(listName, key);
  }
  async hasListItemChanged(listName: string, item: IListItem): Promise<boolean> {
    let list: IList | undefined = await this.getList(listName);
    if (list) {
      return list.hasListItemChanged(item);
    }
    return true;
  }
  getFromLocalStorage(listName: string): IList | undefined
  {
    let liststr = localStorage.getItem(listName);
    if (liststr) {
      let list: IList = JSON.parse(liststr) as IList;
      let listcopy = new List(list.id, listName);
      list.items.forEach(item => {
        let itemCopy = this.getNewItem(listName);
        if (itemCopy) {
          itemCopy.copyFrom(item);
          listcopy.items.push(itemCopy);
        }
      })
      this.data.set(listName, listcopy);
      return listcopy;
    }
    return undefined;
  }

  CheckSetRefresh(listName: string)
  {
     if(!this.refresh)
     {
        this.refresh = true;
          setTimeout(() => {
  this.loadAndCacheFromServer(listName);
}, 30000);
     }
  }
  async loadAndCacheFromServer(listName: string) : Promise<IList | undefined>
  {
    console.log("loadAndCacheFromServer");
    this.refresh = false;
      let list: IList | undefined = await this.loadFromServer(listName);
        if (list ) {
          
          localStorage.setItem(listName, JSON.stringify(list));
          this.data.set(listName, list);
      
        
        }
        
        return list;
  }
  async getList(listName: string): Promise<IList | undefined>
  {
    this.CheckSetRefresh(listName);
    if (this.data.has(listName)) {
      let list: IList = this.data.get(listName);
      return list;
    }
    else {
      let list: IList | undefined = await this.getFromLocalStorage(listName);
      if (list) {
        return list;     
      }
      else {
        return await this.loadAndCacheFromServer(listName);;
      }
    }

  }

  async getListItem(listName: string, key: string): Promise<IListItem | undefined>
  {
    let list: IList | undefined = await this.getList(listName);
    if (list) {
      return list.getListItem(key);
    }
    return undefined;
  }

  getTestData(): IList {
    let list: List = new List();
    list.listName = "ToDoList";
    let item = new ToDoItem("task1", "task 1 decscription");
    list.items.push(item);
    item = new ToDoItem("task2", "task 2 decscription");
    list.items.push(item);
    item = new ToDoItem("task3", "task 3 decscription");
    list.items.push(item);



    return list;
  }

  getOrCreateStoreId(): string {
    let storeid = localStorage.getItem("storeid");
    if (!storeid) {
      storeid = crypto.randomUUID();
      localStorage.setItem("storeid", storeid);
        this.theList = new List();
        this.theList.listName = "ToDoList";
        this.theList.id = storeid;
    }
    return storeid;
  }

  async loadFromServer(listName: string): Promise<IList | undefined>
  {
      
    const response = await fetch(`${this.apiRoot}/task`, {
      method: "Get",
      headers: {
        'Content-Type': "application/json",
        'storeid': this.getOrCreateStoreId()
      }
    })
    if(response.ok)
    {    
         let items : IListItem[] = await response.json();
         if(items && items.length > 0 && this.theList)
         {

           this.theList.items = items;
           
         }
      
    }

      return this.theList;

    
  }
  async saveToServer(listName: string, listItem: IListItem): Promise<boolean> {
  if (this.data.has(listName)) {
      let list: IList = this.data.get(listName);
      localStorage.setItem(listName,JSON.stringify(list));
    }
    const response = await fetch(`${this.apiRoot}/task`, {
      method: "Post",
      headers: {
        'Content-Type': "application/json",
        'storeid': this.getOrCreateStoreId()
      },
      body: JSON.stringify(listItem),
    })

    return (response.ok) ? true : false;
 
  }
  
  async removeFromServer(listName: string, key: string) {
  if (this.data.has(listName)) {
      let list: IList = this.data.get(listName);
    localStorage.setItem(listName, JSON.stringify(list));
    const response = await fetch(`${this.apiRoot}/task`, {
      method: "DELETE",
      headers: {
        'Content-Type': "application/json",
        'storeid': this.getOrCreateStoreId()
      },
      body: key,
    })

   

    }
  }
}
