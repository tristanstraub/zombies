Feature: Using a pencil
  In order to paint a picture
  I should be able to use the pencil tool to draw a line.
 
  Scenario: select the pencil tool
    Given I am using Zombies
    When I select the pencil tool
    Then I should see that the pencil tool is selected

  Scenario: paint with the pencil tool
    Given I am using Zombies
    Then I select the pencil tool
    Then I hold the mouse button down at [10,10]
    Then I move the mouse to [50,50]
    Then I let go of the mouse at [50,50]
    Then I should see that a line has been drawn

  Scenario: hover over point with the pencil tool
    Given I am using Zombies
    Then I select the pencil tool
    Then I draw a line
    Then I move the cursor over the one end of the line
    




