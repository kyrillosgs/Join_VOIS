import { Stage } from './enums/stage';

export class Topic {
  constructor(
    public id: number,
    public name: string,
    public score?: number,
    public note?: string,
    public type?: Stage
  ) {}
}
