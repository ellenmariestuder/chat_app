import React from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet, Text } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: '',
      loggedInText: ''
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

    this.referenceMessages = firebase.firestore().collection('messags')
    // this.referenceMessageUser = null;
    // this.referenceMessages = null;
  }

  componentDidMount() {
    const name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name })

    // create a reference to the messages collection
    this.referenceMessages = firebase.firestore().collection('messages');

    // listen to authentication events
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) { await firebase.auth().signInAnonymously(); }

      // update user state with currently active user data
      this.setState({
        user: user.uid,
        messages: [
          {
            _id: 2,
            text: `${this.props.route.params.name} has joined the chat.`,
            createdAt: new Date(),
            system: true,
          },
        ],
        user: {
          _id: user.uid,
          // name: name,
        },
        loggedInText: `${this.props.route.params.name} has entered the chat`,
      });
      this.unsubscribe = this.referenceMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    });

    // // create reference to active user's documents
    // this.referenceMessageUser = firebase
    //   .firestore()
    //   .collection('messages')
    //   .where('uid', '==', this.state.uid);

    // // listen to collection changes for current user
    // this.unsubscribeMessageUser = this.referenceMessageUser.onSnapshot(this.onCollectionUpdate)

  }

  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribe();
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
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      // Append new messages to the existing thread displayed on the UI
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      // store new messages in firestore by calling the 'addMessage' function
      () => {
        this.addMessage();
      });
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

  render() {
    return (
      <View style={styles.container}>
        {/* <Text>{this.state.loggedInText}</Text> */}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
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