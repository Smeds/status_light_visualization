# Status Light for Kibana
A simple circle used to indicate status for a metric value, with three
possible levels low, intermediate and high. 

## Build and test plugin
Update docker-kibana.yml and kibana.yml to connect to a valid 
elasticsearch server, also make sure that you have a valid crt.

```
docker-compose -f docker/docker-kibana.yml up -d
docker exec -u 0 -it docker_kibana_1 bash
yum install zip -y
bash status_light_visualization/scipts/build_release.sh
```
The compressed plugins can be found at /tmp/build inside the docker container.

## Installation
Install local file
```
./bin/kibana-plugin install \
file:///path/status_light_visualization-6.0.1.zip
```

Install from github
```
./bin/kibana-plugin install \
https://github.com/Smeds/status_light_visualization/releases/download/<latest_version>/status_light_visualization-<kibana_version>.zip
```

## Screenshots

![screenshot](/images/status_light.png?raw=true)