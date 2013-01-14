Feature: Using a brush
  In order to paint a picture from existing brush
  I should be able to use the brush tool to place a shape on the canvas.
 
  Scenario: select the brush tool
    Given I am using Zombies
    When I select the brush tool
    Then I should see that the brush tool is selected


