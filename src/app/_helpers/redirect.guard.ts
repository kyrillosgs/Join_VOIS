import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Candidate } from '../_models/candidate';
import { DataService } from '../_services/data.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectGuard implements CanActivate {
  public candidateIdSubject!: BehaviorSubject<number>;
  public candidateId!: Observable<number>;

  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    try {
      this.candidateIdSubject = new BehaviorSubject<number>(
        (this.router.getCurrentNavigation()?.extras.state as any).id
      );
      this.candidateId = this.candidateIdSubject.asObservable();
      this.candidateId.subscribe((id: number) => {
        this.router.navigate(['candidates/' + id]);
      });
    } catch {
      this.router.navigate(['']);
    }
    return of(false);
  }
}
