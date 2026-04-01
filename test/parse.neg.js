
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

  var offerSDP = fs.readFileSync(__dirname + '/origoffer.sdp', 'utf8');
  var answerSDP = fs.readFileSync(__dirname + '/origanswer.sdp', 'utf8');

  var offer = Parser.parse(offerSDP+'');
  var answer = Parser.parse(answerSDP+'');

  /*const answerLength = answer.media.length;
  if (offer.media.length > answerLength) {
    const newMedias = offer.media.slice(answerLength - 1);

  }*/

  offer.media.forEach(offeredMedia => {

    if (!answer.media.find(answerMedia => answerMedia.mid === offeredMedia.mid)) {
            console.log("media not found in answer adding");

            //const answeredMedia = Object.assign({}, offeredMedia);
            //answeredMedia.direction = "sendonly";

            const firstMediaType = answer.media.find(media => media.type == offeredMedia.type);

            answer.connection = offeredMedia.connection;

            const answeredMedia = Object.assign({}, offeredMedia, {
                rtp: firstMediaType.rtp,
                fmtp: firstMediaType.fmtp,
                rtcpFb: firstMediaType.rtcpFb,
                ext: firstMediaType.ext,
                setup: firstMediaType.setup,
                candidates: firstMediaType.candidates,
                iceUfrag: firstMediaType.iceUfrag,
                icePwd: firstMediaType.icePwd,
                fingerprint: firstMediaType.fingerprint,
                payloads: firstMediaType.payloads,
                protocol: firstMediaType.protocol,
                direction: "sendonly"
            });
            
            /*const answeredMedia = Object.assign({},firstMediaType, {
              port: offeredMedia.port,
              mid: offeredMedia.mid
            });*/


            delete(answeredMedia.iceOptions);

    

            //console.log("first media", firstMediaType);
           //console.log(offeredMedia.connection);

           answer.media.push(answeredMedia);
           
           //add mid to bundle
           answer.groups[0].mids += ` ${answeredMedia.mid}`;

           answer.media.forEach(m => {
            delete(m.connection);
            m.extmapAllowMixed = answer.extmapAllowMixed;
            m.port = answeredMedia.port;
            console.log("fingerprint", m.fingerprint);
  
           });
           
            // console.log("first media", firstMediaType.fmtp, firstMediaType.rtp);

            //answeredMedia.setCodecs(first.getCodecs())

    } 


  });

  //console.log(answer)
  //console.log(offer);

  //answer.media.forEach(media => console.log(media.connection));
  //console.log(answer.media[0].connection);

  console.log(Writer.write(answer));

/*
  add extensions to offer sdp
  const remoteVideoExtensions = answer.media.filter(item => item.type == "video")[0]?.ext;

  offer.media.filter(item => item.type == "video").forEach(offeredMedia => {
    remoteVideoExtensions.forEach(remoteExt => {
      

        console.log("filtered ", offeredMedia.ext.filter(offerExt => offerExt.uri === remoteExt.uri));

        if (!offeredMedia.ext.filter(offerExt => offerExt.uri === remoteExt.uri)) {
            console.log("Not in extensions ",  remoteExt.url);
            offeredMedia.ext.push(remoteExt);
        }
    });
  });

*/
  
  //console.log("OFFER EXT");
  //console.log(offer.media.filter(item => item.type == "video")[0].ext);


  //console.log("answer ext ", remoteVideoExtensions);

  //console.log(offer);
  //console.log(answer);

  //console.log("remote ext ", remoteVideoExtensions);

 // console.log("new sdp", Writer.write(session));
 
    
});

/*
  
renegotiate (localDescription, remoteDescription) {
    const offer = SDPInfo.parse(localDescription)
    const answer = SDPInfo.parse(remoteDescription)

    // Check all transceivers on the offer are on the answer
    for (const offeredMedia of offer.getMedias()) {
      // Get associated mid on the answer
      let answeredMedia = answer.getMediaById(offeredMedia.getId())
      // If not found in answer
      if (!answeredMedia) {
        // Create new one
        answeredMedia = new MediaInfo(offeredMedia.getId(), offeredMedia.getType())
        // Set direction
        answeredMedia.setDirection(Direction.reverse(offeredMedia.getDirection()))
        // Find first media line for same kind
        const first = answer.getMedia(offeredMedia.getType())
        // If found
        if (first) {
          // Copy codec info
          answeredMedia.setCodecs(first.getCodecs())
          // Copy extension info
          for (const [id, extension] of first.getExtensions()) {
            // Add it
            answeredMedia.addExtension(id, extension)
          }
        }
        // Add it to answer
        answer.addMedia(answeredMedia)
      }
    }

    return answer.toString()
  },
  */

/*
updateMissingVideoExtensions (localDescription, remoteDescription) {
    const offer = SDPInfo.parse(localDescription)
    const answer = SDPInfo.parse(remoteDescription)
    // Get extensions of answer
    const remoteVideoExtensions = answer.getMediasByType('video')[0]?.getExtensions()
    if (!remoteVideoExtensions && !remoteVideoExtensions.length) {
      return
    }
    for (const offeredMedia of offer.getMediasByType('video')) {
      const offerExtensions = offeredMedia.getExtensions()
      remoteVideoExtensions.forEach((val, key) => {
        // If the extension is not present in offer then add it
        if (!offerExtensions.get(key)) {
          const id = offeredMedia.getId()
          const header = 'a=extmap:' + key + ' ' + val + '\r\n'
          const regex = new RegExp('(a=mid:' + id + '\r\n(?:.*\r\n)*?)', 'g')
          localDescription = localDescription.replace(regex, (_, p1, p2) => p1 + header)
        }
      })
    }
    return localDescription
  },*/