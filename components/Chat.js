import React from 'react';
import { View, Text } from 'react-native';

export default class Chat extends React.Component {
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color }}>
        <Text>Welcome to the chat!</Text>
      </View>
    )
  }
}