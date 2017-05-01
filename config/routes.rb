Rails.application.routes.draw do
  devise_for :users,
    controllers: { omniauth_callbacks: 'users/omniauth_callbacks' },
    sessions: 'users/sessions'

  scope defaults: { format: :json }, path: '/api' do
    get '/user' => 'users#current', as: :current_user
    get '/lastfm/weekly-artists' => 'lastfm#weekly_artists', as: :lastfm_weekly_artists
    get '/lastfm/artist-tracks' => 'lastfm#artist_tracks', as: :lastfm_artist_tracks
  end

  delete '/users/disconnect-spotify' => 'users#disconnect_spotify', as: :disconnect_spotify

  root to: 'home#index'

  # Catch-all route so React can handle routing
  get '*path' => 'home#index'
end
