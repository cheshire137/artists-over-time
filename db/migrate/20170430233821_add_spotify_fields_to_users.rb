class AddSpotifyFieldsToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :spotify_access_token, :string
    add_column :users, :spotify_refresh_token, :string
    add_column :users, :email, :string
    add_column :users, :spotify_uid, :string
  end
end
