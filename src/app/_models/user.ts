import { Team } from './team';

export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public role: string,
    public team_id: number,
    public teams: Team[],
    public img?: string
  ) {}
}
