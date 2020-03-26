var MAGNITUDE = 3;
var HEIGHT = 440;
var WIDTH;

var p;
var POPULATION = 50;
var PERSONS = [];
var THRESHOLD = 30;
var myChart;

var ROWS;
var COLUMNS;

var RECOVERED = 0;
var INFECTED = 0;
var DEATH = 0;
var infected_document;
var healthy_document;
var death_document;

var SCENARIOS = 0;
var Obstacle = false;
var WashHand = false;

function SceneCheck(){
  Obstacle = false;
  WashHand = false;
  data = [` Where People are not trying any type of precautions for the Virus, Not washing Hands and Wearing masks.!!
  Things gets messy very rapidly people got infected in large numbers, Medical resources are limited therefore 
  most of them Dies without the medical care.`, `Where People are trying not to get infected by washing their hand with soap and sanitizers, But still people
  are going out socializing with other people. In this scenario chance of getting infected from a infected person if 70%`, 
  `Where people are put into lockdowns not much movement through the cities and people still washes their hands and use sanitizers
  probability of catching the virus from a infected one is still 70%`,
 `People have became isolated and anti social very less movement is seen and people also washed their hands, 
 probability of getting catching the virus from a infected one is still 70% but now their speeds are very decreased`]

  data2=[`Covid-19 is a fast pace disease, Meaning in a its incubation period the person does'nt know he is infected and continue to
  spread the infection among the people he meets. As in our case here if people does'nt do anything to prevent it, in no time more and more people will
  get infected. Its rise is exponential and soon the limited medical resouces gets occupied and no more infected people gets treated for the disease.
  This leads to increase in number of deaths as shown in the simulation`]
  
  var option = document.getElementById("scene");
  var info = document.getElementById("info");
  info.innerHTML = data[option.value];
  MAGNITUDE = 3;

  if(option.value == 1){
    WashHand = true;
    MAGNITUDE = 2;

  }
  if(option.value == 2){
    Obstacle = true;
    MAGNITUDE = 2;

  }
  if(option.value == 3){
    MAGNITUDE = 0.5;
  }

  POPULATION = 50;
  PERSONS = [];
  THRESHOLD = 30;
  RECOVERED = 0;
  INFECTED = 0;
  DEATH = 0;
  
  p = new Population();
  infected = new Person();
  infected.infected = true;
  infected.pos = createVector(PERSONS[0].pos.x, PERSONS[0].pos.y);
  POPULATION += 1;
  PERSONS.push(infected);

  drawChart();

}

function setup() {
  WIDTH = document.getElementById("canvas").offsetWidth;
  var canvas = createCanvas(WIDTH, HEIGHT);
  infected_document = document.getElementById("infected");
  healthy_document = document.getElementById("healthy");
  death_document = document.getElementById("deaths");

  canvas.parent("canvas");
  drawChart();

   p = new Population();
   infected = new Person();
   infected.infected = true;
   infected.pos = createVector(PERSONS[0].pos.x, PERSONS[0].pos.y);
   POPULATION += 1;
   PERSONS.push(infected);
 }

function draw() {
  background("#dadada");
  drawBoundary();
  if(Obstacle){
    drawObstacle();
  }
  p.show();

  infected_document.innerHTML = INFECTED;
  healthy_document.innerHTML = POPULATION -INFECTED -DEATH;
  death_document.innerHTML = DEATH;
  //drawChart();

  if(frameCount%10 ==0 && INFECTED != 0){
    addData(myChart, frameCount);
  }
}

function drawBoundary(){

  push();
  stroke("#0f0f0f");
  strokeWeight(3);
  noFill();
  rect(0, 0, WIDTH, HEIGHT);
  pop();

}

function drawObstacle(){
  push();
  stroke("#0f0f0f");
  strokeWeight(3);
  fill("#0f0f0f");
  rect(0, HEIGHT/2, WIDTH-round(WIDTH/8), 5);
  pop();
}

function addData(chart, label) {
  chart.data.labels.push(label);
  chart.data.datasets[0].data.push(RECOVERED);
  //console.log(RECOVERED)
  chart.data.datasets[1].data.push(INFECTED);
  chart.data.datasets[2].data.push(DEATH);
  chart.update();
}

function drawChart(){
var ctx = document.getElementById('myChart').getContext('2d');
myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [0],
    datasets: [{ 
        data: [0],
        label: "Recovered",
        borderColor: "#0000ff",
        fill: false
      }, { 
        data: [2],
        label: "Infected",
        borderColor: "#ff0000",
        fill: false
      }, { 
        data: [0],
        label: "Deaths",
        borderColor: "#000000",
        fill: false
      },
      { 
        data: [30],
        fill: false,
        borderColor: "#fefe00",
        label:"Medical Resources 30"
      },
    ]
  },
  options: {
    title: {
      display: true,
      text: 'World population per region (in millions)'
    },
  }
});
}

