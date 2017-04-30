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
URL. Modify .env with your values.

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
