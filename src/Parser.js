import { grammar } from './grammar';

function toIntIfInt(v) {
  return String(Number(v)) === v ? Number(v) : v;
}

function attachProperties(match, location, names, rawName) {
  if (rawName && !names) {
    location[rawName] = toIntIfInt(match[1]);
  } else {
    for (let i = 0; i < names.length; i += 1) {
      if (match[i+1] != null) {
        location[names[i]] = toIntIfInt(match[i+1]);
      }
    }
  }
}

function parseReg(obj, location, content) {
  const needsBlank = obj.name && obj.names;

  if (obj.push && !location[obj.push]) {
    location[obj.push] = [];
  } else if (needsBlank && !location[obj.name]) {
    location[obj.name] = {};
  }

  const keyLocation = obj.push ?
    {} :  // blank object that will be pushed
    needsBlank ? location[obj.name] : location; // otherwise, named location or root

  attachProperties(content.match(obj.reg), keyLocation, obj.names, obj.name);

  if (obj.push) {
    location[obj.push].push(keyLocation);
  }
}



const validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);


function paramReducer(acc, expr) {
  const s = expr.split(/=(.+)/, 2);

  if (s.length === 2) {
    acc[s[0]] = toIntIfInt(s[1]);
  } else if (s.length === 1 && expr.length > 1) {
    acc[s[0]] = undefined;
  }

  return acc;
}


class Parser {

  static parse(sdp) {
    const session = {}
      , media = []; // points at where properties go under (one of the above)

    let location = session;

    // parse lines we understand
    sdp.split(/(\r\n|\r|\n)/).filter(validLine).forEach((l) => {
      const type = l[0],
      content = l.slice(2);

      if (type === 'm') {
        media.push({rtp: [], fmtp: []});
        location = media[media.length-1]; // point at latest media line
      }

      for (let j = 0; j < (grammar[type] || []).length; j += 1) {
        const obj = grammar[type][j];

        if (obj.reg.test(content)) {
          return parseReg(obj, location, content);
        }
      }
    });

    session.media = media; // link it up
    return session;
  }

  static parseParams(str) {
    return str.split(/;\s?/).reduce(paramReducer, {});
  }

  /*
   * Reverse the config object back to a string
   */
  static writeConfigParams(config) {
    return Object.keys(config).map(key => key + '=' + config[key]).join(';');
  }

  static parsePayloads(str) {
    return str.toString().split(' ').map(Number);
  }

  static parseRemoteCandidates(str) {
    const candidates = [],
    parts = str.split(' ').map(toIntIfInt);

    for (let i = 0; i < parts.length; i += 3) {
      candidates.push({
        component: parts[i],
        ip: parts[i + 1],
        port: parts[i + 2]
      });
    }

    return candidates;
  }

  static parseImageAttributes(str) {
    return str.split(' ').map((item) => {
      return item.substring(1, item.length-1).split(',').reduce(paramReducer, {});
    });
  }

  static parseSimulcastStreamList(str) {
    return str.split(';').map((stream) => {
      return stream.split(',').map((format) => {
        let scid, paused = false;

        if (format[0] !== '~') {
          scid = toIntIfInt(format);
        } else {
          scid = toIntIfInt(format.substring(1, format.length));
          paused = true;
        }

        return {
          scid: scid,
          paused: paused
        };
      });
    });
  }

}

export { Parser };