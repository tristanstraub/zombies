module TestHelper
  def visit_zombies
    visit "http://localhost:3501"
  end
  
  def search_for_term(text)
#    fill_in('search_query', :with => text)
#    click_button('search-btn')
  end
  
  def verify_I_see(text)
#    page.should have_content(text)
  end
end

World(TestHelper)