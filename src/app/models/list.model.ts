import { IListItem } from "./listitem.model";

export interface IList {
  id: string;
  version: string;
  listName: string;
  items: IListItem[];
  getCount(): number;
  getListItem( key: string): IListItem | undefined;
  setListItem(item: IListItem) : void;
  removeListItem( key: string): void;
  hasListItemChanged( item: IListItem): boolean;
}


export class List implements IList {
  constructor(
    public id: string = '',
    public version: string = '',
    public listName: string = '',
    public items: IListItem[] = []
  ) {
    if (this.id === '') {
      this.id = crypto.randomUUID();
    }
    if (this.version === '') {
      this.version = crypto.randomUUID();
    }
  }
  getCount(): number {
    return this.items.length;
  }
  getListItem(key: string): IListItem | undefined
  {
    let item = this.items.find(i => i.id === key);
    return item ? item.getCopy() : undefined;

  }
  setListItem( item: IListItem): void{
 
     if(!this.items.find(i => i.id === item.id))
     {
        this.items.push(item);
     }
  }
  removeListItem(key: string): void {
    this.items = this.items.filter(i => i.id !== key);
  }
  hasListItemChanged(item: IListItem) {
    let changed = false;
    let current = this.getListItem(item.id);
    if (current) {     
      let prop: keyof typeof item;
      for (prop in item) {
        if (!prop.toString().toLowerCase().endsWith('validationptr')) {
          if (current[prop] !== item[prop]) {
            changed = true;
          }
        }
      }     
    }
    else {
      changed = true;
    }
    return changed;
  }

}
