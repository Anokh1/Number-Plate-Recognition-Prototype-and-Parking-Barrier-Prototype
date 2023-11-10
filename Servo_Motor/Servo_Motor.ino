#include "WiFi.h"
#include "Arduino.h"
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
#include <ESP32Servo.h>

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

int intValue; 

Servo myServo;
int servoPin = 18;    // Servo Motor PIN

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
}

void loop() {
    // servo motor
    if (Firebase.RTDB.getInt(&fbdo, "gurneyParagonCamera/barrier")) {
        if (fbdo.dataType() == "int") {
            intValue = fbdo.intData();
            Serial.println(intValue);

            if (intValue == 1) {
                // open parking barrier
                myServo.write(90);
                myServo.write(90);
                myServo.write(90);

                // close parking barrier
                if (Firebase.RTDB.setInt(&fbdo, "gurneyParagonCamera/barrierGurneyParagon", 0)){
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
        Serial.println("FAILED TO GET BARRIER STATUS "+ fbdo.errorReason());
    }
}
