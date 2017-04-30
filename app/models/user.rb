class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :recoverable, :confirmable, :lockable, :registerable, :timeoutable
  devise :database_authenticatable, :rememberable, :trackable, :validatable

  devise :omniauthable, omniauth_providers: [:lastfm]

  alias_attribute :to_s, :email

  validates :email, presence: true, uniqueness: true

  scope :with_email, ->(email) { where(email: email) }
end
