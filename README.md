<p align="center"><img src="src/favicon.png" width=64 height=64 /></p>
<h1 align=center>Azure CIDR designer</h1>

source code of the CIDR desaigner, a visual subnet calculator for Azure virtual networks, available at https://cidr.duckiesfarm.com

I came across [David C A Croft](http://www.davidc.net/sites/default/subnets/subnets.html)'s subnets a while ago and really liked the approach. It's a visual subnet calculator, but the interesting part for me was how simple it is to edit a network. It allows to start with a CIDR, split it, move things around, and generate a deep link to share the resulting layout with someone else.

I ended up using the idea as a base for something more specific to Azure: Azure CIDR designer.

https://cidr.duckiesfarm.com/

![CIDR tool in action](/img/cidr.gif)

The main differences are all Azure-related:

- you can name subnets
- usable IP ranges take Azure's reserved addresses into account
- you can generate Bicep, ARM and Terraform
- you can export the result as CSV or Markdown table
- you can still generate a deep link to share the design

For example, you can start with:
```

10.0.0.0/16

```

and split it into something like:


```
frontend      10.0.0.0/24
backend       10.0.1.0/24
data          10.0.2.0/26
management    10.0.2.64/27

```

Then send the link to a colleague, paste the Markdown table into a README or ticket, export the CSV, or generate the Terraform/Bicep/ARM for the network.

It's a small tool, I mostly wanted something that makes the let's figure out the vnet address space part of an Azure project a little less annoying.


## Want run locally using python

The application is entirely static, all its source files are stored in the `src` directory, and no build step is required. To run it locally, open a terminal in the project directory, start a web server with `python -m http.server 8080 --directory src`, and visit [http://localhost:8080](http://localhost:8080).

```
git clone https://github.com/nicolgit/cidr-tool
cd cidr-tool
python -m http.server 8080 --directory src
```

## Want run locally in docker

With Docker installed, run `docker compose up` from the project directory, then open [http://localhost:8080](http://localhost:8080). The configuration in `docker-compose.yml` serves the files from `src` using Nginx. Stop the container with `Ctrl+C` and remove it with `docker compose down`.

```
git clone https://github.com/nicolgit/cidr-tool
cd cidr-tool
docker compose up
```

## Deploy to Azure Static Web Apps

Push the repository to GitHub, then create an **Azure Static Web App** from the Azure portal and select GitHub as the deployment source. Choose the repository and deployment branch, use **Custom** as the build preset, set the app location to `/src`, and leave the API and output locations empty because the application has no backend and requires no build step. Azure creates a GitHub Actions workflow automatically; verify that it uses `app_location: "/src"` and `skip_app_build: true`. Every push to the selected branch will then deploy the application automatically.
