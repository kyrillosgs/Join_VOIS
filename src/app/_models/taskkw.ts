import { v4 as uuidv4 } from 'uuid';

export class Task {
  public Id: string;

  constructor(
    public title: string,
    public points: number,
    public assignee?: string
  ) {
    this.Id = uuidv4();
  }
}
