# Credentials
To use the programm create a file called "credentials.h" in the same folder as the main file. The file should contain the following lines:
```c++
const char* ssid = "SSID";
const char* password = "WIFI_PASSWORD";
const char* FIREBASE_URL = "FIREBASE_URL";
const char* FIREBASE_AUTH = "FIREBASE_AUTH"; //API Key
const char* FIREBASE_EMAIL = "account email"; //email of an authentificated user
const char* FIREBASE_PASS = "account password"; //password of an authentificated user
const String ROOM_NAME = "ROOM_NAME";  //Used to identifie the sensor in the database
const String ROOM_NAME2 = "ROOM_NAME2"; //Used to identifie the sensor in the database (if you have more than one sensor connected)
```