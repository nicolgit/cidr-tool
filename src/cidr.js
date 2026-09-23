var visibleColumns = {
    subnet: true,
    name: false,
    netmask: false,
    range: false,
    useable: true,
    hosts: true,
    divide: true,
    join: true,
  };
  
  var curNetwork = 0;
  var curMask = 0;
  
  function updateNetwork()
  {
    var newNetworkStr = document.forms['calc'].elements['network'].value;
    var newMask = parseInt(document.forms['calc'].elements['netbits'].value);
  
    var newNetwork = inet_aton(newNetworkStr);
  
    if (newNetwork === null) {
      alert('Invalid network address entered');
      return;
    }
  
    var tmpNetwork = network_address(newNetwork, newMask);
    if (newNetwork != tmpNetwork) {
      alert('The network address entered is not on a network boundary for this mask.\nIt has been changed to '+inet_ntoa(tmpNetwork)+'.');
      newNetwork = tmpNetwork;
      document.forms['calc'].elements['network'].value = inet_ntoa(tmpNetwork);
    }
  
    if (newMask < 0 || newMask > 29) {
      alert('The network mask you have entered is invalid');
      return;
    }
  
    if (curMask == 0) {
      curMask = newMask;
      curNetwork = newNetwork;
      startOver();
    }
    else if (curMask != newMask && confirm('You are changing the base network from /'+curMask+' to /'+newMask+'. This will reset any changes you have made. Proceed?')) {
      curMask = newMask;
      curNetwork = newNetwork;
  
      startOver();
    }
    else {
      document.forms['calc'].elements['netbits'].value = curMask;
      curNetwork = newNetwork;
  
      recreateTables();
    }
  }
  
  function startOver()
  {
    rootSubnet = [0, 0, null];
  
    recreateTables();
  }
  
  function recreateTables()
  {
    // Update header visibility
    for (const name in visibleColumns) {
      console.log(name)
      document.getElementById(name + 'Header').style.display = visibleColumns[name] ? 'table-cell' : 'none';
    }
  
    var calcbody = document.getElementById('calcbody');
    if (!calcbody) {
      alert('Body not found');
      return;
    }
  
    while (calcbody.hasChildNodes()) {
      calcbody.removeChild(calcbody.firstChild);
    }
  
    updateNumChildren(rootSubnet);
    updateDepthChildren(rootSubnet);
  
    createRow(calcbody, rootSubnet, curNetwork, curMask, [curMask, rootSubnet[1], rootSubnet], rootSubnet[0]);
  
    document.getElementById('joinHeader').colSpan = (rootSubnet[0] > 0 ? rootSubnet[0] : 1);
  //  document.getElementById('col_join').span = (rootSubnet[0] > 0 ? rootSubnet[0] : 1);
  
    updateSaveLink();
  }
  
  /* Create the bookmark hyperlink */
  function updateSaveLink()
  {
    var link = document.getElementById('saveLink');
    if (!link) {
      return;
    }
  
    link.href = 'index.html?'+buildStateQuery(curNetwork, curMask, rootSubnet, visibleColumns);
  }
  
  function openBicep()
  {
    window.location.href = 'bicep.html?'+buildStateQuery(curNetwork, curMask, rootSubnet, visibleColumns);
  }
  
  function openArm()
  {
    window.location.href = 'arm.html?'+buildStateQuery(curNetwork, curMask, rootSubnet, visibleColumns);
  }
  
  function createRow(calcbody, node, address, mask, labels, depth)
  {
    if (node[2]) {
      var newlabels = labels;
      newlabels.push(mask+1);
      newlabels.push(node[2][0][1]);
      newlabels.push(node[2][0]);
      createRow(calcbody, node[2][0], address, mask+1, newlabels, depth-1);
  
      newlabels = new Array();
      newlabels.push(mask+1);
      newlabels.push(node[2][1][1]);
      newlabels.push(node[2][1]);
      createRow(calcbody, node[2][1], address+subnet_addresses(mask+1), mask+1, newlabels, depth-1);
    }
    else {
      var newRow = document.createElement('TR');
      calcbody.appendChild(newRow);
  
      /* subnet address */
      if (visibleColumns.subnet) {
        var newCell = document.createElement('TD');
        newCell.appendChild(document.createTextNode(inet_ntoa(address)+'/'+mask));
        newRow.appendChild(newCell);
      }
  
      /* subnet name */
      if (visibleColumns.name) {
        var newCell = document.createElement('TD');
        var nameInput = document.createElement('INPUT');
        nameInput.type = 'text';
        nameInput.size = 10;
        nameInput.maxLength = 10;
        nameInput.value = node[3] ? node[3] : '';
        nameInput.oninput = newNameHandler(node);
        newCell.appendChild(nameInput);
        newRow.appendChild(newCell);
      }
  
      var addressFirst = address;
      var addressLast = subnet_last_address(address, mask);
      var useableFirst = address + 4;
      var useableLast = addressLast - 1;
      var numHosts;
      var addressRange;
      var usaebleRange;
  
      if (mask == 32) {
        addressRange = inet_ntoa(addressFirst);
        useableRange = addressRange;
        numHosts = 1;
      }
      else {
        addressRange = inet_ntoa(addressFirst)+' - '+inet_ntoa(addressLast);
        if (mask == 31) {
      useableRange = addressRange;
      numHosts = 2;
        }
        else {
      useableRange = inet_ntoa(useableFirst)+' - '+inet_ntoa(useableLast);
      numHosts = (1 + useableLast - useableFirst);
        }
      }
  
      /* netmask */
      if (visibleColumns.netmask) {
        var newCell = document.createElement('TD');
        newCell.appendChild(document.createTextNode(inet_ntoa(subnet_netmask(mask))));
        newRow.appendChild(newCell);
      }
  
      /* range of addresses */
      if (visibleColumns.range) {
        var newCell = document.createElement('TD');
        newCell.appendChild(document.createTextNode(addressRange));
        newRow.appendChild(newCell);
      }
  
      /* useable addresses */
      if (visibleColumns.useable) {
        var newCell = document.createElement('TD');
        newCell.appendChild(document.createTextNode(useableRange));
        newRow.appendChild(newCell);
      }
  
      /* Hosts */
      if (visibleColumns.hosts) {
        var newCell = document.createElement('TD');
        newCell.appendChild(document.createTextNode(numHosts + " + 5 Azure reserved"));
        newRow.appendChild(newCell);
      }
  
      /* actions */
  
      if (visibleColumns.divide) {
        var newCell = document.createElement('TD');
        newRow.appendChild(newCell);
  
        if (mask == 29) {
      var newLink = document.createElement('SPAN');
      newLink.className = 'disabledAction';
      newLink.appendChild(document.createTextNode('Divide'));
      newCell.appendChild(newLink);
        }
        else {
      var newLink = document.createElement('A');
      newLink.href = '#';
      newLink.onclick = function () { divide(node); return false; }
      newLink.appendChild(document.createTextNode('Divide'));
      newCell.appendChild(newLink);
        }
      }
  
      if (visibleColumns.join) {
        var colspan = depth - node[0];
  
        for (var i=(labels.length/3)-1; i>=0; i--) {
      var mask = labels[i*3];
      var rowspan = labels[(i*3)+1];
      var joinnode = labels[(i*3)+2];
  
      var newCell = document.createElement('TD');
      newCell.rowSpan = (rowspan > 1 ? rowspan : 1);
      newCell.colSpan = (colspan > 1 ? colspan : 1);
  
      if (i == (labels.length/3)-1) {
        newCell.className = 'maskSpan';
      }
      else {
        newCell.className = 'maskSpanJoinable';
        newCell.onclick = newJoin(joinnode);
        //	newCell.onmouseover = function() { window.status = joinnode[0]+'---'+joinnode[1]+'---'+joinnode[2]+'>>>>>'+node[2];}
      }
  
    var maskText = document.createElement('P');
    maskText.innerText = '/' + mask;
    newCell.appendChild(maskText);
    newRow.appendChild(newCell);
  
      colspan = 1; // reset for subsequent cells
        }
      }
    }
  
  }
  
  /* This is necessary because 'joinnode' changes during the scope of the caller */
  function newJoin(joinnode)
  {
    return function() { join(joinnode) };
  }
  
  /* Same reason: keep a stable reference to the edited node */
  function newNameHandler(namenode)
  {
    return function () {
      namenode[3] = this.value;
      updateSaveLink();
    };
  }
  
  function divide(node)
  {
    node[2] = new Array();
    node[2][0] = [0, 0, null];
    node[2][1] = [0, 0, null];
    recreateTables();
  }
  
  function join(node)
  {
    /* easy as pie */
    node[2] = null;
    recreateTables();
  }
  
  function updateNumChildren(node)
  {
    if (node[2] == null) {
      node[1] = 0;
      return 1;
    }
    else {
      node[1] = updateNumChildren(node[2][0]) + updateNumChildren(node[2][1]);
      return node[1];
    }
  }
  
  function updateDepthChildren(node)
  {
    if (node[2] == null) {
      node[0] = 0;
      return 1;
    }
    else {
      node[0] = updateDepthChildren(node[2][0]) + updateDepthChildren(node[2][1]);
      return node[1];
    }
  }
  
  
  var rootSubnet;
  
  // each node is Array:
  // [0] => depth of children, total number of visible children, children, subnet name
  
  
  function preloadSubnetImages()
  {
    if (document.images) {
      if (!document.preloadedImages) {
        document.preloadedImages = new Array();
      }
  
      for (var i=0; i<=32; i++) {
        var img = new Image();
        img.src = 'img/'+i+'.gif';
        document.preloadedImages.push(img);
      }
    }
  }
  
  
  function calcOnLoad()
  {
    preloadSubnetImages();
  
    var state = parseState();
  
    if (state === null) {
      updateNetwork();
      return;
    }
  
    if (state.columns) {
      for (const col in visibleColumns) {
        visibleColumns[col] = (state.columns.indexOf(col) >= 0);
        var cb = document.getElementById('cb_'+col);
        if (cb) {
          cb.checked = visibleColumns[col];
        }
      }
    }
  
    document.forms['calc'].elements['network'].value = inet_ntoa(state.network);
    document.forms['calc'].elements['netbits'].value = state.mask;
    updateNetwork();
  
    rootSubnet = state.root;
    recreateTables();
  }
  
  window.onload = calcOnLoad;
  
  function toggleColumn(cb)
  {
    var colName = 'col_'+(cb.id.substr(3));
  //  var col = document.getElementById(colName);
  
    visibleColumns[cb.id.substr(3)] = cb.checked;
  
  //  if (cb.checked) {
  //    col.style.display = 'table-column';
  //    col.style.visibility = 'visible';
  //  }
  //  else {
  //    col.style.display = 'none';
  //    col.style.visibility = 'collapse';
  //  }
    recreateTables(); /* because IE draws lines all over the place with border-collapse */
  }
  
  //-->