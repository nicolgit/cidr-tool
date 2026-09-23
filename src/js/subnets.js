/* Flattening of the subnet tree and Azure-compliant subnet naming, shared by the template generators.
   Requires ipmath.js */

function collectSubnets(node, address, mask, out)
{
  if (node[2]) {
    collectSubnets(node[2][0], address, mask+1, out);
    collectSubnets(node[2][1], address+subnet_addresses(mask+1), mask+1, out);
  }
  else {
    out.push({
      prefix: inet_ntoa(address)+'/'+mask,
      name: (node[3] ? node[3] : '')
    });
  }
  return out;
}

function defaultSubnetName(prefix)
{
  return 'subnet-'+prefix.replace(/[.\/]/g, '-');
}

/* Azure allows letters, digits, '.', '-' and '_', and requires it to start with an alphanumeric and end with an alphanumeric or '_' */
function sanitizeSubnetName(name, prefix)
{
  var clean = name.trim().replace(/[^A-Za-z0-9._-]/g, '-').replace(/[^A-Za-z0-9_]+$/, '');

  if (clean === '') {
    return defaultSubnetName(prefix);
  }

  return /^[A-Za-z0-9]/.test(clean) ? clean : 'subnet-'+clean;
}

function resolveSubnetNames(subnets)
{
  var used = {};

  subnets.forEach(function (subnet) {
    var base = subnet.name ? sanitizeSubnetName(subnet.name, subnet.prefix) : defaultSubnetName(subnet.prefix);
    var name = base;
    var suffix = 2;

    while (used[name]) {
      name = base+'-'+suffix;
      suffix++;
    }
    used[name] = true;

    subnet.resolvedName = name;
  });

  return subnets;
}

function vnetNameFromPrefix(prefix)
{
  return 'vnet-'+prefix.replace(/[.\/]/g, '-');
}
