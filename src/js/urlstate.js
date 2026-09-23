/* Serialization / deserialization of the subnet design on the URL.
   Query format: network=<ip>&mask=<bits>&division=<len.hex>&showcolumn=<c1,c2>&names=<n1,n2>
   Requires ipmath.js */

function buildStateQuery(network, mask, root, visibleColumns)
{
  var query = 'network='+inet_ntoa(network)+'&mask='+mask+'&division='+binToAscii(nodeToString(root));

  if (visibleColumns) {
    var shown = [];
    for (const col in visibleColumns) {
      if (visibleColumns[col]) {
        shown.push(col);
      }
    }
    query += '&showcolumn='+shown.join(',');
  }

  var names = collectNames(root, []);
  if (names.some(function (n) { return n !== ''; })) {
    /* double encoding keeps separators safe through parseQueryString's unescape */
    query += '&names='+names.map(function (n) { return encodeURIComponent(encodeURIComponent(n)); }).join(',');
  }

  return query;
}

/* Returns {network, mask, root, columns} or null when the query holds no design */
function parseState(str)
{
  var args = parseQueryString(str);

  if (!args['network'] || !args['mask'] || !args['division']) {
    return null;
  }

  var network = inet_aton(args['network']);
  if (network === null) {
    return null;
  }

  var root = [0, 0, null];
  var division = asciiToBin(args['division']);
  if (division != '0') {
    loadNode(root, division);
  }

  if (args['names']) {
    applyNames(root, args['names'].split(',').map(function (n) { return decodeURIComponent(n); }), 0);
  }

  return {
    network: network,
    mask: parseInt(args['mask']),
    root: root,
    columns: (args['showcolumn'] !== undefined ? args['showcolumn'].split(',') : null)
  };
}

function nodeToString(node)
{
  if (node[2]) {
    return '1'+nodeToString(node[2][0])+nodeToString(node[2][1]);
  }
  else {
    return '0';
  }
}

function loadNode(curNode, division)
{
  if (division.charAt(0) == '0') {
    return division.substr(1);
  }
  else {
    curNode[2] = new Array();
    curNode[2][0] = [0, 0, null];
    curNode[2][1] = [0, 0, null];

    division = loadNode(curNode[2][0], division.substr(1));
    division = loadNode(curNode[2][1], division);
    return division;
  }
}

function collectNames(node, names)
{
  if (node[2]) {
    collectNames(node[2][0], names);
    collectNames(node[2][1], names);
  }
  else {
    names.push(node[3] ? node[3] : '');
  }
  return names;
}

function applyNames(node, names, index)
{
  if (node[2]) {
    index = applyNames(node[2][0], names, index);
    index = applyNames(node[2][1], names, index);
    return index;
  }

  node[3] = (index < names.length ? names[index] : '');
  return index + 1;
}

function binToAscii(str)
{
  var curOut = '';
  var curBit = 0;
  var curChar = 0;

  for (var i=0; i<str.length; i++) {
    if (str.charAt(i) == '1') {
      curChar |= 1<<curBit;
    }
    curBit++;
    if (curBit > 3) {
      curOut += curChar.toString(16);
      curChar = 0;
      curBit = 0;
    }
  }
  if (curBit > 0) {
    curOut += curChar.toString(16);
  }
  return str.length+'.'+curOut;
}

function asciiToBin(str)
{
  var re = /([0-9]+)\.([0-9a-f]+)/;
  var res = re.exec(str);
  var out = '';
  for (var i=0; i< res[1]; i++) {
    var ch = parseInt(res[2].charAt(Math.floor(i/4)), 16);
    var pos = i % 4;
    out += (ch & (1<<pos) ? '1' : '0');
  }
  return out;
}

function parseQueryString (str)
{
  str = str ? str : location.search;
  var query = str.charAt(0) == '?' ? str.substring(1) : str;
  var args = new Object();
  if (query) {
    var fields = query.split('&');
    for (var f = 0; f < fields.length; f++) {
      var field = fields[f].split('=');
      args[unescape(field[0].replace(/\+/g, ' '))] =
        unescape(field[1].replace(/\+/g, ' '));
    }
  }
  return args;
}
