import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  database: Observable<any>;
  lastDatabaseScreenshot: any;
  constructor(db: AngularFireDatabase) {
    this.database = db.object('UsersData').valueChanges();

    this.database.subscribe((data) => {
      this.lastDatabaseScreenshot = data;
      console.log('FirebaseService: ', data);
    });
  }
}
