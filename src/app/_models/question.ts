import { Topic } from './topic';

export class Question {
  constructor(
    public id: number,
    public name: string,
    public answer: string,
    public topics_id: number,
    public score?: number
  ) {}
}
