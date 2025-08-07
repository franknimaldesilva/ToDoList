
export interface IValid {
  valid: boolean;
}
export interface IPropertyState {
  propertyName: string;
  isValid: boolean;
  errorMessage : string
}
export class PropertyState implements IPropertyState {
  constructor(
    public propertyName: string = '',
    public isValid: boolean = true,
    public errorMessage: string = ''
  ) {

  }
}
export interface IListItem {
  id: string;
  version: string;
  errorMessage: string;
  validationErrorList: IPropertyState[];
  getNew(): IListItem;
  setPropertyValue(propName: string, value: any): boolean;
  getProperty(propName: string): object;
  isValidProperty(propName: string): boolean;
  getPropertyErrorMessage(propName: string): string;
  propertyHasValue(propName: string): boolean;
  validate(): boolean;
  getCopy(): IListItem;
  copyFrom(item: IListItem) :void;
  validateProp(key:string) : boolean;

}
export abstract class ListItem implements IListItem {
  constructor(
    public id: string = '',
    public version: string = '',
    public errorMessage: string = '',
    public validationErrorList: PropertyState[] = []
  ) {
    if (this.id === '') {
      this.id = crypto.randomUUID();
    }
    if (this.version === '') {
      this.version = crypto.randomUUID();
    }
  }
  abstract getNew(): IListItem;
  setPropertyValue(propName: string, value: any): boolean
  {
    let prop: keyof typeof this;
    for (prop in this) {
      if (prop.toString().toLowerCase() === propName.toLowerCase()) {
        this[prop] = value;
        return true;
      }
    }
    return false;
  }
  getProperty(propName: string): any
  {
    let prop: keyof typeof this;
    for (prop in this) {
        if (prop.toString().toLowerCase() === propName.toLowerCase()) {
          return this[prop];
        }
      }
    
    return undefined;
  }
  isValidProperty(propName: string): boolean {
    let vo = this.validationErrorList.find(o => o.propertyName === propName);
    if (vo) {
      return vo.isValid;
    }
    return true; // no message is taken as valid
  }
  getPropertyErrorMessage(propName: string): string {
    let vo = this.validationErrorList.find(o => o.propertyName === propName);
    if (vo) {
      return vo.errorMessage;
    }
    return ''; 
  }
  propertyHasValue(propName: string): boolean {
    let value = this.getProperty(propName);
    if (value === undefined || value === null || value === '') {
      return false;
    }
    return true;
  }
  validate(): boolean {
    this.validationErrorList = [];
    let valid = true;
    let prop: keyof typeof this;
    for (prop in this) {
      if (prop.toString().toLowerCase().endsWith('validationptr')) {
        if (!(<Function>this[prop])()) {
          valid = false;
        }
      }
    }
    return valid;
  }
  validateProp(key:string) : boolean
  {
   
    let valid = true;
    let prop: keyof typeof this;
    for (prop in this) {
      if (prop.toString().toLowerCase().endsWith('validationptr') && prop === key) {
        if (!(<Function>this[prop])()) {
          valid = false;
        }
      }
    }
    return valid;
  }
  getCopy() {
    const eout: IListItem = this.getNew();
    let prop: keyof typeof eout;
    for (prop in eout) {
      if (!prop.toString().toLowerCase().endsWith('validationptr')) {
        eout.setPropertyValue(prop,this[prop]);
      }
    }
    return eout;
  }
  copyFrom(item: IListItem) {
    let prop: keyof typeof item;
    for (prop in item) {
      if (!prop.toString().toLowerCase().endsWith('validationptr')) {
        this.setPropertyValue(prop, item[prop]);
      }
    }
  }
}

