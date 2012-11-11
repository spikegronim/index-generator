#!/bin/bash

export SLIM=`bundle show slim`
cat index.html.slim | bundle exec ruby $SLIM/bin/slimrb > index.html
