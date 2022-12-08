Copy code
#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>
#include <BME280.h>

#define BME_SCK D1
#define BME_MISO D2
#define BME_MOSI D3
#define BME_CS D4

// WiFi network and Firebase details
#include "credentials.h"

BME280 bme;
FirebaseData firebaseData;

void setup() {
  Serial.begin(115200);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("Connected to WiFi with IP address: ");
  Serial.println(WiFi.localIP());

  // Connect to Firebase
  firebaseData.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Serial.println("Connected to Firebase");

  // Initialize BME280 sensor
  bme.settings.commInterface = I2C_MODE;
  bme.settings.I2CAddress = 0x76;
  bme.settings.runMode = 3; // Normal mode
  bme.settings.tStandby = 0;
  bme.settings.filter = 0;
  bme.settings.tempOverSample = 1;
  bme.settings.pressOverSample = 1;
  bme.settings.humidOverSample = 1;
  bme.begin();
}

void loop() {
  // Read values from BME280 sensor
  float temperature = bme.readTemperature();
  float pressure = bme.readPressure() / 100.0; // convert to hPa
  float humidity = bme.readHumidity();

  // Print sensor readings to serial monitor
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" *C");
  Serial.print("Pressure: ");
  Serial.print(pressure);
  Serial.println(" hPa");
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  // Store sensor readings on Firebase
  firebaseData.pushFloat("temperature", temperature);
  firebaseData.pushFloat("pressure", pressure);
  firebaseData.pushFloat("humidity", humidity);

  // Put the device into deep sleep mode for 30 minutes
  ESP.deepSleep(30 * 60 * 1000000);
}
