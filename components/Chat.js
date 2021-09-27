import React from 'react';
import { View, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello Developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140140any',
          },
        },
        {
          _id: 2,
          text: `${this.props.route.params.name} has joined the chat.`,
          createdAt: new Date(),
          system: true,
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      // Append new messages to the existing thread displayed on the UI
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderBubble(props) {
    return (
      // Render custom-color chat bubble
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  render() {
    // pull name and color props from start screen
    let name = this.props.route.params.name;
    let color = this.props.route.params.color;

    // set states accordingly
    this.props.navigation.setOptions({
      title: name,
      backgroundColor: color,
    });

    return (
      <View style={styles.container}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{ _id: 1, }}
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