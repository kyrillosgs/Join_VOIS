import { Team } from './team';

export class Position {
  constructor(public id: number, public name: string, public team_id: Team) {}
}
