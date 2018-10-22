import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MoleHole } from '../../models/button-model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  moleHoles: MoleHole[] = [];
  showHitMessage: Boolean = false;
  gameDriver: any;
  gameTimer: any;
  timeLeft: number = 0;
  timerObserver: any;
  score: number = 0;
  scoreUpdate: any;
  scoreObserver: any;

  constructor(public navCtrl: NavController) {

  // Task: Create an observer to be passed to the new MoleHole
  this.scoreUpdate = Observable.create(observer => {
   this.scoreObserver = observer;
  });

  // Task: Subscribe to the observer created above to update the score
  this.scoreUpdate.subscribe(() => {
   this.score++;
  })

  // Create moleholes
    for(let i = 0; i<9; i++) {
      this.moleHoles.push(new MoleHole( i, this.scoreObserver ))
    }

  //
    let timerUpdate = Observable.create(observer => {
      this.timerObserver = observer;
    });

    timerUpdate.subscribe(val => {
      this.timeLeft = val;
    })

    this.startGame()
  }

  startGame() {
    const that = this;
    this.score = 0;

    this.gameDriver = setInterval(() => {
      let randomMole = Math.floor(Math.random() * 9)
      this.moleHoles[randomMole].showMole(700);
    }, 800);

    this.timeLeft = 10;

    this.gameTimer = setInterval(() => {
      that.timeLeft = that.timeLeft - 1;
      that.timerObserver.next(that.timeLeft);
      if (that.timeLeft <= 0) {
        clearInterval(that.gameTimer);
        this.stopGame();
        this.saveScore();
      }
    }, 1000)

  }

  stopGame() {
    clearInterval(this.gameDriver);
    clearInterval(this.gameTimer);
    this.timerObserver.next(0);
  }

  saveScore() {
    this.navCtrl.push('LeaderboardPage', {
      score: this.score
    })
  }

  resetGame() {
    this.stopGame();
    this.startGame();
  }

  hit(hole: MoleHole) {
    const success = hole.hit();
    if(success) {
      this.showHitMessage = true;
      setTimeout(() => {
        this.showHitMessage = false;
      }, 300);
    }
  }

  stateToClass(state: number) {
    switch(state) {
      // Task: Connect to the class that changes the image
      case 0: return "hid";
      case 1: return "out";
      case 2: return "hit";
    }
}

}
