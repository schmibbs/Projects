#include <Servo.h>;               //Servo library
#include <SoftwareSerial.h>;      //???????

Servo head;       // Servo motor declaration

int trigger = A5;   // Echo sensor
int echo = A4;

int enA = 11;      // Pin connections 
int enB = 5;
int in1 = 9;
int in2 = 8;
int in3 = 7;
int in4 = 6;

char command;     // for bluetooth control
boolean autoPilot;
boolean isConnected;
int xPos;
int xNeg;
int yPos;
int yNeg;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(trigger, OUTPUT);
  pinMode(echo, INPUT);
  pinMode(enA, OUTPUT);                                                                                                                                                                                                 
  pinMode(enB, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
  pinMode(in3, OUTPUT);
  pinMode(in4, OUTPUT);
  head.attach(3);     //The pin where the servo is attached to; dont set it all the way to 180 or 0 degrees
  headCheck();        //centers the head, rotates, and resets to the front
  Serial.println("Setup Complete.");

}

void loop() {
  // put your main code here, to run repeatedly:

  //if (autoPilot) {
    moveForward();  

    for (int i =0; i < 3; i ++) {
      head.write(70 + 20 * i);
      delay(100);
      if (collision()) {
        stopMoving();
        delay(1500);
        scanForPath();
        }
      }
    //}
   //else {
   // appControl();
   //}
}

/*
 * This function finds the distance between t0he ultrasonic sensor and an obstacle 
 */
int getDistance() {
  digitalWrite(trigger, LOW);
  delayMicroseconds(20);
  digitalWrite(trigger,HIGH);
  delayMicroseconds(2);
  digitalWrite(trigger, LOW);

  float timeTraveled = pulseIn(echo, HIGH);
  float distance = timeTraveled/58;   //distance in cm
  Serial.println(distance);
  return (int)distance;
}

/*
 * Moves the bot forward
 */
void moveForward() {
  analogWrite (enA, 150);
  analogWrite (enB, 150);
  digitalWrite (in1, HIGH);
  digitalWrite (in2, LOW);
  digitalWrite (in3, HIGH);
  digitalWrite (in4, LOW);
  Serial.println("Forward");
}

/*
 * Moves the car backwards
 */
void moveBackwards() {
  analogWrite (enA, 80);   //sets motor power
  analogWrite (enB, 80);
  digitalWrite (in1, LOW);  //turns motors on
  digitalWrite (in2, HIGH);
  digitalWrite (in3, LOW);
  digitalWrite (in4, HIGH);
  Serial.println("Backward");
}

/*
 * turns the car to the left while stationary
 */
void turnRight() {
  analogWrite (enA, 255);
  analogWrite (enB, 255);
  digitalWrite (in1, LOW);
  digitalWrite (in2, HIGH);
  digitalWrite (in3, HIGH);
  digitalWrite (in4, LOW);
  Serial.println("Right");
}

/*
 * tunrs the car to the right while stationary
 */
void turnLeft() {
  analogWrite (enA, 255);
  analogWrite (enB, 255);
  digitalWrite (in1, HIGH);
  digitalWrite (in2, LOW);
  digitalWrite (in3, LOW);
  digitalWrite (in4, HIGH);
  Serial.println("Left");
}

/*
 * stops the car
 */
void stopMoving() {
  analogWrite (enA, 0);
  analogWrite (enB, 0);
  digitalWrite (in1, LOW);
  digitalWrite (in2, LOW);
  digitalWrite (in3, LOW);
  digitalWrite (in4, LOW);
  Serial.println("Stop");
}

/*
 * turns the car to the left while moving
 */
void turn45Left() {
  analogWrite (enA, 255);   
  analogWrite (enB, 100);
  digitalWrite (in1, LOW);  
  digitalWrite (in2, HIGH);
  digitalWrite (in3, LOW);
  digitalWrite (in4, HIGH);
  Serial.println("Slightly left");
}

/*
 * turns the car to the right while moving
 */
void turn45Right() {
  analogWrite (enA, 100);   
  analogWrite (enB, 255);
  digitalWrite (in1, LOW);  
  digitalWrite (in2, HIGH);
  digitalWrite (in3, LOW);
  digitalWrite (in4, HIGH);
  Serial.println("Slightly right");
}

/*
 * Checks if the car is approaching an object
 */
boolean collision() {
  if (getDistance() <= 30)
    return true;
  else
    return false;
}

/*
 * Checks for proper funciton of the distance sensor servo
 */
void headCheck() {
  head.write(90);
  
  for (int i =0; i < 3; i++) {
    head.write(170 - (80 * i));
    delay(1250);
  }
  head.write(90);
}

/*
 * Checks for the best path to progress if the car approaches an obstacle
 */
void scanForPath() {
  int degree = 170;
  int greatest = 0;
  boolean goLeft = false;

  for (int i =0; i < 2; i++) {
    head.write(degree - (160 * i));
    delay(750);
    
    if (greatest < getDistance()) {
      greatest = getDistance();
      goLeft = !goLeft;
    } 
  }
  head.write(90);

  if (greatest <= 30) {
    moveBackwards();
    delay(2000);
    turnRight();
    delay(250);
  }

  else {
    if (goLeft) {
      turnLeft();
      delay(250);
    }
    else {
      turnRight();
      delay(250);
    }
  }
}

void  appControl(){
  if (Serial.available() > 0 && !autoPilot) {
    command = Serial.read();

    
    if (command == 'f') {
      /*if (command == 'f' && command == 'l')
        turn45left();
      else if (command == 'f' && command == 'r')
        turn45Right();
      else*/
        moveForward();
    }
    else if (command == 'b')
      moveBackwards();
    else if (command == 'l')
      turnLeft();
    else if (command == 'r')
      turnRight();
    else
      stopMoving();
    }
  /*else {
    // engage auto pilot, return to origin
  }
  */
}





























