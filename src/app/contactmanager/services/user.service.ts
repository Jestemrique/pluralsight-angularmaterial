import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError, throwError, BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _users!: BehaviorSubject<User[]>;


  private dataStore: {
    users: User[]
  }
  constructor(private http: HttpClient) {
    this.dataStore = { users: [] };
    this._users = new BehaviorSubject<User[]>([]);
  }

  get users(): Observable<User[]> {
    return this._users.asObservable();
  }

  userById(id: number) {
    return this.dataStore.users.find( x => x.id == id);
  }

  loadAll() {
    const usersUrl = 'https://angular-material-api.azurewebsites.net/users';

    const httpOptions: any = {
      observe: '',

    }

    console.log("loadAll()");
    return this.http.get<User[]>(usersUrl)
          .subscribe({
            next: data => {
              //console.log("next!");
              //console.log(data);
              this.dataStore.users = data;
              //console.log("this.dataStore.users");
              //console.log(this.dataStore.users);
              this._users.next( Object.assign({}, this.dataStore).users);
            },
            error: error => {console.log("Failed to fetch users");}
          });
      // .pipe(
      //   tap( data => {
      //     console.log(JSON.stringify(data, null, 2));
      //     this.dataStore.users = data;
      //     this._users.next(   Object.assign({}, this.dataStore).users  );
      //   } ),
      //   catchError(this.handleError)
      //  );
  }

  handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }


}
