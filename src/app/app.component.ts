import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Question} from './question';
import {Result} from './results';
import {Observable} from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  //API Endpoint
   ROOT_URL: string='https://opentdb.com/api.php?amount=5&category=11&difficulty=medium&type=multiple';

  posts: Observable<Result>;
  result: Result;
  questions: Question[]=new Array(5); 

  //The question variables below will store the user-selected response each time the user selects a radio button
  //These are used to determine if the user selected the correct response to each question when the check button is clicked
  question0: string =''; 
  question1: string ='';
  question2: string ='';
  question3: string ='';
  question4: string ='';

  //the correct variable will store how many questions the user gets correct
  correct: number =0;

  //This order array is used to store the order that the responses will be displayed to the user
  order: number[]= new Array(0); 

  constructor(private http: HttpClient){}

  //getPosts() will make a get request to the api endpoint and store the returned data in a result variable
  getPosts(){
    this.correct=0;
    this.order=[];
    this.randomize();
   // console.log(this.order);
     (this.posts=this.http.get<Result>(this.ROOT_URL)).subscribe(data=>{
       console.log(data);
       this.result={
        response_code: data.response_code,
        results: data.results
      };
      this.getQuestions();
     }); //http request to above URL
  }

  //getQuestions() parses out the needed information from the result variable so that the questions and response may be displayed to the user
  getQuestions(){
    var num=0;
    for(let entry of this.result.results){
      this.order=[];
      this.randomize();
      this.questions[num]={
        id: num,
        question: entry['question'],
        correct_answer: entry['correct_answer'],
        incorrect_answers: entry['incorrect_answers'],
        ordering: this.order,
      };
      this.questions[num]['incorrect_answers'].push(this.questions[num]['correct_answer']);
      num=num+1;
    }
  }

  //whenever a response is selected, the onAnswerSelected function runs so that the selected responses can be stored and checked for correctness
onAnswerSelected(event: any){
  if(event.target.value==0){
    this.question0=event.target.id;
  }
  if(event.target.value==1){
    this.question1=event.target.id;
  }
  if(event.target.value==2){
    this.question2=event.target.id;
  }
  if(event.target.value==3){
    this.question3=event.target.id;
  }
  if(event.target.value==4){
    this.question4=event.target.id;
  }
}

//checkAnswers() determines how many questions the user actually got correct
checkAnswers(){
  this.correct=0;
for(let entry of this.questions){
  
  if(entry['correct_answer']==this.question0 ||
  entry['correct_answer']==this.question1 ||
  entry['correct_answer']==this.question2 ||
  entry['correct_answer']==this.question3 ||
  entry['correct_answer']==this.question4)
  this.correct=this.correct+1;
  
}
}

//creates a random ordering for the question responses to be displayed in
//taken from StackOverflow https://stackoverflow.com/questions/2380019/generate-unique-random-numbers-between-1-and-100
randomize(){
  while(this.order.length < 4){
    var num=Math.floor(Math.random()*4)
    //console.log(num);
    if(this.order.includes(num)==false){
      this.order.push(num);
    }
  }
  }

}
