
  /*, main = require('..')
  , parse = main.parse
  , write = main.write
  , parseFmtpConfig = main.parseFmtpConfig
  , parseParams = main.parseParams
  , parseImageAttributes = main.parseImageAttributes
  , parseSimulcastStreamList = main.parseSimulcastStreamList
  ;*/
  import fs from "fs";

  import { expect } from "chai"
  import { Parser } from '../src/Parser';
  import { Writer } from '../src/Writer';

  var parseFmtpConfig = Parser.parseFmtpConfig
  , parseParams = Parser.parseParams
  , parseImageAttributes = Parser.parseImageAttributes
  , parseSimulcastStreamList = Parser.parseSimulcastStreamList;


describe("index test", () => {


  var answerSDP = fs.readFileSync(__dirname + '/neganswer.sdp', 'utf8');
  var answerSDP1 = fs.readFileSync(__dirname + '/newanswer1.sdp', 'utf8');

  var answer1 = Parser.parse(answerSDP1+'');
  var answer = Parser.parse(answerSDP+'');


  console.log(answer.media[2]);
  console.log(answer1.media[2]);

  });
