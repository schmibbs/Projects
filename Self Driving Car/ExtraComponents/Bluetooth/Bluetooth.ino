#include <SoftwareSerial.h>
#define led 3

int state = 0; //can use a boolean variable here too

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(led, OUTPUT);
  digitalWrite(led, LOW); // turn it off to be safe

}

void loop() {
  // put your main code here, to run repeatedly:
  
  if (Serial.available() > 0) { //if there is something to be received by the board. Good practice
    state = Serial.read();      //49 still but int 49 == char 0
  }

  if(state == '0') {
    digitalWrite(led, LOW);
    Serial.println("LED OFF");
    state = 0;
  }

  else if (state == '1') {
    digitalWrite(led,HIGH);
    Serial.println("LED ON");
    state = 0;
  }
}
