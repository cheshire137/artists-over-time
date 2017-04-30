class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :recoverable, :confirmable, :lockable, :registerable, :timeoutable
  devise :database_authenticatable, :trackable, :validatable, :rememberable,
    authentication_keys: [:username]

  devise :omniauthable, omniauth_providers: [:lastfm]

  alias_attribute :to_s, :username

  validates :username, presence: true, uniqueness: true

  scope :with_username, ->(username) { where(username: username) }

  def email_required?
    false
  end

  def email_changed?
    false
  end
end
