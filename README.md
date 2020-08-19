<!-- GitHub build -->

![DEV](https://github.com/SAEONData/catalogue/workflows/DEV/badge.svg)

TODO

- There should be a single .browserslistrc defined in the source code. Also the browser list should be built at build time

# @SAEON/CATALOGUE

**_Please note that this is still in development._**

This is a tool for exploring SAEON's metadata catalogues interactively, and with specific emphasis of searching for datasets that contain OGC-compliant resources. This tool is currently deployed at [catalogue.saeon.ac.za](https://catalogue.saeon.ac.za), but the intention is that bespoke deployments are supported that allow for configuring any number of catalogues to be searched.

# Browser support

- chrome: 80
- edge: 18
- firefox: 74
- ios: 12.2
- safari: 13
- samsung: 11.1

# Tech Stack

- API
  - Node.js server
  - Proxy server ([anyproxy](http://anyproxy.io/))
- Browser client
  - [React.js](https://reactjs.org/)
  - [OpenLayers 6](https://openlayers.org/)
  - [Material UI](https://material-ui.com/)

# Deployment
Automated deployment is supported targeting a CentOS 7 environment

1. Fork the repository, and clone to your local machine
2. Follow the [instructions](/platform-configuration/ansible/README.md) to install and configure Ansible on your local machine, and setup a CentOS 7 server with a user and SSH login without a password
3. Run the command: `npm run configure-centos-7-server`
4. Setup a Github self-hosted actions runner
5. Push to your forked repository to trigger a deployment

# Quick start

Packages are mostly self-contained, in that each package includes a `package.json` file, and tracks it's own dependencies. For development purposes it's useful that packages can reference source code in other packages (instead of build output), and for this reason Babel is configured globally.

### Setup the repository for development

NOTE: This repository currently only supports Linux/Mac development, since it's farily straightforward to configure a Linux development environment using WSL on Windows (or similar). If there is interest in further cross platform support please [request this](https://github.com/SAEONData/catalogue/issues).

```sh
# Download the source code
git clone git@github.com:SAEONData/catalogue.git catalogue
cd catalogue

# Sometimes the scripts in scripts/ don't get the correct permissions set on clone,
# and when they are adjusted. This could be related to using WSL. Fix this
chmod +x scripts/*.sh

# Make sure that Node.js ^14 is installed. Follow the instructions at https://github.com/nodesource/distributions/blob/master/README.md#debinstall
# Assuming an Ubuntu Linux environment
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install gcc g++ make # Required for building node-sass and other modules with native bindings
sudo apt-get install -y nodejs

# Install package dependencies (this might take several minutes on the first run)
npm run install-package-dependencies

# Update repository git configuration
npm run configure-git

# Build all the projects (some services in development mode reference the builds)
npm run build-all-packages

# A global install of npm-check-updates is required to use some of the package.json scripts
sudo npm install -g npm-check-updates
```

### Start the services
The catalogue software comprises three services, and is dependant on additional 3rd party services (MongoDB, Elasticsearch). These services all need to be started. 3rd party software can be containerized for development purposes (shown below).

#### [@saeon/catalogue](/src/services/client)
```sh
npm run start:client
```

#### [@saeon/api](/src/services/api)
```sh
npm run start:api
```

#### [@saeon/proxy](/src/services/proxy)
```sh
npm run start:proxy
```

#### MongoDB
```sh
docker run --name mongo --restart always -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password -d -p 27017:27017 mongo:latest
```

#### Elasticsearch
```sh
# Setup a network so that ELK services can communicate with each other
docker network create --driver bridge elk

# Elasticsearch
docker run --net=elk --name elasticsearch --restart always -e xpack.security.enabled=false -e discovery.type=single-node -d -p 9200:9200 -p 9300:9300 docker.elastic.co/elasticsearch/elasticsearch:7.8.1

# Kibana
docker run --net=elk --name kibana --restart always -e ELASTICSEARCH_HOSTS=http://elasticsearch:9200 -d -p 5601:5601 docker.elastic.co/kibana/kibana:7.8.1
```

# Deployment
Deploy the services in the `src/services` directory as docker containers:

```sh
docker build -t <image name> -f ./src/services/<service name>/Dockerfile .
docker run <image name>
```

Use the [`docker-compose.yml`](/docker-compose.yml) file to deploy all services, along with 3rd party services. Not that compared to the `docker` CLI commands above, 3rd party services are configured slightly differently in the `docker-compose` deployment. Use the `docker-compose.yml` file to deploy the catalogue software.

This repository supports continuous deployment (CD) using a self hosted GitHub actions-runner. This is easy to setup - once you have forked the repository follow the instructions provided by GitHub to install a self hosted actions runner on a Linux server (if Windows Server deployments are required please [request this](https://github.com/SAEONData/catalogue/issues)). 

Deploying the catalogue software should be as simple as just 2 steps to get a deployment on every push to master:

1. Configure a self hosted GitHub actions runner on your server
2. Adjust the `.github/workflows/next.yml` and `.github/workflows/stable.yml` files to include configuration variables sensible for your environment (refer to the section on "Configuration" below)

_NOTE - Docker images are built in the context of this repository, so the Dockerfiles for individual services are NOT the root context in which Docker is executed. This can be a bit confusing, the reason being to allow for commands running in docker containers to have access to the global babel configuration. For this reason, when building images with the `docker build` CLI, this command must be run from the root of this repository, with the path to the Dockerfile provided explicitly by the `--file , -f` options._


#### Configuration

Build-time configuration essentially involves:

1. Creating `.env` files with appropriate values at the beginning of the build process (overwriting existing .env files)
2. Copying these `.env` files along with source code into the Docker build context, so that they are accessible during container runtime

This is achieved using GitHub actions software. The configuration is specified in the [workflow file](/.github/workflows/deploy-master.yml). Adjusting accordingly in repository forks and continuous deployment should (theoretically) work out the box if a self-hosted actions runner is configured on your server.

#### Docker Compose

To deploy this repository manually

```sh
# Clone the repo
git clone <...> catalogue-fork

# Add configuration for docker-compose.yml scripts
echo "MONGO_USERNAME=<user>" > .env
echo "MONGO_PASSWORD=<pswd>" >> .env

# Build and run the images
docker-compose up -d --force-recreate --build
```

# NPM packages
This project includes some bespoke NPM package development:

- [@saeon/ol-react](/src/packages/ol-react)
- [@saeon/snap-menus](/src/packages/snap-menus)
- [@saeon/logger](/src/packages/logger)

To publish packages to the public NPM registry (where all the @saeon packages are published) you need to [create an NPM account](https://docs.npmjs.com/creating-a-new-npm-user-account). This allows you to publish the packages - you will also need to make sure that you are part of the @saeon organization. To publish these packages under new names you will need to fork the repository, and then update the `name` fields in all the `package.json` files.

Once you have an account you should be able to login via the CLI:

```sh
npm login
```

### Publishing packages

#### Code generators
The repository includes an [NPM package generator](/src/generators/npm-package) to automate setting NPM package projects. From the root of the repository:

```sh
npm run generate-npm-package
```

#### Deploying packages to NPM

During development packages are referenced directly via the source code entry point. During deployment packages are consumed from the NPM registry. This means that when making changes to dependency packages, these packages need to be re-published. This is straightforward; from the root of a package that supports publishing to NPM, these scripts are available:

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

# TODO
- [docs](/src/services/docs)
- [reporting](/src/services/reporting)