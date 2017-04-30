class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def lastfm
    auth = request.env['omniauth.auth']
    raise auth.inspect
    user = User.where(email: auth.info.email).first_or_initialize
    user.foursquare_access_token = auth.credentials.token
    user.foursquare_uid = auth.uid

    if user.new_record?
      user.password = Devise.friendly_token[0, 20]
    end

    if user.save
      sign_in_and_redirect(user, event: :authentication)
    else
      flash[:error] = "Failed to sign up: #{user.errors.full_messages.join(', ')}"
      redirect_to root_path
    end
  end

  def failure
    redirect_to root_path
  end
end
