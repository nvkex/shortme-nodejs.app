# short.me API

## Disclaimer
*short.me official API. Used to shorten URLs and get full URLs using slugs. The URLs have no expiry and no authentication is required.*
## Base URL
`https://nvkex-short-me.herokuapp.com/`

## Routes
### 1. Check connection
**Method** :  `GET`

**URL** : `https://nvkex-short-me.herokuapp.com/`

**Auth Required** : `false`

#### Response
```json
{
    "message" : "short.me - Shorten your URLs"
}
```
### 2. Shorten URL
**Method** :  `POST`

**URL** : `https://nvkex-short-me.herokuapp.com/url`

**Auth Required** : `false`

#### Body
```json
{
    "url" : "",
    "len" : 10
    "slug" : ""
}
```
Field Description:

| Key | Description | Optional | Type |
| ------------ | ------------ | ------------ | ------------ |
| `url` | Full URL to be shortened | No | String |
| `len` | Length of slug to be generated | Yes | Number |
| `slug` | Custom slug for your URL | Yes | String |


#### Response
```json
{
    "slug": "_55CWD",
    "url": "https://www.google.com"
}
```

### 2. Get full URL from slug
**Method** : `GET`

**URL** : `https://nvkex-short-me.herokuapp.com/:slug`

**Auth Required** : `false`

#### Response
```json
{
    "url": "https://www.google.com"
}
```

### Error Responses

Code : `400 Bad Request`

Content : Mongoose error is shown, with suggestions to fix the query.



