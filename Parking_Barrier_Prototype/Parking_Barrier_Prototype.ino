#include "WiFi.h"
#include "Arduino.h"
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
#include <ESP32Servo.h>
// rain sensor does not use any library 

// Firebase Realtime Database 
const char* ssid = "Adrian";
const char* password = "";

#define API_KEY ""

#define DATABASE_URL ""

#define USER_EMAIL "nprpgurneyparagon@marc.com"
#define USER_PASSWORD "test123"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig configF;

bool boolValue; 

Servo myServo;
int servoPin = 18;    // Servo Motor PIN
#define POWER_PIN 32  // Rain Sensor VCC PIN
#define DO_PIN 13     // Rain Sensor PIN

void initWiFi(){
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
}

void setup() {
    Serial.begin(115200);
    initWiFi(); 

    configF.api_key = API_KEY;
    configF.database_url = DATABASE_URL;

    auth.user.email = USER_EMAIL;
    auth.user.password = USER_PASSWORD;

    configF.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h

    Firebase.begin(&configF, &auth);
    Firebase.reconnectWiFi(true);

    myServo.attach(servoPin);
    
    pinMode(POWER_PIN, OUTPUT);
    pinMode(DO_PIN, INPUT); 
}

void loop() {
    digitalWrite(POWER_PIN, HIGH); 
    delay(10); 

    int rain_state = digitalRead(DO_PIN);
    digitalWrite(POWER_PIN, LOW); 

    if (rain_state == HIGH) {
        Serial.println("rainless"); 
        // Store not raining data in Realtime Database
        if (Firebase.RTDB.setString(&fbdo, "gurneyParagonCamera/rain", "rainless")){
            Serial.println(); Serial.print(" - successfully saved to: " + fbdo.dataPath()); 
            Serial.println(" (" + fbdo.dataType() + ")"); 
        } else {
            Serial.println("FAILED: " + fbdo.errorReason()); 
        }
    }
    else if (rain_state == LOW) {
        Serial.println("raining");
        // Store raining data in Realtime Database
        if (Firebase.RTDB.setString(&fbdo, "gurneyParagonCamera/rain", "raining")){
            Serial.println(); Serial.print(" - successfully saved to: " + fbdo.dataPath()); 
            Serial.println(" (" + fbdo.dataType() + ")"); 
        } else {
            Serial.println("FAILED: " + fbdo.errorReason()); 
        }
    }
    else {
        Serial.println("no information");
        // Store not raining data in Realtime Database
        if (Firebase.RTDB.setString(&fbdo, "gurneyParagonCamera/rain", "no information")){
            Serial.println(); Serial.print(" - successfully saved to: " + fbdo.dataPath()); 
            Serial.println(" (" + fbdo.dataType() + ")"); 
        } else {
            Serial.println("FAILED: " + fbdo.errorReason()); 
        }
    }

    delay(1000); 

    if (Firebase.RTDB.getBool(&fbdo, "gurneyParagonCamera/barrier")) {
        if (fbdo.dataType() == "bool") {
            boolValue = fbdo.boolData();
            Serial.println(boolValue);

            if (boolValue == true) {
                // open parking barrier
                myServo.write(90);
                myServo.write(90);
                myServo.write(90);

                // set the barrier to false
                if (Firebase.RTDB.setBool(&fbdo, "gurneyParagonCamera/barrier", false)){
                    Serial.println(); Serial.print(" - successfully saved to: " + fbdo.dataPath()); 
                    Serial.println(" (" + fbdo.dataType() + ")"); 
                } else {
                    Serial.println("FAILED: " + fbdo.errorReason()); 
                }
            } else {
              myServo.write(0); 
            } 
        }
    } else {
        Serial.println("FAILED TO GET BARRIER STATUS"+ fbdo.errorReason());
    }
}