function Population() {
  for(var i = 0; i < POPULATION; i++){
    PERSONS.push(new Person());
  }

  this.show = function(){
    for(person of PERSONS){
      person.show();
      person.update();
      person.recovery();
      this.checkCollison();
    }
  }
  
  this.checkCollison = function(){
    for(var i = 0;i<POPULATION; i++){
      for(var j = 0; j<POPULATION; j++){
        if(i!=j && PERSONS[i].intersection(PERSONS[j])){
          if(PERSONS[i].infected && PERSONS[j].flag2){
            if(!PERSONS[j].death){
              PERSONS[j].infected = true;
            }
          }
          if(PERSONS[j].infected && PERSONS[i].flag2){
            if(!PERSONS[i].death){
              PERSONS[i].infected = true;
            }
          }
        }
      }
    }
  }

}


function Person() {
  var x = round(random(1, WIDTH));
  var y = round(random(1, HEIGHT));

  this.r = 15;
  this.pos = createVector(x, y);
  this.vel = p5.Vector.random2D().setMag(MAGNITUDE);
  this.acc = createVector();
  this.infected = false;
  this.infectedPeriod = round(random(200, 350));
  this.count = 0;
  this.recovered = false;
  this.death = false;
  this.flag = true;
  this.flag2 = true;
  this.flag3 = true;

  this.applyForce = function(force) {
    this.acc.add(force);
  };

  this.recovery = function(){
    if(this.infected){
      this.count+=1;
      if(this.count >= this.infectedPeriod && !this.death){
        this.count=0;
        INFECTED-=1;
        RECOVERED+=1;

        this.recovered = true;
        this.infected = false;
        this.flag2 = false;
      }
      var fate = 95;
      var vulnerable = 200;
      if(INFECTED > THRESHOLD){
          fate = 70;
          vulnerable = 160
      }else if(INFECTED < THRESHOLD/2){
        fate = 97;
        vulnerable = 300;
      }

      if(round(random(0, 100)) > fate && this.count > vulnerable && this.count%2 == 0){
        this.death = true;
        this.recovered = false;
        this.infected = false;
        if(this.flag3){
          DEATH+=1;
          INFECTED-=1;
          this.flag3=false;
        }
      }
    }
  }

  this.update = function() {
    // console.log(this.checkQuadrant());
    if ((this.pos.x > WIDTH -10) || (this.pos.x < 0 + 10)) {
      this.vel.x = this.vel.x * -1;
    }
    if ((this.pos.y > HEIGHT - 10) || (this.pos.y < 0 + 10)) {
      this.vel.y = this.vel.y * -1;
    }
    if(Obstacle){
      if ((this.pos.x > 0) && (this.pos.y > round(HEIGHT/2)) && this.pos.x < WIDTH - round(WIDTH/8) && this.pos.y < round(HEIGHT/2)+10) {
        //console.log("collide")
        this.vel.y = this.vel.y * -1;
      }
    }
    
    
    

    this.applyForce();
    if (!this.death) { // !this.flag && !this.crashed
      // console.log(this.vel);
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      // this.acc.mult(0);
    }
  };

  this.intersection = function(other){
    
    if(this.checkQuadrant() == other.checkQuadrant() && frameCount%2==0){
      d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      if(d < (this.r + other.r)/2 + 4){
        var prob = round(random(0,100));
        var thresh = 0;
        if(WashHand){
          thresh = 90;
        }
        if(prob > thresh){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  this.checkQuadrant = function(){
    if(this.pos.x - 200 > 0 && this.pos.y - 200 > 0){
       return 1;
    }else if(this.pos.x - 200 < 0 && this.pos.y - 200 > 0){
      return 2;
    }else if(this.pos.x - 200 < 0 && this.pos.y - 200 < 0){
      return 3;
    }else if(this.pos.x - 200 > 0 && this.pos.y - 200 < 0){
      return 4;
    }
  }

  

  this.show = function() {
    push();
    noStroke();
    fill('rgba(0,255,0, 0.5)');
    if(this.infected){
      if(this.flag){
        INFECTED+=1;
        this.flag = false;
      }
      fill('rgba(255,0,0, 0.5)');
    }else if(this.recovered){
      fill('rgba(0,0,255, 0.5)');
    }else if(this.death){
      fill('rgba(0,0,0, 0.5)');
    }
    translate(this.pos.x, this.pos.y);
    //rotate(this.vel.heading());
    //rectMode(CENTER);
    circle(0, 0, this.r);
    pop();
  };
}
