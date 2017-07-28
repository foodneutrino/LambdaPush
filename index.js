/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa  = require('alexa-sdk');
const AwsIot = require('aws-iot-device-sdk');

const APP_ID = "amzn1.ask.skill.0b745e81-4748-48eb-a927-a1cc33e5ac56";

//  IOT_BROKER_ENDPOINT      : "a92x04d9sswpf.iot.us-east-1.amazonaws.com".toLowerCase();
//  IOT_DEVICE_NAME          : "arn:aws:iot:us-east-1:77554764266:thing";
//  IOT_BROKER_REGION        : "us-east-1";
//  IOT_THING_NAME           : "PublishTest";
//  host                     : "a92x04d9sswpf.iot.us-east-1.amazonaws.com",
//  port                     : 8883,
var config = {
  keyPath                  : __dirname+'/keys/2175dd0d93-private.pem.key',
  certPath                 : __dirname+'/keys/2175dd0d93-certificate.pem.crt',
  caPath                   : __dirname+'/keys/root-CA.crt',
  host                     : "a92x04d9sswpf.iot.us-east-1.amazonaws.com",
  clientId                 : "PublishTest",
  region                   : "us-east-1",
  protocol                 : 'mqtts',
  debug                    : true
}

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'TestPublish': function () {
        console.log("Received the intent");
        const rxPayload = this.event.request.intent.slots.message.value;
        const txPayload = {"message": rxPayload};
        console.log("Payload: [" + rxPayload + "]");

        const device = AwsIot.thingShadow(config);

        console.log("Attempt to connect to AWS ");
        device.on("connect",function(){
            console.log("Connected to AWS ");
            // publish to clientId/Topic
            device.publish('PublishTest/image_request', JSON.stringify(txPayload), function(){
              console.log("Response From Publish")
              device.end()
          });
        });

        device.on('close', function() {
            console.log('Recieved close from IoT')
        })

        this.emit(':tell', rxPayload);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

