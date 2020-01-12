import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserPreferenceService {

  constructor() {
   }

   saveData(data, id){
     const nb_diseases = data.diagnostics
     const nb_questions   = data.questions
     console.log(data)
      firebase.database().ref(`/${id}/infos/user_preferences`).set({
        nb_diseases,
        nb_questions
      });

   }

}
