#!/usr/bin/env bash
sudo su deploy
cd ~/onedot-challenge/
git pull
docker-compose down && docker-compose up --build -d
