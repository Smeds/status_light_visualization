#!/bin/bash
set -e

mydir="${0%/*}"

mkdir -p /tmp/build/kibana/status_light_visualization
cp -r $mydir/../public /tmp/build/kibana/status_light_visualization/
cp  $mydir/../index.js $mydir/../LICENSE /tmp/build/kibana/status_light_visualization/
cp  $mydir/../package.json /tmp/build/;

function build {
    cp  package.json kibana/status_light_visualization/;
    sed "s/kibana_version/${1}/" -i /tmp/build/kibana/status_light_visualization/package.json;
    zip status_light_visualization-$1.zip -r kibana
}

cd /tmp/build

build 6.0.1
build 6.1.0
build 6.1.1
build 6.1.2
build 6.1.3