/* IPv4 address helpers shared by the designer and the bicep generator */

function inet_ntoa(addrint)
{
  return ((addrint >> 24) & 0xff)+'.'+
    ((addrint >> 16) & 0xff)+'.'+
    ((addrint >> 8) & 0xff)+'.'+
    (addrint & 0xff);
}

function inet_aton(addrstr)
{
  var re = /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/;
  var res = re.exec(addrstr);

  if (res === null) {
    return null;
  }

  for (var i=1; i<=4; i++) {
    if (res[i] < 0 || res[i] > 255) {
      return null;
    }
  }

  return (res[1] << 24) | (res[2] << 16) | (res[3] << 8) | res[4];
}

function network_address(ip, mask)
{
  for (var i=31-mask; i>=0; i--) {
    ip &= ~ 1<<i;
  }
  return ip;
}

function subnet_addresses(mask)
{
  return 2**(32-mask);
}

function subnet_last_address(subnet, mask)
{
  return subnet + subnet_addresses(mask) - 1;
}

function subnet_netmask(mask)
{
  return network_address(0xffffffff, mask);
}
