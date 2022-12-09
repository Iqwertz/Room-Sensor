#include <NTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <Firebase_ESP_Client.h>
#include <Adafruit_BME280.h>
// Provide the token generation process info.
#include <addons/TokenHelper.h>

// Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>

#define SEALEVELPRESSURE_HPA (946.86)

// Konstanten
#define LDR_PIN                   0
#define MAX_ADC_READING           1023
#define ADC_REF_VOLTAGE           5.0
#define REF_RESISTANCE            5030  // Muss gemesen werden für optimale Ergebnisse
#define LUX_CALC_SCALAR           12518931
#define LUX_CALC_EXPONENT         -1.405

// WiFi network and Firebase details
#include "credentials.h"

Adafruit_BME280 bme; // I2C

int lightSensorPin = A0;

FirebaseData firebaseData;
/* Define the Firebase Data object */
FirebaseData fbdo;
/* Define the FirebaseAuth data for authentication data */
FirebaseAuth auth;
/* Define the FirebaseConfig data for config data */
FirebaseConfig config;

// Define NTP Client to get time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0);

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

  Serial.println("Starting TimeClient");
  timeClient.begin();


  // Connect to Firebase
  Serial.println("Connecting to Firebase");
  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  /* Assign the api key (required) */
  config.api_key = FIREBASE_AUTH;

  /* Assign the user sign in credentials */
  auth.user.email = FIREBASE_EMAIL;
  auth.user.password = FIREBASE_PASS;

  /* Assign the RTDB URL */
  config.database_url = FIREBASE_URL;

  // In ESP8266 required for BearSSL rx/tx buffer for large data handle, increase Rx size as needed.
  fbdo.setBSSLBufferSize(2048 /* Rx buffer size in bytes from 512 - 16384 */, 2048 /* Tx buffer size in bytes from 512 - 16384 */);

  // Limit the size of response payload to be collected in FirebaseData
  fbdo.setResponseSize(2048);

  Firebase.reconnectWiFi(true);
  fbdo.setResponseSize(4096);

  String base_path = "/" + DEVICE_NAME + "/";

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

  /* Initialize the library with the Firebase authen and config */
  Firebase.begin(&config, &auth);
  Serial.println("Connected to Firebase");

  // Initialize BME280 sensor
  bool status = bme.begin(0x76);

  if (!status) {
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
    while (1);
  }
}

void loop() {

  Serial.println("Getting Time");
  timeClient.update();
  unsigned long timestamp = timeClient.getEpochTime();
  Serial.println(timestamp);

  // Read values from BME280 sensor
  float temperature = bme.readTemperature();
  float pressure = bme.readPressure() / 100.0; // convert to hPa
  float humidity = bme.readHumidity();
  float light = Lux();

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
  Serial.print("Light: ");
  Serial.print(light);
  Serial.println("");

  char strTimestamp[20];
  dtostrf(timestamp, 0 , 0 , strTimestamp);

  String path = "/UsersData/";
  path += DEVICE_NAME; //<- user uid of current user that sign in with Emal/Password
  path += "/";
  path += strTimestamp;
  path += "/";

  FirebaseJson json;
  json.set("temperature", temperature);
  json.set("pressure", pressure);
  json.set("humidity", humidity);
  json.set("light", light);
  json.set("timestamp/.sv", "timestamp"); // .sv is the required place holder for sever value which currently supports only string "timestamp" as a value
  // Set data with timestamp
   Serial.printf("Set data with timestamp... %s\n", Firebase.RTDB.setJSON(&fbdo, path, &json) ? fbdo.to<FirebaseJson>().raw() : fbdo.errorReason().c_str());


  // Put the device into deep sleep mode for 1 minutes
  ESP.deepSleep(1 * 60 * 1000000);
}

float Lux() {    //funktion von StackOverflow
  int   ldrRawData;
  float resistorVoltage, ldrVoltage;
  float ldrResistance;
  float ldrLux;

  // Perform the analog to digital conversion
  ldrRawData = analogRead(lightSensorPin);

  // RESISTOR VOLTAGE_CONVERSION
  // Convert the raw digital data back to the voltage that was measured on the analog pin
  resistorVoltage = (float)ldrRawData / MAX_ADC_READING * ADC_REF_VOLTAGE;

  // voltage across the LDR is the 5V supply minus the 5k resistor voltage
  ldrVoltage = ADC_REF_VOLTAGE - resistorVoltage;

  // LDR_RESISTANCE_CONVERSION
  // resistance that the LDR would have for that voltage
  ldrResistance = ldrVoltage / resistorVoltage * REF_RESISTANCE;

  // LDR_LUX
  // Change the code below to the proper conversion from ldrResistance to
  // ldrLux
  ldrLux = LUX_CALC_SCALAR * pow(ldrResistance, LUX_CALC_EXPONENT);
  return ldrLux;
}
