<!-- GitHub build -->

![DEV](https://github.com/SAEONData/saeon-atlas/workflows/DEV/badge.svg)

# @SAEON/ATLAS
**_Please note that this is still in development._**

This is a tool for exploring SAEON's metadata catalogues interactively, and with specific emphasis of searching for datasets that contain OGC-compliant resources. This tool is currently deployed at [atlas.saeon.ac.za](https://atlas.saeon.ac.za), but the intention is that bespoke deployments are supported that allow for configuring any number of catalogues to be searched.

The repository is organized as a 'monorepo', split according to the following packages:

- [@saeon/atlas-client](/src/@saeon/atlas-client)
- [@saeon/atlas-api](/src/@saeon/atlas-api)
- [@saeon/anyproxy](/src/@saeon/anyproxy)
- [@saeon/catalogue-search](/src/@saeon/catalogue-search)
- [@saeon/ol-react](/src/@saeon/ol-react)
- [@saeon/snap-menus](/src/@saeon/snap-menus)
- [@saeon/logger](/src/@saeon/logger)
- [docs](/src/docs)
- [reporting](/src/reporting)

Refer to these links for specific package documentation.

# Tech Stack

- API
  - Node.js server
  - Proxy server ([anyproxy](http://anyproxy.io/))
- Browser client
  - [React.js](https://reactjs.org/)
  - [OpenLayers 6](https://openlayers.org/)
  - [Material UI](https://material-ui.com/)

# Quick start

Packages are mostly self-contained, in that each package includes a `package.json` file, and tracks it's own dependencies. For development purposes it's useful that packages can reference source code in other packages (instead of build output), and for this reason Babel is configured globally.

### Setup the repository for development

NOTE: This repository only support Linux/Mac development currently, since it's farily straightforward to configure a Linux development environment using WSL on Windows (or similar). If there is interest in further cross platform support please [request this](https://github.com/SAEONData/saeon-atlas/issues).

```sh
# Download the source code
git clone git@github.com:SAEONData/saeon-atlas.git saeon-atlas
cd saeon-atlas

# Install top level dependencies (Babel, tooling, etc)
npm install

# Install package dependencies (this might take several minutes on the first run)
npm run install-package-dependencies

# Update repository git configuration
npm run configure-git

# Sometimes the scripts in scripts/ don't get the correct permissions set on clone,
# and when they are adjusted. This could be related to using WSL. Fix this
chmod +x scripts/*.sh
```

### Start the services

Make sure there is an accessible instance of MongoDB (or run using Docker)
```sh
docker run --name mongodb -e MONGO_INITDB_ROOT_USERNAME=atlas -e MONGO_INITDB_ROOT_PASSWORD=password -d -p 27017:27017 mongo:latest
```

From the root of the repository:

```sh
npm start
```

Running the atlas requires starting 3 services:

- src/@saeon/atlas-client
- src/@saeon/atlas-api
- src/@saeon/anyproxy

Running `npm start` will start these services in the same terminal window. It's useful to start these services individually for helpful log output (a terminal that allows for split screen is great for this).

To start these services indivudually

```
cd src/@saeon/atlas-client
npm start

cd src/@saeon/atlas-api
npm start

cd src/@saeon/anyproxy
npm start
```

# Deployment

All services in this repository are dockerized - see `Dockerfiles` located in the route of each package. Refer to the repository's [`docker-compose.yml`](/docker-compose.yml) file to see how to deploy all services together. By default, this repository supports continuous deployment (CD) using a self hosted GitHub actions-runner. This is easy to setup - once you have forked the repository follow the instrunctions provided by GitHub to install a self hosted actions runner on a Linux server (if Windows Server deployments are required please [request this](https://github.com/SAEONData/saeon-atlas/issues)). I.e. the process should be as simple as just 2 steps to get a deployment on every push to master:

1. Configure a self hosted GitHub actions runner on your server
2. Adjust the `.github/workflows/deploy-master.yml` to include configuration variables sensible for your environment (refer to the section on "Configuration" below)

NOTE - Docker images are built in the context of this repository, so the Dockerfiles for individual services are NOT the root context in which Docker is executed. This can be a bit confusing, the reason being to allow for commands running in docker containers to have access to the global babel configuration. For this reason, when building images with the `docker build` CLI, this command must be run from the root of this repository, with the path to the Dockerfile provided explicitly by the `--file , -f` options. For example:

```
docker build -t <image name> -f ./src/@saeon/<service name>/Dockerfile .
```

#### Configuration

Build-time configuration essentially involves:

1. Creating `.env` files with appropriate values at the beginning of the build process (overwriting existing .env files)
2. Copying these `.env` files along with source code into the Docker build context, so that they are accessible during container runtime

This is achieved using GitHub actions software. The configuration is specified in the [workflow file](/.github/workflows/deploy-master.yml). Adjusting accordingly in repository forks and continuous deployment should (theoreticaly) work out the box if a self-hosted actions runner is configured on your server.

#### Docker Compose

To deploy this repository manually

```sh
# Clone the repo
git clone <...> saeon-atlas-fork

# Add configuration for docker-compose.yml scripts
echo "MONGO_USERNAME=<user>" > .env
echo "MONGO_PASSWORD=<pswd>" >> .env

# Build and run the images
docker-compose up -d --force-recreate --build
```

# NPM packages

During development packages are referenced directly via the source code entry point. During deployment packages are consumed from the NPM registry. This means that when making changes to dependency packages, these packages need to be re-published. This is straightforward; from the route of a package that supports publishing to NPM, these scripts are available:

- `npm run publish:patch`
- `npm run publish:minor`
- `npm run publish:major`

It's also possible to publish all packages at once; from the root of this repository, these scripts are available:

- `npm run publish-all-packages:patch`
- `npm run publish-all-packages:minor`
- `npm run publish-all-packages:major`

Running one of these scripts will result in all other packages updating their dependency lists to use the newly published package versions. **However**. If you published a package individually, then you will need to update the dependency version where the package is used. This can either be done manually via updating the appropriate `package.json` file, or all at once:

- `npm run update-packages`

It's also useful to see which packages will be updated by this script. To do that, run:

- `npm run check-package-updates`
