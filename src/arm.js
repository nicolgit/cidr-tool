/* Page logic of arm.html: reads the design from the query string and renders the template */

function armOnLoad()
{
  var output = document.getElementById('arm');
  var state = parseState();

  if (state === null) {
    output.innerText = 'No network to generate: go back to the designer and use the "Generate ARM template" button.';
    return;
  }

  document.getElementById('backLink').href = 'index.html'+location.search;
  output.innerText = generateArm(state);
}

function copyArm()
{
  navigator.clipboard.writeText(document.getElementById('arm').innerText);
}

function downloadArm()
{
  var blobUrl = URL.createObjectURL(new Blob([document.getElementById('arm').innerText], { type: 'application/json' }));
  var link = document.createElement('A');

  link.href = blobUrl;
  link.download = 'vnet.json';
  link.click();

  URL.revokeObjectURL(blobUrl);
}

window.onload = armOnLoad;
