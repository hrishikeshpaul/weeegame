import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import similarity from 'similarity'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  @ViewChild('drawer2') drawer2;
  @ViewChild('wordInput') wordInput;
  

  name = localStorage.getItem('name');
  readyButton = 'Ready'
  settings = [
    'Easy',
    'Medium',
    'Hard'
  ]
  selectedSetting = 'Easy'
  players = [
    { name: this.name, ready: false }
  ]

  timeLeft: number = 60;
  setTime = this.timeLeft
  interval: any;
  startGame = false;

  word: String = ''
  wordArray = []
  wordArrayUnderline = []
  inputWords = []
  inputWord = ''
  simPercent;
  allWords = [];

  didGuessWord = false;
  score = 0;
  hints = 0;
  highestScore = localStorage.getItem('highestScore') ? parseInt(localStorage.getItem('highestScore')) : 0

  constructor(private route: Router, public http: HttpClient) { }

  ngOnInit(): void {

  }

  readyPlayer() {
    this.drawer2.opened = true
    this.readyButton = 'Unready';
    this.players[0].ready = true;
    this.timeLeft = this.setTime;
    this.startGame = true;
    this.inputWords = []
    this.inputWord = ''
    this.simPercent = 0.0;
    this.score = 0;
    this.didGuessWord = false;
    this.gameMechanism();


    if (this.startGame) {
     
      console.log(this.wordInput)
      this.startTimer();
    }
  }

  unReadyPlayer() {
    this.drawer2.opened = false
    this.readyButton = 'Ready';
    this.players[0].ready = false;
    this.startGame = false;
    this.score = 0;
    this.pauseTimer();
  }

  quitGame() {
    this.route.navigate(['/'])
  }

  startTimer() {
    if (this.timeLeft > 0) {
      this.interval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          
          this.gameFinished();
        }
      }, 1000)
    }
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  gameMechanism() {
    if (this.selectedSetting == 'Easy') {
      console.log('here easy')
      this.http.get('../../assets/easy.txt', { responseType: 'text' }).subscribe(resultFile => {
        this.allWords = resultFile.split(',')
        this.getNewWord();
      })
    } else if (this.selectedSetting == 'Medium') {
      console.log('here medium')
      this.http.get('../../assets/medium.txt', { responseType: 'text' }).subscribe(resultFile => {
        this.allWords = resultFile.split(',')
        this.getNewWord();
      })
    }
  }

  getHint() {
    if (this.hints > 0) {
      this.hints -= 1;
      let num = Math.floor(Math.random() * this.word.length)
      this.wordArray[num].show = true;
    }
  }

  gotInput() {
    if (this.inputWord) {
      if (this.inputWord === this.word) {
        this.score ++;
        this.inputWord = ''
        this.inputWords = []
        this.simPercent = 0.0;
        this.wordArray.forEach(i => {
          i.show = true
        })
        setTimeout(() => {
          this.getNewWord();
        }, 500)
      } else {
        this.simPercent = Math.round(similarity(this.inputWord, this.word) * 100);
        let temp = this.inputWord + ` (${this.simPercent}%) `
        this.inputWords.unshift(temp)
        this.inputWord = ''
      }
    }
  }

  getNewWord () {
    let num = Math.floor(Math.random() * this.allWords.length)
    this.word = this.allWords[num].trim();
    this.wordArray = this.word.split('');
    let ta = []
    this.wordArray.forEach(i => {
      ta.push({
        letter: i,
        show: false
      })
    })

    this.wordArray = ta;
    this.hints = Math.floor(this.word.length/2)
  }

  gameFinished() {
    this.didGuessWord = true;
    this.readyButton = 'Ready';
    this.players[0].ready = false;

    localStorage.setItem('highestScore', this.score.toString())
    
    if (this.highestScore < this.score) {
      this.highestScore = this.score
    }
  }

}
