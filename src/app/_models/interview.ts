import { Result } from './enums/result';
import { Stage } from './enums/stage';
import { Question } from './question';
import { Topic } from './topic';
import { User } from './user';

export class Interview {
  constructor(
    public id: number,
    public date: Date,
    public candidate_id: number,
    public type: Stage,
    public result: Result,
    public topics: Topic[],
    public assignees: User[],
    public questions: Question[],
    public score?: number,
    public notes?: string
  ) {}
}
