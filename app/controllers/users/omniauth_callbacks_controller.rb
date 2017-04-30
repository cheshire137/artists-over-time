class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def lastfm
    auth = request.env['omniauth.auth']

    user = User.where(username: auth.credentials.name).first_or_initialize
    user.lastfm_access_token = auth.credentials.token
    user.lastfm_uid = auth.uid
    user.lastfm_url = auth.extra.raw_info.url

    if image = auth.extra.raw_info.image.detect { |img| img['size'] == 'large' }
      user.avatar_url = image['#text']
    end

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
