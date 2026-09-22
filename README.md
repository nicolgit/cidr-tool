<p align="center"><img src="src/favicon.png" width=64 height=64 /></p>
<h1 align=center>Azure CIDR designer</h1>

unofficial visual subnet calculator for Azure virtual networks, available at https://cidr.duckiesfarm.com

Azure holds 5 IP addresses for every subnet. The first and last IP in each subnet is reserved for the network identification and for broadcast, respectively. Azure also holds 3 additional addresses for internal use starting from the first address in the subnet. In Azure subnets are created using classless internet domain routing (**CIDR**) blocks of the address space that was designed for the Virtual Network. As an example, the smallest range you can specify for a subnet is /29, which provides eight IP addresses.

This tool simplifies the job of segmenting an Azure virtual network into subnets by showing the addresses that can actually be used.

Based on the [work of David C A Croft](http://www.davidc.net/sites/default/subnets/subnets.html).

## Run locally using python

The application is entirely static, all its source files are stored in the `src` directory, and no build step is required. To run it locally, open a terminal in the project directory, start a web server with `python -m http.server 8080 --directory src`, and visit [http://localhost:8080](http://localhost:8080).

## Run locally in docker

With Docker installed, run `docker compose up` from the project directory, then open [http://localhost:8080](http://localhost:8080). The configuration in `docker-compose.yml` serves the files from `src` using Nginx. Stop the container with `Ctrl+C` and remove it with `docker compose down`.

## Deploy to Azure Static Web Apps

Push the repository to GitHub, then create an **Azure Static Web App** from the Azure portal and select GitHub as the deployment source. Choose the repository and deployment branch, use **Custom** as the build preset, set the app location to `/src`, and leave the API and output locations empty because the application has no backend and requires no build step. Azure creates a GitHub Actions workflow automatically; verify that it uses `app_location: "/src"` and `skip_app_build: true`. Every push to the selected branch will then deploy the application automatically.
