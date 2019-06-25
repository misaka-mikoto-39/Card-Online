import React, {Component} from 'react';
import {Alert, Text, View, Dimensions, TouchableOpacity, BackHandler,
    ToastAndroid, TouchableHighlight, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createStackNavigator, createAppContainer } from 'react-navigation';
const screenWidth = Math.round(Dimensions.get('window').width);
var sk;

export default class PlayScreen extends React.Component{
  constructor(props){
    super(props);
    var dficonmap = {
      0: {
        0: {
          name: 'question-circle',
          color: 'grey'
        },
        1: {
          name: 'question-circle',
          color: 'grey'
        },
        2: {
          name: 'question-circle',
          color: 'grey'
        },
        3: {
          name: 'question-circle',
          color: 'grey'
        }
      },
      1: {
        0: {
          name: 'question-circle',
          color: 'grey'
        },
        1: {
          name: 'question-circle',
          color: 'grey'
        },
        2: {
          name: 'question-circle',
          color: 'grey'
        },
        3: {
          name: 'question-circle',
          color: 'grey'
        }
      },
      2: {
        0: {
          name: 'question-circle',
          color: 'grey'
        },
        1: {
          name: 'question-circle',
          color: 'grey'
        },
        2: {
          name: 'question-circle',
          color: 'grey'
        },
        3: {
          name: 'question-circle',
          color: 'grey'
        }
      },
      3: {
        0: {
          name: 'question-circle',
          color: 'grey'
        },
        1: {
          name: 'question-circle',
          color: 'grey'
        },
        2: {
          name: 'question-circle',
          color: 'grey'
        },
        3: {
          name: 'question-circle',
          color: 'grey'
        }
      },
    };
    sk = this;
    this.socket = props.navigation.state.params.socket;
    this.state = {
      room: props.navigation.state.params.map.roomid,
      player1: props.navigation.state.params.map.player1,
      color1: 'black',
      player1point: props.navigation.state.params.map.player1point,
      player2: props.navigation.state.params.map.player2,
      color2: 'black',
      player2point: props.navigation.state.params.map.player2point,
      playing: 0,
      iconmap: dficonmap
    }
    this.socket.on('server-send-playfirst-signal',function(data){
      sk.setState({
        playing: 1
      });
      if(data.playing == 1){
        sk.setState({
          color1: 'red',
          color2: 'black'
        });
      }else if(data.playing == 2){
        sk.setState({
          color1: 'black',
          color2: 'red'
        });
      }
      Alert.alert(
          '',
          'YOUR TURN!', [{
              text: 'OK',
          }, ], {
              cancelable: false
          }
        )
    });
    this.socket.on('server-send-play-signal',function(data){
      sk.setState({
        playing: 1
      });
      if(data.playing == 1){
        sk.setState({
          color1: 'red',
          color2: 'black'
        });
      }else if(data.playing == 2){
        sk.setState({
          color1: 'black',
          color2: 'red'
        });
      }
    });

    this.socket.on('server-send-stop-signal',function(data){
      sk.setState({
        playing: 0
      });
      if(data.playing == 1){
        sk.setState({
          color1: 'red',
          color2: 'black'
        });
      }else if(data.playing == 2){
        sk.setState({
          color1: 'black',
          color2: 'red'
        });
      }
    });

    this.socket.on('server-send-point',function(data){
      sk.setState({
        player1point: data.player1,
        player2point: data.player2
      });
      //sk.socket.emit('view-id');
    });

    this.socket.on('server-send-win-signal',function(){
      Alert.alert(
        'Congratulations !',
        'You are the winner', [{
            text: 'OK',
            onPress: () => {
              sk.setState({ iconmap: dficonmap });
              props.navigation.navigate('MultiLogin');
              sk.socket.emit('client-leave');
            }
        }, ], {
            cancelable: false
        }
      )
    });
    this.socket.on('server-send-lost-signal',function(){
      Alert.alert(
        'Sorry :(',
        'You lose -_-', [{
            text: 'OK',
            onPress: () => {
              sk.setState({ iconmap: dficonmap });
              props.navigation.navigate('MultiLogin');
              sk.socket.emit('client-leave');
            }
        }, ], {
            cancelable: false
        }
      )
    });
    this.socket.on('server-send-nowin-signal',function(){
      Alert.alert(
        'Try again',
        'Deuce', [{
            text: 'OK',
            onPress: () => {
              sk.setState({ iconmap: dficonmap });
              props.navigation.navigate('MultiLogin');
              sk.socket.emit('client-leave');
            }
        }, ], {
            cancelable: false
        }
      )
    });

    this.socket.on('server-client-quit',function(data){
      Alert.alert(
        'Game Over',
        'Your enemy quit!', [{
            text: 'OK',
            onPress: () => {
              sk.setState({ iconmap: dficonmap });
              props.navigation.navigate('MultiLogin');
              sk.socket.emit('client-leave');
            }
        }, ], {
            cancelable: false
        }
      )
    });

    this.socket.on('server-send-open-img',function(data){
      var newiconmap = sk.state.iconmap;
      newiconmap[data.x][data.y].name = data.imgo.img;
      newiconmap[data.x][data.y].color = data.imgo.color;
      sk.setState({
          iconmap: newiconmap
        });
    });

    this.socket.on('server-send-close-img',function(data){
      var newiconmap = sk.state.iconmap;
      newiconmap[data.x1][data.y1].name = 'question-circle';
      newiconmap[data.x1][data.y1].color = 'grey';
      newiconmap[data.x2][data.y2].name = 'question-circle';
      newiconmap[data.x2][data.y2].color = 'grey';
      sk.setState({
          iconmap: newiconmap
        });
    });
  }

  componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    // if (this.props.isFocused){
      Alert.alert(
        'Warning',
        'Are you sure to quit this game?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          { 
            text: 'OK', 
            onPress: () => {
              sk.props.navigation.navigate('MultiLogin');
              sk.socket.emit('client-quit');
            } 
          }
        ],
        { cancelable:false }
      )
      return true;
    // }
  }

  onOpen(xi,yi){
    if(this.state.playing == 1 && sk.state.iconmap[xi][yi].name=='question-circle'){
      var datasend = {
        x: xi,
        y: yi
      }
      sk.socket.emit('client-choose-img', datasend);
      sk.setState({
        playing: 0
      });
    }
  }
 
	render() {
    //const map = this.props.navigation.state.params.map;
    return (
      <View style={{flex:1, padding:50}}>
        <Text style={{fontSize: 25,marginBottom:50, color:'green'}}>Room: {this.state.room}</Text>
        <View style={{flex:1, flexDirection:'row', justifyContent :'space-around'}}>
          <View><Text style={{fontSize: 30, color: this.state.color1}}>{this.state.player1}: {this.state.player1point}</Text></View>
          <View><Text style={{fontSize: 30, color: this.state.color2}}>{this.state.player2}: {this.state.player2point}</Text></View>
        </View>
        {/* <View style={{flex:1}}> */}
          <View style={styles.row}>
            <Icon onPress = {()=>{this.onOpen(0,0)}} name = {this.state.iconmap[0][0].name} color = {this.state.iconmap[0][0].color}  size={50}/>
            <Icon onPress = {()=>{this.onOpen(0,1)}} name = {this.state.iconmap[0][1].name} color = {this.state.iconmap[0][1].color}  size={50}/>
            <Icon onPress = {()=>{this.onOpen(0,2)}} name = {this.state.iconmap[0][2].name} color = {this.state.iconmap[0][2].color}  size={50}/>
            <Icon onPress = {()=>{this.onOpen(0,3)}} name = {this.state.iconmap[0][3].name} color = {this.state.iconmap[0][3].color}  size={50}/>
          </View>
          <View style={styles.row}>
            <Icon onPress = {()=>{this.onOpen(1,0)}} name = {this.state.iconmap[1][0].name} color = {this.state.iconmap[1][0].color}  size={50}/>
            <Icon onPress = {()=>{this.onOpen(1,1)}} name = {this.state.iconmap[1][1].name} color = {this.state.iconmap[1][1].color}  size={50}/>
            <Icon onPress = {()=>{this.onOpen(1,2)}} name = {this.state.iconmap[1][2].name} color = {this.state.iconmap[1][2].color}  size={50}/>
            <Icon onPress = {()=>{this.onOpen(1,3)}} name = {this.state.iconmap[1][3].name} color = {this.state.iconmap[1][3].color}  size={50}/>
          </View>
          <View style={styles.row}>
            <Icon onPress = {()=>{this.onOpen(2,0)}} name = {this.state.iconmap[2][0].name} color = {this.state.iconmap[2][0].color}  size={50}/>
            <Icon onPress = {()=>{this.onOpen(2,1)}} name = {this.state.iconmap[2][1].name} color = {this.state.iconmap[2][1].color}  size={50}/>
            <Icon onPress = {()=>{this.onOpen(2,2)}} name = {this.state.iconmap[2][2].name} color = {this.state.iconmap[2][2].color}  size={50}/>
            <Icon onPress = {()=>{this.onOpen(2,3)}} name = {this.state.iconmap[2][3].name} color = {this.state.iconmap[2][3].color}  size={50}/>
          </View>
          <View style={styles.row}>
            <Icon onPress = {()=>{this.onOpen(3,0)}} name = {this.state.iconmap[3][0].name} color = {this.state.iconmap[3][0].color}  size={50}/>
            <Icon onPress = {()=>{this.onOpen(3,1)}} name = {this.state.iconmap[3][1].name} color = {this.state.iconmap[3][1].color}  size={50}/>
            <Icon onPress = {()=>{this.onOpen(3,2)}} name = {this.state.iconmap[3][2].name} color = {this.state.iconmap[3][2].color}  size={50}/>
            <Icon onPress = {()=>{this.onOpen(3,3)}} name = {this.state.iconmap[3][3].name} color = {this.state.iconmap[3][3].color}  size={50}/>
          </View>
        </View>
      // </View>
    );

  }

}


var styles = StyleSheet.create({
  row:{
    flex:1,
    flexDirection:'row',
    justifyContent :'space-around',
    // width: screenWidth
  }
})

