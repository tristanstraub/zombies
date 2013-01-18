Given "I am using Zombies" do
#  @zombies_page.visit
    visit_zombies
end

When "I select the brush tool" do
  click_button('brush-tool')
end

Then "I should see that the brush tool is selected" do
  page.should have_css('button#brush-tool.selected')
end

Then "I click on the canvas" do
  find('.main-canvas').click()
#  sleep 2
end

