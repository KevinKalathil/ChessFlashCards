<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h3 align="center">Chess FlashCards</h3>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#instructions">Instructions</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

![Product Name Screen Shot][product-animation]

The goal of this project is to use a flashcard system to help players become more capable of recognizing attacking opportunities within a game. More specifically, the application allows a player to step through different sets of 3-move plays all of which terminate with a piece being taken.

![Product Name Screen Shot][product-screenshot]
`In the image above, the knight takes the piece that was previously at position d4 in the final move of this set (highlighted in red - Nxd4).`

The flashcards are generated by processing real game data provided by the user. The user passes in a link to a completed lichess game (lichess is a platform to play online chess games - https://lichess.org/) and the backend portion of this app, scrapes the moves played in the game, generates the flashcards, and stores them in the database for the user to step through on the front-end web application. As depicted in the gif above, the moves in this set are displayed in a numbered list on the left side of the board. The update to the game's stateis shown by highlighting the previous and current location of the piece that is moved in the current step - in the example above, the blue square highlights the previous location of the knight, and the red square shows the current location.

### How Does it Work?

To generate the flashcards, the moves are first extracted from the game link passed as input. These moves are written in chess notation which is enough to get all the information we need, however, processing is required to identify more specific details about the piece that is moved.

Each move is classified as either castling, attacking, or advancing where castling is a special movement between the king and the rook, attacking would mean taking a piece, and advancing is moving a piece to another location (possible moves depend on the piece and surrounding pieces). Then, based on the type of move, we look for the pieces involved, we look for the pieces of that type that could possibly reach the location specified in the move.

e.g. Bxe5, This would be classified as an attack because of the 'x' in the move and the attacking piece is the Bishop because of the 'B'. Then I would look at the two bishops (for the side current playing a move, either 'white' or 'black'). After each move, the state of the game (location of all the pieces on the board) is stored in the database along with a set of three moves leading up to an attacking move.

### Built With

- [React](https://reactjs.org/)
- [Flask](https://flask.palletsprojects.com/en/2.0.x/)
- [Tailwind CSS](https://tailwindcss.com/)

<!-- GETTING STARTED -->

## Instructions

To get a local copy up and running follow these simple example steps.

1. Follow the procedure at the following website to configure the react project to be compatible with tailwindcss (https://tailwindcss.com/docs/guides/create-react-app)

2. Initialize a python venv, set the environment variable FLASK_APP=app and run the command `flask run`

3. Start the frontend application with npm start

## Next Steps

- Mark certain sets as being easy/medium/hard to help change the frequency in which easy sets may occur.
- Animation for the movement of the pieces at some point to help make it easier to track which piece has moved.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## Contact

Kevin Kalathil - kkalathi@uwaterloo.ca

Project Link: [https://github.com/KevinKalathil/ChessFlashCards](https://github.com/KevinKalathil/ChessFlashCards)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-animation]: images/Animation.gif
[product-screenshot]: images/Overview.png
[ambiguous-case]: images/FindingCandidate.png
