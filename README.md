# SCOIR Code Challenge for Full Stack Engineers
This repo contains an exercise intended for Full Stack Software Engineers.

## Instructions
1. Click "Use this template" to create a copy of this repository in your personal github account.
1. Using technologies of your choice, complete [the assignment](./Assignment.md).
    * Implement a Front End UI for selecting dogs and a Back End API for saving a user's dog selections.
    * Our preference would be to see the Front End in [React](https://reactjs.org/) with the UI implemented using [MUI](https://mui.com/), and the Back End to be in [Go](https://go.dev).
1. Update this README with
    * a `How-To` section containing any instructions needed to run/access your system.
    * an `Assumptions` section containing documentation on any assumptions made while interpreting the requirements.
1. Send an email to Scoir (code_challenge@scoir.com) with a link to your newly created repo containing the completed exercise.

## Expectations
1. This exercise is meant to drive a conversation between you and Scoir's hiring team.  
1. Please invest only enough time needed to demonstrate your approach to problem solving and code design.  
1. Within reason, treat your solution as if it would become a production system.
1. If you have any questions, feel free to contact us at code_challenge@scoir.com

## How-To
Make sure port 3000 is clear and run `make install` followed by `make run`. Open [the app](http://localhost:3000/) in a browser of your choice.
Username: dogcatcher
Password: theyregooddogsbrent
I didn't build an explicit log out workflow, but lists persist on refresh and if you clear the JWT Token from localstorage and log back in.    

## Assumptions
1. The AKC doesn't add breeds frequently (and our underlying data set probably less often) so it is safe to pull and transform the list of dog breeds at startup.
2. Since there are multiple images of each dog available, adding a breed multiple times is permitted. One possible enhancement would be to check for duplicate images and request a new one.
3. User can request a specific Sub Breed or the overall Breed
4. All breed names are constructed `<SubBreed> <Breed>` ie English Setter and never the reverse

## Regrets/Improvements given more time
1. Login workflow should fail at the client if password or username are empty
2. Custom autocomplete dropdown where breeds can be listed by category (available in MUI already) but the category is also selectable (did not see this option if it exists)
3. Refactor API to commit to one style of request handler. Either commit to go-chi/render usage or only use render.JSON
4. Break out API into separate files/modules for the different resources/endpoints
5. Tests
