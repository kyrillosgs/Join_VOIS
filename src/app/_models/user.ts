import { Role } from './enums/role';
import { Team } from './team';

export class User {
  constructor(
    public id: number,
    public name: string,
    public email?: string,
    public role?: Role,
    public team_id?: Team,
    public teams?: Team[],
    public img?: string
  ) {}
}
