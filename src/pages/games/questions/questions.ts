import { Component } from '@angular/core';
import { AlertController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'questions-game',
  templateUrl: 'questions.html'
})
export class QuestionsGame {

  public _questions = [
    {
      index: 1,
      question: 'Weten jullie nog de naam van dit park?',
      answers: [
        {
          text: 'westerpark',
          correct: false
        },
        {
          text: 'Vondelpark',
          correct: true,
        },
        {
          text: 'Wandelpark',
          correct: false
        }
      ],
      hintCorrect: 'Wisten jullie dat er in dit park een hele boel dieren leven? Muizen, eekhoorns, kikkers en een heleboel verschillende vogels en vissen. Kijk eens rond! Stap twee stenen naar links.',
      hintWrong: 'Stap drie stenen naar links'
    },
    {
      index: 2,
      question: 'Weten jullie nog de naam van de Hoofdranger?',
      answers: [
        {
          text: 'Hops',
          correct: true,
        },
        {
          text: 'Bob',
          correct: false
        },
        {
          text: 'Kai',
          correct: false
        }
      ],
      hintCorrect: 'Wisten jullie dat het vondelpark de belangrijkste locatie van de kikker- en paddentrek is in Amsterdam!. Stap vier stenen naar rechts',
      hintWrong: 'Stap 2 stenen naar rechts'
    },
    {
      index: 3,
      question: 'In welke afvalbak gooi je kauwgom weg?',
      answers: [
        {
          text: 'groentebak',
          correct: false
        },
        {
          text: 'glasbak',
          correct: false
        },
        {
          text: 'restafval',
          correct: true,
        }
      ],
      hintCorrect: 'Wisten jullie dat afval gescheiden wordt in verschillende bakken zoals: plastic, papier, glas, groen en restafval! Stap 3 stenen naar links.',
      hintWrong: 'Stap 3 stenen naar links'
    }
  ];
  public _activeQuestion:number = 1;
  private _correctAnswers:number = 0;
  private _narrative:any;
  private _selectedStone:number = 0;

  constructor(
    private params: NavParams,
    private alertCtrl: AlertController,
    private viewCtrl: ViewController
  ) {

  }

  ionViewWillEnter() {
    this._narrative = this.params.get('narrative');
  }

  answerQuestion(question, correct) {
    let title:string;
    let message:string;
    if(correct) {
      this._correctAnswers++;
      title = 'Dat antwoord is goed!'
      message = question.hintCorrect;
    } else {
      title = 'Oei, dat is niet waar!';
      message = question.hintWrong;
    }

    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [{
        text: 'Volgende vraag',
        handler: () => {
          this._activeQuestion++;
        }
      }]
    });
    confirm.present();
  }

  selectStone(stone:number) {
    this._selectedStone = stone;
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  confirmNumber() {
    let again = this.alertCtrl.create({
      title: 'Oeps, dat is niet goed',
      message: 'Ik heb drie goede antwoorden nodig voordat ik je door kan laten naar de volgende ranger test',
      buttons: [{
        text: 'Speel opnieuw',
        handler: () => {
          this.restart();
        }
      }]
    });
    let finished = this.alertCtrl.create({
      title: 'Wow, dat is helemaal goed!',
      message: 'Jullie zijn al echter rangers aan het worden!',
      buttons: [{
        text: 'Volgende opdracht',
        handler: () => {
          this.closeModal();
        }
      }]
    });

    if(this._correctAnswers === 3) {
      finished.present();
    } else {
      again.present();
    }
  }

  restart() {
    this._activeQuestion = 1;
    this._correctAnswers = 0;
    this._selectedStone = 0;
  }
}
