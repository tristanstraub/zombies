
Then "I select the pencil tool" do
  click_button('pencil-tool')
end

Then "I should see that the pencil tool is selected" do
  page.should have_css('button#pencil-tool.selected')
end

Then "I hold the mouse button down at [10,10]" do
  canvasMouseDown(10,10)
end

Then "I move the mouse to [50,50]" do
  canvasMouseMoveTo(50,50)
end

Then "I let go of the mouse at [50,50]" do
  canvasMouseUp(50,50)
end

Then "I click on the canvas" do
  canvasMouseMoveTo(50,50)
end

Then "I should see that a line has been drawn" do
  sleep 2
end
