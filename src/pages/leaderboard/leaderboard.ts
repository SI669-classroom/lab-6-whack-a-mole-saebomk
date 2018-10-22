import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DataProvider } from '../../provider/data/data';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html',
})
export class LeaderboardPage {

  score: number;
  scoreList: any[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataProvider,
    public storage: Storage,
    public platform: Platform) {

    this.score = this.navParams.get('score');
  }

  ngOnInit () {
    this.platform.ready().then(() => {
      this.storage.get('leaderboard').then((result) => {
        let res;
        if(!result) {
          res = []
        } else {
          res = JSON.parse(result)
        }

        res.push({
          score: this.score,
          time: Date.now()
        })

        this.scoreList = res.sort(function(a, b) {
          if(a.score > b.score) {
            return -1;
          } else {
            return 1;
          }
        })

        this.storage.set('leaderboard', JSON.stringify(res));
      })
    })
  }

}
