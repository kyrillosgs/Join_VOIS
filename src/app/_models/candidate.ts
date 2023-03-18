export class Candidate {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public phone: string,
    public proposed_position?: string,
    public current_position?: string,
    public cv?: string,
    public image?: string,
    public state?: string,
    public comment?: string,
    public recruiter?: number,
    public team_id?: number,
    public current_employer?: string,
    public linkedin_profile?: string
  ) {}
}
