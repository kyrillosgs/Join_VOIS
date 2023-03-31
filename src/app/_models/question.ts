import { Topic } from './topic';

export class Question {
  constructor(
    public id: number,
    public name: string,
    public answer: string,
    public topic_id: number,
    public score?: number
  ) {}
}
