
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

  var sdp = fs.readFileSync(__dirname + '/normal2.sdp', 'utf8');

  var session = Parser.parse(sdp+'');

  it('got session info', () => {
      expect(session).to.be.ok;
  })

  //console.log("SESSION ", session.media[1].ext);

  const sortedArray = session.media[1].ext.sort(function(a,b) {
    if (a.value > b.value) {
        return 1
    } else {
        return -1
    }
});


  const id = sortedArray[sortedArray.length -1].value + 1;

  //session.media[1].ext.push({ value: id, uri: "https://aomediacodec.github.io/av1-rtp-spec/#dependency-descriptor-rtp-header-extension"});
  //console.log(sortedArray);
  
  session.media[0].rtp[0].codec = "multiopus";
  session.media[0].rtp[0].encoding = 6;
  session.media[0].fmtp[0].config = "channel_mapping=0,4,1,2,3,5;coupled_streams=2;minptime=10;num_streams=4;useinbandfec=1";

  //console.log(session.media[0]);
  console.log(Writer.write(session));
  //const header = 'a=extmap:' + id + ' https://aomediacodec.github.io/av1-rtp-spec/#dependency-descriptor-rtp-header-extension\r\n'

  var media = session.media;

  it( 'got media', () => {
      expect(media && media.length > 0).to.be.ok;
  })

  it('origin username', () => {
    expect(session.origin.username).to.equal('-');
  })

  it('session.origin.sessionId', () => {
    expect(session.origin.sessionId).to.equal(20518);
  })

  it('origin sessionVersion', () => {
    expect(session.origin.sessionVersion).to.equal(0);
  })

  it('origin netType', () => {
    expect(session.origin.netType).to.equal('IN');
  })

  it('origin ipVer', () => {
    expect(session.origin.ipVer).to.equal(4);
  })

  it('origin address', () => {
    expect(session.origin.address).to.equal('203.0.113.1');
  })


  it('session connect ip', () => {
    expect(session.connection.ip).to.equal('203.0.113.1');
  })

  it('session connect ip ver', () => {
    expect(session.connection.version).to.equal(4);
  })

   // global ICE and fingerprint
  it('global ufrag', () => {
    expect(session.iceUfrag).to.equal('F7gI');
  })

  it('global pwd', () => {
    expect(session.icePwd).to.equal('x9cml/YzichV2+XlhiMu8g');
  })



  var audio = media[0];

  it('audio type', () => {
    expect(audio.type).to.equal('audio');
  })

  it('audio port', () => {
    expect(audio.port).to.equal(54400);
  })

  it('audio protocol', () => {
    expect(audio.protocol).to.equal('RTP/SAVPF');
  })

  it('audio direction', () => {
    expect(audio.direction).to.equal('sendrecv');
  })

  it('audio rtp 0 payload', () => {
    expect(audio.rtp[0].payload).to.equal(0);
  })

  it('audio rtp 0 codec', () => {
    expect(audio.rtp[0].codec).to.equal('PCMU');
  })

  it('audio rtp 0 rate', () => {
    expect(audio.rtp[0].rate).to.equal(8000);
  })

  it('audio rtp 1 payload', () => {
    expect(audio.rtp[1].payload).to.equal(96);
  })

  it('audio rtp 1 codec', () => {
    expect(audio.rtp[1].codec).to.equal('opus');
  })

  it('audio rtp 1 rate', () => {
    expect(audio.rtp[1].rate).to.equal(48000);
  })

    
});

