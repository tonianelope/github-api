
# Github App

This repo is a web app visualising some data from the gihub api v3.
[Check it out](https://a-github.herokuapp.com/)

The website shows 2 different sets of data in 2 access modes:

## The Contribution Map

![Map](https://github.com/tonianelope/github-api/blob/master/Screenshots/Screenshot-MAP.png)

The map graphs the location of the contributors and their contribution on a worldmap.
The circle size shows their contributions.
Hoevring over a circle displays details about the contributor such as login/location/contribution etc.

A repo can be chosen by either:

#### entering the repo path (username/reponame)

This will scrape all the data from the repository and save them in the database (if not already saved).
Then it will load the data ino the json and display it on the d3 map.

Entering an invalid repo will redirect to the home screen.

#### selecting a saved repo

Selecting a saved repo loads the data straight from the database into the json and displays it.

#### clicking the map tab

reploads the last displayed repo

## The Profile

This section can only be accessed by loging in via github.
The profile lists the repos the user contributed to, the owner and their visibility.

![Profile](https://github.com/tonianelope/github-api/blob/master/Screenshots/Screenshot-PROFILE1.png)

It also graphs the files in all the repos based on size (images and apks are excluded as they are usually way bigger than any other files). The bars are grouped based on repos and sorted by total repo size.
Hovering over the bar shows the file path, size and at the bottom the repo that it belongs to.

![Profile-Repos](https://github.com/tonianelope/github-api/blob/master/Screenshots/Screenshot-PROFILE2.png)
![Profile-Repo](https://github.com/tonianelope/github-api/blob/master/Screenshots/Screenshot-PROFILE5.png)

The user can logout with a button at the right top.

# Run it yourself

All you need is npm and node and a mongodb instance.
Register your own github app for the authentication and set the envirnment variables CLIENT\_ID, CLIENT_SECRET and MONGODB\_URI.

# Playground

Trying out the github api and different libraries for it

# Screenshots

The folder contains a few sample screenshots of what the app looks like.
