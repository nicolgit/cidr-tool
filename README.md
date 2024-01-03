<p align="center"><img src="favicon.png" width=64 height=64 /></p>
<h1 align=center>Azure CIDR designer</h1>

unofficial visual subnet calculator for Azure virtual networks, available at https://cidr.duckiesfarm.com

Azure holds 5 IP addresses for every subnet. The first and last IP in each subnet is reserved for the network identification and for broadcast, respectively. Azure also holds 3 additional addresses for internal use starting from the first address in the subnet. In Azure subnets are created using classless internet domain routing (**CIDR**) blocks of the address space that was designed for the Virtual Network. As an example, the smallest range you can specify for a subnet is /29, which provides eight IP addresses.

This tool simplifies the job of segmenting an Azure virtual network into subnets by showing the addresses that can actually be used.

Based on the [work of David C A Croft](http://www.davidc.net/sites/default/subnets/subnets.html).
