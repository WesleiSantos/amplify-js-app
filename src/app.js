import Amplify, { PubSub } from 'aws-amplify';
import { API } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import './assets/css/style.css'
import header from './assets/img/header2.png'
Amplify.configure(awsconfig);

import $ from 'jquery';
window.jQuery = $;
window.$ = $;

/*const username = "weslei"
const password = "weslei200"
const email= "weslei200912@gmail.com"
const code = "972842"*/

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

  PubSub.subscribe("cmd/esp8266/house/lampada/res", { provider: 'AWSIoTProvider' }).subscribe({
    next: data => {
      console.log('Message received', data)
      $("#success-alert-receive").removeClass("d-none").html(`Mensagem Recebida pelo dispositivo!`).fadeTo(3000, 1000).slideUp(1000, function () {
        $("#success-alert-receive").slideUp(1000);
      })
      },
    error: error => console.error(error) ,
    close: () => console.log('Done'),
  })

const publish_lampada_status = function (comando) {
  console.log(comando)
  PubSub.publish('cmd/esp8266/house/lampada/atualizar_status', { "status": comando })
}

const publish_tarifa = function (valor_tarifa) {
  console.log(valor_tarifa)
  PubSub.publish('cmd/esp8266/house/lampada/atualizar_tarifa', { "tarifa": valor_tarifa })
}

const publish_temporizador = function (status, dia, hora_inicio, quantidade_tempo) {
  console.log(status, dia, hora_inicio, quantidade_tempo)
  PubSub.publish('cmd/esp8266/house/lampada/atualizar_temporizador', { "status": status, "dia": dia, "hora_inicio": hora_inicio, "quantidade_tempo": quantidade_tempo })
}

Auth.currentCredentials().then((info) => {
  const cognitoIdentityId = info;
  console.log("usuário", cognitoIdentityId);
  if (cognitoIdentityId.authenticated) {
    $("#user_label").html("Authenticated: true")
  } else {
    $("#user_label").html("Authenticated: false")
  }
});

export {
  header
}