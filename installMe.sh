#!/bin/bash
# TCX Editor with Firebase backend

## Angular Firebase 

npm install firebase angularfire2 --save

## Types

npm install --save @types/google-maps

## Material Design

npm install @angular/material --save
Not using any of the widgets that require hammer.js

## Deploying

```
ng build --prod --aot
firebase deploy

