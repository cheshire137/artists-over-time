# Artists over Time

View which artists you listened to each week via your Last.fm
history.

![Screenshot](https://raw.githubusercontent.com/cheshire137/artists-over-time/master/screenshot.png)

## How to Develop

You will need Ruby, Rubygems, PostgreSQL, and npm installed.

```bash
bundle install
npm install
bin/rake db:create db:migrate
cp dotenv.sample .env
```

Create a [Last.fm app](http://www.last.fm/api/account/create) with
`http://localhost:3000/users/auth/lastfm/callback` as a callback
URL. Create a [Spotify app](https://developer.spotify.com/my-applications/)
with `http://localhost:3000/users/auth/spotify/callback` as a callback URL. Modify .env with your values.

```bash
bundle exec rails s
```

Visit [localhost:3000](http://localhost:3000).

To add a new JavaScript package: `npm install WHATEVER_PACKAGE --save`

## How to Test

```bash
npm test # to run the JavaScript style checker and JavaScript tests
bundle exec rspec # to run Rails tests
```

## How to Deploy to Heroku

Create an [Heroku app](https://dashboard.heroku.com/apps).
Create [another Last.fm app](https://www.last.fm/api/account/create)
with the callback URL `https://your-heroku-app.herokuapp.com/users/auth/lastfm/callback`.
Modify your Spotify app to include
`https://your-heroku-app.herokuapp.com/users/auth/spotify/callback` and
`http://your-heroku-app.herokuapp.com/users/auth/spotify/callback`
as callback URLs.

```bash
heroku git:remote -a your-heroku-app
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-nodejs.git
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-ruby.git
git push heroku master
heroku config:set LASTFM_API_KEY=value
heroku config:set LASTFM_API_SECRET=value
heroku config:set LASTFM_APP_HOST=https://your-heroku-app.herokuapp.com
heroku run rake db:migrate
heroku restart
heroku open
```
