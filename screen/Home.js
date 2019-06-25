import React, {Component} from 'react';
import {Alert, Text, View, TextInput, TouchableOpacity, TouchableHighlight, StyleSheet, BackHandler} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import io from "socket.io-client/dist/socket.io.js";
import { createStackNavigator, createAppContainer } from 'react-navigation';

var e;
export default class MultiScreen extends React.Component{
  constructor(props){
    super(props);
    
    //ket noi sv
    
    this.state = {
      name: '',
      roomid: '',
      ip:''
    }
    this.socket = null
    
  }

  clickConnect(navigation){
    this.socket = io(`http://${this.state.ip}:3000`, {jsonp:false});
    e = this.socket;
    
    this.socket.on('server-error-msg',function(data){
      Alert.alert(data.msg);
    });

    this.socket.on('server-send-room-data',function(data){
    	navigation.navigate('MultiPlaying', {map:data, socket: e});
    });
  }

  // an nut tao phong
  clickCreate(){
    var sdata = {
      name: this.state.name,
      roomid: this.state.roomid,
    }
    this.socket.emit('client-create', sdata);
      Alert.alert(
          'Waitting',
          'Wait for enemy!', [{
              text: 'Cancel',
              onPress: () => {
                this.socket.emit('client-leave');
              }
          }, ], {
              cancelable: false
          }
        )
  }


  // an nut vao phong
  clickJoin(){
    var sdata = {
      name: this.state.name,
      roomid: this.state.roomid
    }
    this.socket.emit("client-join", sdata)
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.goBack());
  }
  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', () => this.props.navigation.goBack());
  }
  render() {
    /*let CardSource = FontAwesome; // set FontAwesome as the default icon source
    let icon_name = 'user-secret';
    Icon onPress = {()=>{this.clickJoin()}} name="user-secret" color="red" size={50}
    let icon_color = 'pink';*/

    return (
     
      <View style={{flex:1, padding:50}}>
        <Text style={{marginTop:50}}>IP Server </Text>
        <TextInput
          style={styles.txtInput}
          onChangeText={(ip) => this.setState({ip})}
          value={this.state.ip}
        />
        <TouchableOpacity 
          onPress = {()=>this.clickConnect(this.props.navigation)}
          style={styles.btnAdd}>
          <Text style={{color:'white'}}>Connect</Text>
        </TouchableOpacity>
        <Text style={{marginTop:10}}>Your name </Text>
            <TextInput
              style={styles.txtInput}
              onChangeText={(name) => this.setState({name})}
              value={this.state.name}
            /> 
        <Text>Room Code </Text>
            <TextInput
              style={styles.txtInput}
              onChangeText={(roomid) => this.setState({roomid})}
              value={this.state.roomid}
            />
        <View style={{flex:1,justifyContent:'space-around',flexDirection:'row'}}>
          <TouchableOpacity 
            onPress = {()=>{this.clickCreate()}}
            style={styles.btnAdd}>
            <Text style={{color:'white'}}>Create New</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress = {()=>{this.clickJoin()}}
            style={[styles.btnAdd,{backgroundColor:'green'}]}>
            <Text style={{color:'white'}}>Join In</Text>
          </TouchableOpacity>
        </View>
      </View>

    );
  }
}


var styles = StyleSheet.create({
	txtInput:{
		height: 40, 
		borderColor: 'gray', 
		borderColor: 'black', 
		padding:5, 
		borderWidth: 1,
		marginBottom:5
	},
    btnAdd:{
      backgroundColor:'#EF1457',
      padding:8,
      height: 40,
      width:100,
      marginTop:20,
      alignItems:'center'
	}
})