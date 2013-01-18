module TestHelper
  def canvasMouseDown(x, y)
    page.execute_script("testHelper.canvas.mouseDown(#{x},#{y});");
  end

  def canvasMouseMoveTo(x, y)
    page.execute_script("testHelper.canvas.mouseMoveTo(#{x},#{y});");
  end

  def canvasMouseUp(x, y)
    page.execute_script("testHelper.canvas.mouseUp(#{x},#{y});");
  end

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
