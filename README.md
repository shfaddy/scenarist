# What Is This?

Hello World! This is Scenarist!

## What's Scenarist?

Scenarist is a Vanilla JavaScript library for developing apps as Recursive Functions

## What Is the Benefit of Developing Apps as Recursive Functions?

When an app is developed as a recursive function, this function acts as a language for the app.
Following this concept, the only accessibility barrier to an app is the knowledge of its language;
making it possible for people and systems with different capabilities to build and share their own ways for using it.

# How Can Apps Be Developed Using Scenarist?

## Install Scenarist

Assuming that `npm` command is already installed;
the following command can be run to install Scenarist wherever it's desired to be used:

```sh
npm i @shfaddy/scenarist
```

## Import Scenarist

Scenarist class is exported as the default of the installed ECMAScript Module;
and can be imported as following:

```js
import Scenarist from '@shfaddy/scenarist';
```

## Write App Scenario

Scenario is the way of describing and developing the logic and language of a Scenarist App.
It can be a JavaScript object of any class.

```js
const scenario = new class {

// Scenario code will be written here shortly

};
```

### Scenario Accessible Locations

A property in a scenario is considered as an accessible location if its key starts with `$`.
Then, this location can be accessed by

```js
const scenario = new class {

$anAccessibleLocation = "Welcome to this accessible location";

$anotherAccessibleLocation () {

return "Welcome to this other accessible location; but this location is a function so it'll do more shortly!";

};

$anAccessibleRecursiveLocation = new class {

$anAccessibleLocation = "Welcome to this accessible location";

$anotherAccessibleLocation () {

return "Welcome to this other accessible location; but this location is a function so it'll do more shortly!";

};

};

};
```

#### P

### Scenario Restricted Locations

A property in a scenario is considered as a restricted location if it starts with `$_`.

```js
const scenario = new class {

$_aRestrictedLocation = "Welcome to this restricted location! how did you get here?";

$_anotherRestrictedLocation () {

return "Welcome to this other restricted location; but this location is a function so it'll do more shortly! How did you get here?";

};

$anotherRestricte

};
```

A direction is the argument when passed to the app function,
Scenarist will be directed to play the action in that location.

Accessible locations are played via `string` directions.

```js
console .log ( await app ( 'anAccessibleLocation' ) );

// Outputs:
// Welcome to this accessible location
```

Restricted locations are played via `symbol` directions.
