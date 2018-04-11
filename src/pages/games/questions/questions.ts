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
      question: 'Flee in terror at cucumber discovered on floor love to',
      answers: [
        {
          text: 'play with owner\'s',
          correct: true
        },
        {
          text: 'hair tie for scream at teh bath',
          correct: false,
        },
        {
          text: 'and dont wait for the storm to',
          correct: false
        }
      ],
      hintCorrect: 'stap een steen naar links',
      hintWrong: 'stap drie stenen naar links'
    },
    {
      index: 2,
      question: 'Pooping rainbow while flying in a toasted bread costume',
      answers: [
        {
          text: 'hair tie for scream at teh bath',
          correct: false,
        },
        {
          text: 'play with owner\'s',
          correct: true
        },
        {
          text: 'and dont wait for the storm to',
          correct: false
        }
      ],
      hintCorrect: 'stap vier stenen naar rechts',
      hintWrong: 'stap 2 stenen naar rechts'
    },
    {
      index: 3,
      question: 'be the most annoying cat that you can',
      answers: [
        {
          text: 'and dont wait for the storm to',
          correct: false
        },
        {
          text: 'play with owner\'s',
          correct: true
        },
        {
          text: 'hair tie for scream at teh bath',
          correct: false,
        }
      ],
      hintCorrect: 'stap 2 stenen naar rechts',
      hintWrong: 'stap 3 stenen naar links'
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
      title = 'Goed gedaan!'
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
      message: 'Je ben al een echte ranger in mijn ogen!',
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
    this._activeQuestion = 0;
    this._correctAnswers = 0;
  }
}
