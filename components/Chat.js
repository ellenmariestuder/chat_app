import React from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet, Text } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, renderActions } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      user: {
        _id: '',
        // name: '',
      },
      uid: 0,
      // loggedInText: '',
      isConnected: false,
    }

    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAmQ2yiZWHdoLkHCOvIqy_2v39lKlDhCR4",
        authDomain: "chatapp-eb100.firebaseapp.com",
        projectId: "chatapp-eb100",
        storageBucket: "chatapp-eb100.appspot.com",
        messagingSenderId: "354879291118",
        appId: "1:354879291118:web:f1e6558a1f1d4b527b3dff",
        measurementId: "G-N37M146680",
      });
    }

    this.referenceMessages = firebase.firestore().collection('messages')
  }

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    }
    catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {
    //  pull in user's name; set to page header
    const name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name })

    // determine whether user is online or not
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');
        this.setState({ isConnected: true });

        // create a reference to the messages collection
        this.referenceMessages = firebase.firestore().collection('messages');

        // listen to authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) { await firebase.auth().signInAnonymously(); }

          // update user state with currently active user data
          this.setState({
            messages: [],
            user: {
              _id: user.uid,
              // name: name,
            },
            // loggedInText: `${this.props.route.params.name} has entered the chat`,
          });
          this.unsubscribe = this.referenceMessages
            .orderBy('createdAt', 'desc')
            .onSnapshot(this.onCollectionUpdate);
        });

      } else {
        console.log('offline');
        this.setState({ isConnected: false });
        // load messages from asyncStorage
        this.getMessages();
      }
    });
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image,
        // location: {
        //   latitude: data.latitude, 
        //   longitude: data.longitude,
        // },
      });
    });
    this.setState({
      messages,
    });
  }

  addMessage() {
    const message = this.state.messages[0];
    // add a new message to the collection
    this.referenceMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
      image: message.image,
      // location: {
      //   latitude: message.latitude, 
      //   longitude: message.longitude,
      // },
      // location: message.location,
    });
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages',
        JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      // Append new messages to the existing thread displayed on the UI
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      // store new messages in firestore by calling the 'addMessage' function
      () => {
        this.addMessage();
        this.saveMessages();
      });
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  renderBubble(props) {
    return (
      // Render custom-color chat bubble
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: this.props.route.params.color,
          }
        }}
      />
    )
  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribe();
  }

  // if user is offline, don't render input bar
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar {...props} />
      );
    }
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  }

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Text>{this.state.loggedInText}</Text> */}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
        />

        {Platform.OS === 'android'
          ? <KeyboardAvoidingView behavior='height' />
          : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})