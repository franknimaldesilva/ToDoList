import { IListItem, ListItem, PropertyState } from "./listitem.model";

export class ToDoItem extends ListItem {
  constructor(
    public taskName: string = '',
    public description: string = '',
    public status : string = 'pending'
  ) {
    super()
  }
  getNew(): IListItem
  {
    return new ToDoItem();
  }
  taskNameValidate(): boolean {
    if (!this.taskName || this.taskName === '' || this.taskName === 'frank') {
      let taskErr = new PropertyState(
        'taskName',
        false,
        'task name required'
      )
      this.validationErrorList.push(taskErr);
      return false;
    }
    return true;
  }
  taskNameValidationPtr: Function = this.taskNameValidate;
  descriptionValidate(): boolean {
    if (!this.description || this.description === '') {
      let descriptionErr = new PropertyState(
        'description',
        false,
        'description required'
      )
      this.validationErrorList.push(descriptionErr);
      return false;
    }
    return true;
  }
  descriptionValidationPtr: Function = this.descriptionValidate;
  statusValidate(): boolean {
    if (!this.status || this.status === '') {
      let statusErr = new PropertyState(
        'status',
        false,
        'status required'
      )
      this.validationErrorList.push(statusErr);
      return false;
    }
    return true;
  }
  statusValidationPtr: Function = this.statusValidate;
}
