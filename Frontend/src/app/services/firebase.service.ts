import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  database: Observable<any>;
  constructor(db: AngularFireDatabase) {
    this.database = db.object('UsersData').valueChanges();

    this.database.subscribe((data) => {
      console.log('FirebaseService: ', data);
    });
  }
}
