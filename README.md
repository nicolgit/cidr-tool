<p align="center"><img src="src/favicon.png" width=64 height=64 /></p>
<h1 align=center>Azure CIDR Designer</h1>

> **TL;DR:** This repository contains the source code for Azure CIDR Designer, a visual subnet calculator for Azure virtual networks. Try it at [cidr.duckiesfarm.com](https://cidr.duckiesfarm.com).

I came across [David C. A. Croft's subnet calculator](http://www.davidc.net/sites/default/subnets/subnets.html) a while ago and really liked its approach. It is a visual subnet calculator, but what interested me most was how easy it made editing a network: you can start with a CIDR block, split it, move subnets around, and generate a deep link to share the resulting layout.

I used that idea as the basis for something more specific to Azure: Azure CIDR Designer.

[https://cidr.duckiesfarm.com](https://cidr.duckiesfarm.com)

![CIDR tool in action](/img/cidr.gif)

Its main features are tailored to Azure:

- Name subnets.
- Calculate usable IP ranges while accounting for Azure's reserved addresses.
- Generate Bicep, ARM, and Terraform templates.
- Export the design as a CSV file or Markdown table.
- Generate a deep link to share the design.

For example, you can start with:

```text
10.0.0.0/16
```

and split it into a layout like this:

```text
frontend      10.0.0.0/24
backend       10.0.1.0/24
data          10.0.2.0/26
management    10.0.2.64/27
```

You can then send the link to a colleague, paste the Markdown table into a README or ticket, export the design as a CSV file, or generate a Terraform, Bicep, or ARM template for the network.

It is a small tool designed to make the "_let's figure out the virtual network address space_" part of an Azure project a little less tedious.

## Run locally with Python

The application is entirely static. All source files are stored in the `src` directory, and no build step is required. To run it locally, open a terminal in the project directory, start a web server with `python -m http.server 8080 --directory src`, and visit [http://localhost:8080](http://localhost:8080).

```console
git clone https://github.com/nicolgit/cidr-tool
cd cidr-tool
python -m http.server 8080 --directory src
```

## Run locally with Docker

With Docker installed, run `docker compose up` from the project directory, then open [http://localhost:8080](http://localhost:8080). The configuration in `docker-compose.yml` serves the files from `src` through Nginx. Press `Ctrl+C` to stop the container, then remove it with `docker compose down`.

```console
git clone https://github.com/nicolgit/cidr-tool
cd cidr-tool
docker compose up
```

## Deploy to Azure Static Web Apps

Push the repository to GitHub, then create an **Azure Static Web App** in the Azure portal and select GitHub as the deployment source. Choose the repository and deployment branch, select **Custom** as the build preset, set the app location to `/src`, and leave the API and output locations empty because the application has no backend and requires no build step.

Azure automatically creates a GitHub Actions workflow. Verify that it contains `app_location: "/src"` and `skip_app_build: true`. Every push to the selected branch will then deploy the application.
