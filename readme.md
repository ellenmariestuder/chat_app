# Chat Application 

Chat App is a React Native chat application for both Android and iOS, built using React Native.

## Technologies Used:
* React Native  
* Expo  
* Firebase/ Firestore 

## Key Features:  
* Home screen where users can enter a display name and select a background color for the chat interface  
* Chat interfact where users can...   
  - send text messages    
  - send photos from their camera library    
  - take new photos and send   
  - share current location     
  - view messages offline  

&nbsp; 

# Getting Started  

## Setup (Repository) 
### Clone this repository 
`git clone https://github.com/ellenmariestuder/chat_app/`

### Change directory to the project's root directory
`cd chat_app`

### Install dependencies
`npm install`  

### Run the project using expo 
`expo start` or `npx expo start`   

&nbsp;

## Setup (Other)
### Create an Expo account   
Set up an [Expo account](expo.dev), then download the Expo app on your smartphone from the App Store. (Take a look at Expo's ['Get Started' documentation](https://docs.expo.dev/get-started/installation/) for additional details.)

From there, you can open the chat app on your phone by scanning the QR code that gets generated after running `expo start`.

&nbsp; 

### Set Up a firebase database 
Set up a [Firestore database](https://firebase.google.com/). Details on how to set up the database can be found in the [Firebase documentation](https://firebase.google.com/docs).    

_Note: You will need to replace the firebaseConfig far in `Chat.js` with your own database configuration, which can be found in_ Project Settings _in Firebase_.)

&nbsp; 

# Stack, Dependencies, Environment

## Stack 
React Native  

## Dependencies   
* expo 
* expo-image-picker 
* expo-location 
* firebase 
* netinfo
* prop-types 
* react 
* react-native 
* react-native-async-storage 
* react-native-gifted-chat
* react-native-gesture-handler 
* react-native-maps
* react-navigation
* react-navigation-stcak 

## Environment  
* Visual Studio Code v1.60.1
* npm v7.18.1
* node v14.16.1

