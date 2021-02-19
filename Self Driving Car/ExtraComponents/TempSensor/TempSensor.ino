#include<SimpleDHT.h>;

int DHTsensor_pin = 4;
SimpleDHT DHTsensor;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

}

void loop() {
  // put your main code here, to run repeatedly:
  byte temperature = 0;
  byte humidity = 0;
  byte data[40] = {0};
  if (DHTsensor.read(DHTsensor_pin, &temperature, &humidity, data) { 
    return;
  }

  for(int i =0; i < 40; i++) {
    Serial.print((int)data[i]);
    if (i > 0 && (i + 1) %4 == 0) {
      Serial.print(' ');
    }
    Serial.print((int)temperature)); Serial.print( °C, ");
    Serial.print((int)humidity)); Serial.print( %, ");
  }

}
