class UsersController < ApplicationController
  def current
    if user_signed_in?
      @user = current_user
      render template: 'users/show'
    else
      render json: {
        user: {
          auth: false,
          username: nil,
          authenticityToken: form_authenticity_token
        }
      }
    end
  end
end
