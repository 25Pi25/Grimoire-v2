# CSH Grimoire v2

<img src="https://release.botc.app/resources/community/ccc-parchment.png" alt="Declaration of community-created content" width="200"/>

![A picture of the Grimoire. A game of Trouble Brewing is set up, and several side menus are open.](docs/Grimoire-general.png)

A digital implementation of the Grimoire, a tool used by Storytellers running the game [Blood on the Clocktower](https://bloodontheclocktower.com). 

You can find it online at [https://grimoire.cs.house](https://grimoire.cs.house).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Features

Many of the features are based around the official clocktower app, including
- Background images
- Character assets
- Scripts

But the app contains several improvements to allow users to run a game of clocktower with actual players in real time, including:

#### Arbitrary token and reminder placement
![Tokens are grouped randomly, to represent players on couches](docs/BMR_arbitrary_placement.png)

#### Night action cards to display to players
![The info box. A selection of cards are visible](docs/Infobox_cards.png)
![An example info card, showing a player being marked as "mad"](docs/Card_ceremadness.png)

#### A "town square" mode to show publicly during the day
![Town square mode. Fabled and Loric are present, but all players are represented as either alive or dead](docs/Townsquare.png)

#### A bag mechanic to let characters be "chosen" by players
![The bag screen. Some tokens have been taken](docs/Bag_general.png)
![The result of choosing from the bag, showing the player as getting the Barber.](docs/Bag_chosenRole.png)

#### Custom script support, including...!
![Please don't sue us TPI](docs/Unreleased.png)

## Running as dev

In the project directory, you can run:

```
npm ci
npm start
```

To run the app in development mode. 
The webpage should open automatically. If it doesn't, go to [http://localhost:3000](http://localhost:3000) to view it in your browser.

The dev build will automatically refresh as changes are made.

## Deloying

A dockerfile is available for deployment. To build a deployment image, run:

```
docker build -t grimoire --target prod .
docker run -p 8080:8080 grimoire
```

Consult the docker file for more information. At deployment time, the grimoire will make a best-effort attempt to pull fresh assets from The Pandemonium Institute's [official repository](https://github.com/ThePandemoniumInstitute/botc-release) of character images. However, changes will not automatically be live. 

The project can then be viewed at [localhost](http://localhost:8080), port 8080. 
