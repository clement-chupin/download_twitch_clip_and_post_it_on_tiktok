#!/bin/bash


export DISPLAY=:0 #for puppeteer in ssh connection
while true
do

node ./src/maintain.js 0
sleep 30
node ./src/maintain.js 1
sleep 30
node ./src/maintain.js 2
sleep 30
rm --recursive -f video
sleep 30


for i in `seq 1 10`;
do

node ./src/main.js 0 &
sleep 900
ps -ef | grep node | grep -v grep | awk '{print $2}' | xargs kill &
ps -ef | grep chromium | grep -v grep | awk '{print $2}' | xargs kill &
sleep 60

node ./src/main.js 1 &
sleep 900
ps -ef | grep node | grep -v grep | awk '{print $2}' | xargs kill &
ps -ef | grep chromium | grep -v grep | awk '{print $2}' | xargs kill &
sleep 60

node ./src/main.js 2 &
sleep 900
ps -ef | grep node | grep -v grep | awk '{print $2}' | xargs kill &
ps -ef | grep chromium | grep -v grep | awk '{print $2}' | xargs kill &
sleep 60


done


done