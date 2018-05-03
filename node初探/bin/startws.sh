#!/bin/sh
if [ ! -f "pid" ]
then 
  node ../13-daemon.js ../config.json &
  echo $! > pid
fi