import Amplify, { PubSub } from 'aws-amplify';
import { API } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import './assets/css/style.css'
import header from './assets/images/header2.png'
Amplify.configure(awsconfig);

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

const login = function (username, password) {
  // For advanced usage
  // You can pass an object which has the username, password and validationData which is sent to a PreAuthentication Lambda trigger
  Auth.signIn({
    username, // Required, the username
    password, // Optional, the password
  }).then(user => {
    console.log(user)
    $("#success-alert").removeClass("alert-warning").addClass("alert-success").html("sucesso!").fadeTo(3000, 1000).slideUp(1000, function () {
      $("#success-alert").slideUp(1000);
    })
  })
    .catch(err => {
      $("#success-alert").removeClass("alert-success").addClass("alert-warning").html("Error!").fadeTo(3000, 1000).slideUp(1000, function () {
        $("#success-alert").slideUp(1000);
      })
      console.log(err)
    });
}

Amplify.addPluggable(new AWSIoTProvider({
  aws_pubsub_region: 'us-east-1',
  aws_pubsub_endpoint: 'wss://a1u5p9d1s2ikgy-ats.iot.us-east-1.amazonaws.com/mqtt',
}));

PubSub.subscribe("esp8266/modeOp/res", { provider: 'AWSIoTProvider' }).subscribe({
    next: data => {
      console.log('Message received', data)
      $("#success-alert-receive").removeClass("d-none").html(`Mensagem Recebida pelo dispositivo!`).fadeTo(3000, 1000).slideUp(1000, function () {
        $("#success-alert-receive").slideUp(1000);
      })
      },
    error: error => console.error(error) ,
    close: () => console.log('Done'),
  })

const publish_timer = function (timer) {
  console.log(timer)
  let connectionTime=parseInt(timer)
  PubSub.publish('esp8266/Timer', { "connectionTime": connectionTime })
}

const publish_state = function (mode) {
  console.log(mode)
  let modeOp = parseInt(mode)
  PubSub.publish('esp8266/mode', { "modeOp":modeOp})
}

Auth.currentCredentials().then((info) => {
  const cognitoIdentityId = info;
  console.log("usuário", cognitoIdentityId);
  if (cognitoIdentityId.authenticated) {
    console.log("Authenticated: true")
    $("#user_label").html("Authenticated: true")
  } else {
    console.log("Authenticated: false")
    $("#user_label").html("Authenticated: false")
  }
});


let delay = 3000; //5 seconds
setInterval(function () {
  API.get('controleContinuoAPI', '/device', {}).then(result => {
    let status_device = JSON.parse(`{"status_connection":${result.data.Items[0].status_connection}}`)
    let modeOp = JSON.parse(`{"modeOp":${result.data.Items[0].modeOp}}`)
    let connectionTime = JSON.parse(`{"connectionTime":${result.data.Items[0].connectionTime}}`)
    console.log(status_device, modeOp, connectionTime);
    if (status_device.status_connection == 1) {
      $("#status_device").removeClass("status_desligado").addClass("status_ligado")
      if(modeOp.modeOp == 0){
      	$("#modoOp").html("Detecção de Acidentes")
      }else{
      	$("#modoOp").html("Alarme")
      }
      if(connectionTime.connectionTime){
      	$("#connectionTime").html(`${connectionTime.connectionTime} min`)
      }
    } else {
      $("#status_device").removeClass("status_ligado").addClass("status_desligado")
      $("#modoOp").html("...")
      $("#modoOp").html("...")
    }
  }).catch(err => {
    console.log(err);
  })
}, delay);

/*const username = "teste"
const password = "teste123"
const email= "weslei200912@gmail.com"
const code = "521843"

function signUp() {
  try {
      const { user } = Auth.signUp({
          username,
          password,
          attributes: {
              email          // optional
          }
      });
      console.log(user);
  } catch (error) {
      console.log('error signing up:', error);
  }
}
const resendCode = function (username) {
  Auth.resendSignUp(username).then(() => {
    console.log('code resent successfully');
  }).catch(e => {
    console.log(e);
  });
}
const confirmation = function (username, code) {
  // After retrieveing the confirmation code from the user
  Auth.confirmSignUp(username, code, {
    // Optional. Force user confirmation irrespective of existing alias. By default set to True.
    forceAliasCreation: true
  }).then(data => console.log(data))
    .catch(err => console.log(err));
}
*/

export {
  header,login,publish_timer,publish_state
}