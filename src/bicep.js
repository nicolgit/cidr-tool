/* Page logic of bicep.html: reads the design from the query string and renders the template */

function bicepOnLoad()
{
  var output = document.getElementById('bicep');
  var state = parseState();

  if (state === null) {
    output.innerText = 'No network to generate: go back to the designer and use the "Generate bicep" button.';
    return;
  }

  document.getElementById('backLink').href = 'index.html'+location.search;
  output.innerText = generateBicep(state);
}

function copyBicep()
{
  navigator.clipboard.writeText(document.getElementById('bicep').innerText);
}

window.onload = bicepOnLoad;
