class LastfmController < ApplicationController
  def weekly_artists
    required_params = [params[:user], params[:from], params[:to]]
    unless required_params.all?(&:present?)
      return head :bad_request
    end

    api = LastfmApi.new
    artists = api.weekly_artists(params[:user], from: params[:from],
                                 to: params[:to])

    return head api.response_code unless artists

    render json: artists
  end
end
