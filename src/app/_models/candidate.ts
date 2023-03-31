import { State } from './enums/state';
import { Position } from './position';
import { User } from './user';

export class Candidate {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public phone: string,
    public proposed_position?: Position,
    public current_position?: string,
    public cv?: string,
    public img?: string,
    public state?: State,
    public comment?: string,
    public recruiter?: User,
    public team_id?: number,
    public current_employer?: string,
    public linkedin_profile?: string,
    public tags?: string[]
  ) {}
}
