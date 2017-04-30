json.user do
  json.auth true
  json.email @user.email
  json.authenticityToken form_authenticity_token
  json.isFitbitAuthenticated @user.authenticated_with_fitbit?
end
