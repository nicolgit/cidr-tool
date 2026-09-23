/* Page logic of terraform.html: reads the design from the query string and renders the template */

function terraformOnLoad()
{
  var output = document.getElementById('terraform');
  var state = parseState();

  if (state === null) {
    output.innerText = 'No network to generate: go back to the designer and use the "Generate Terraform" button.';
    return;
  }

  document.getElementById('backLink').href = 'index.html'+location.search;
  output.innerText = generateTerraform(state);
}

function copyTerraform()
{
  navigator.clipboard.writeText(document.getElementById('terraform').innerText);
}

function downloadTerraform()
{
  var blobUrl = URL.createObjectURL(new Blob([document.getElementById('terraform').innerText], { type: 'text/plain' }));
  var link = document.createElement('A');

  link.href = blobUrl;
  link.download = 'vnet.tf';
  link.click();

  URL.revokeObjectURL(blobUrl);
}

window.onload = terraformOnLoad;
