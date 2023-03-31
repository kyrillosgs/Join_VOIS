import { State } from './enums/state';
import { Position } from './position';
import { Team } from './team';
import { User } from './user';

export class Candidate {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public phone: string,
    public proposed_position_id?: Position,
    public current_position?: string,
    public cv?: string,
    public img?: string,
    public state?: State,
    public comment?: string,
    public recruiter_id?: User,
    public team_id?: Team,
    public current_employer?: string,
    public linkedin_profile?: string,
    public tags?: string[]
  ) {}
}
