import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import similarity from 'similarity'

@Component({
  selector: 'app-gamemobile',
  templateUrl: './gamemobile.component.html',
  styleUrls: ['./gamemobile.component.css']
})
export class GamemobileComponent implements OnInit {

  name = localStorage.getItem('name');
  
  @ViewChild('drawer1') drawer1;


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
  prevSim = 0;
  canGuess = 2;
  gotWord = 0;

  didGuessWord = false;
  score = 0;
  hints = 0;
  highestScore = localStorage.getItem('highestScore') ? parseInt(localStorage.getItem('highestScore')) : 0

  constructor(private route: Router, public http: HttpClient) { }

  ngOnInit(): void {

  }

  @ViewChild('wordInput', { static: false }) inputEl: ElementRef;


  readyPlayer() {
    this.drawer1.opened = false
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
      setTimeout(()=>{
        this.inputEl.nativeElement.focus();
      },10);
      this.startTimer();
    }
  }

  unReadyPlayer() {
    this.drawer1.opened = true
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
      this.http.get('../../assets/easy.txt', { responseType: 'text' }).subscribe(resultFile => {
        this.allWords = resultFile.split(',')
        this.getNewWord();
      })
    } else if (this.selectedSetting == 'Medium') {
      this.http.get('../../assets/medium.txt', { responseType: 'text' }).subscribe(resultFile => {
        this.allWords = resultFile.split(',')
        this.getNewWord();
      })
    } else if (this.selectedSetting == 'Hard') {
      this.http.get('../../assets/hard.txt', { responseType: 'text' }).subscribe(resultFile => {
        this.allWords = resultFile.split(',')
        this.getNewWord();
      })
    }
  }

  skipWord(event) {
    event.stopPropagation();
    this.simPercent = 0.0;
    this.gotWord = 2;
    this.wordArray.forEach(i => {
      i.show = true
    })
    setTimeout(() => {
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
      this.gotWord = 0;
      this.wordArray = ta;
      this.hints = Math.floor(this.word.length / 2)
      this.canGuess = Math.floor(this.hints / 2)
    }, 1200)

  }

  getHint(event) {
    event.stopPropagation();
    if (this.hints > 0) {
      let num = Math.floor(Math.random() * this.word.length)
      if (this.wordArray[num].show) {
        this.getHint(event);
      }

      this.hints -= 1;
      this.wordArray[num].show = true;
    }
  }

  appearLetter() {
    if (this.canGuess) {
      let num = Math.floor(Math.random() * this.word.length)
      if (this.wordArray[num].show) {
        this.appearLetter();
      }
      this.wordArray[num].show = true;
      this.canGuess--;
    }

  }

  gotInput(event) {
    event.stopPropagation();
    if (this.inputWord.trim()) {
      if (this.inputWord.trim().toLowerCase() === this.word) {
        this.score++;
        this.gotWord = 1;
        this.inputWord = ''
        this.inputWords = []
        this.simPercent = 0.0;
        this.wordArray.forEach(i => {
          i.show = true
        })
        setTimeout(() => {
          this.getNewWord();
        }, 1000)
      } else {
        this.simPercent = Math.round(similarity(this.inputWord, this.word) * 100);
        if (this.simPercent > this.prevSim) {
          this.appearLetter()
          this.prevSim = this.simPercent
        }
        let temp = this.inputWord + ` (<label>${this.simPercent}%</label>) `
        this.inputWords.unshift(temp)

        if(this.inputWords.length > 3) {
          this.inputWords.pop()
        }
        this.inputWord = ''
      }
    }
  }

  getNewWord() {
    this.gotWord = 0;
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
    this.hints = Math.floor(this.word.length / 2)
    this.canGuess = Math.floor(this.hints / 2)
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
