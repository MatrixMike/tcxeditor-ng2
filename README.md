# TCX Editor with Firebase backend

## Firebase

npm install firebase angularfire2 --save

{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}

{
  "rules": {
    ".read": true,
    ".write": "!data.exists()"
  }
}
prevent overwrite

## Types

npm install --save @types/google-maps

## Material Design

npm install @angular/material --save
