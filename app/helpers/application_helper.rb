module ApplicationHelper
  def page_title(path)
    case path
    when '/', '/user' then 'Home'
    end
  end
end
