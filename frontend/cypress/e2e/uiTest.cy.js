/* eslint-disable */
/// <reference types="cypress" />

describe('user happy path', () => {
  it('should register, create and edit the game, start and stop a session, log out then log back in again', () => {
    // at the login page
    cy.visit('localhost:3000/login');
    cy.url().should('include', 'login');
    cy.contains('Don’t have an account?').click();

    // Registers a new user
    cy.get('input[id="name"]').focus().type('Michael');
    cy.get('input[id="email"]').focus().type('testEmail2@gmail.com');
    cy.get('input[id="password"]').focus().type('blah');
    cy.get('input[id="confirmPassword"]').focus().type('blah');
    cy.contains('Register').click();
    
    // Ensure redirected to the dashboard
    cy.url().should('include', 'localhost:3000/dashboard');

    // Create a new Game
    cy.contains('Create New Game').click();
    cy.get('input[id="gameTitle"]').focus().type("test game");

    cy.get('textarea[id="question1"]').focus().type("What is the largest country by land size?");
    cy.get('textarea[id="answer1"]').focus().type("Russia");

    cy.get('input[id="duration1"]').focus().type(10);
    cy.get('input[id="points1"]').focus().type(3);
    cy.get('button[id="submitGameForm"]').click();

    // Edit the Game
    cy.contains('Game Details').click();
    cy.get('button[id="editGame"]').click();
    cy.get('input[id="newTitle"]').focus().type('Game blah');

    cy.contains('Save Changes').click();
    cy.contains('Back to Dashboard').click();

    // Start and end game Session
    cy.contains('Start Game').click();
    cy.contains('Close').click();
    cy.contains('End Game').click();
    cy.contains('Yes').click();

    cy.contains('Return to Dashboard').click();
    cy.contains('Yes, Return').click();

    // Log Out and then log back in again
    cy.contains('Log out').click();
    cy.get('input[id="email"]').focus().type('testEmail2@gmail.com');
    cy.get('input[id="password"]').focus().type('blah');
    cy.contains('Log in').click();

  });
});

describe('alternative path', () => {
  /*
    1. User Logs in 
    2. creates a game 
    3. Have one question of each type (since that wasnt required in the happy path)
    4. delete one question
    5. Edit another question by adding an extra option
    6. Add a URL
    7. Add an Empty Game and delete it
  */

  it('Creates a quiz with questions of different types, deletes one and chages the type of one', () => {
    // at the login page
    cy.visit('localhost:3000/login');
    cy.url().should('include', 'login');
    cy.contains('Don’t have an account?').click();
  
    // Registers a new user
    cy.get('input[id="name"]').focus().type('Bob');
    cy.get('input[id="email"]').focus().type('bob@gmail.com');
    cy.get('input[id="password"]').focus().type('blah');
    cy.get('input[id="confirmPassword"]').focus().type('blah');
    cy.contains('Register').click();
    cy.contains('Log in').click()
  
    // redirected to the dashboard
    cy.url().should('include', 'localhost:3000/dashboard');
  
    // Create a new Game
    cy.contains('Create New Game').click();
    cy.get('input[id="gameTitle"]').focus().type("test game");
    
    // Judgement Style Question
    cy.get('textarea[id="question1"]').focus().type("What is the largest country by land size?");
    cy.get('textarea[id="answer1"]').focus().type("Russia");
  
    cy.get('input[id="duration1"]').focus().type(10);
    cy.get('input[id="points1"]').focus().type(3);
  
    cy.get('button[id="addQuestion"]').click();

    // Singe Choice Style Question
    cy.get('label[for="sc1"]').click();
    cy.get('textarea[id="question2"]').focus().type("How many letters in cat");

    cy.get('button[id="addOptions2"]').click();
    cy.get('input[id="Option-q2-1"]').focus().type('1');
    cy.get('input[id="Option-q2-2"]').focus().type('2');
    cy.get('input[id="Option-q2-3"]').focus().type('3');
    
    cy.get('input[type="text"]').each(($el) => {
      cy.wrap($el).invoke('val').then((val) => {
        if (val === '3') {
          cy.wrap($el)
            .closest('div.flex.items-center')
            .find('input[type="radio"]')
            .first()
            .click({ force: true });
        }
      });
    });

    cy.get('input[id="duration2"]').focus().type(10);
    cy.get('input[id="points2"]').focus().type(3);

    cy.get('button[id="addQuestion"]').click();

    // Multiple Choice Style Question
    cy.get('label[for="mc2"]').click();

    cy.get('textarea[id="question3"]').focus().type("Which of these are palindromes");
    cy.get('button[id="addOptions3"]').click();
    cy.get('input[id="Option-q3-1"]').focus().type('madam');
    cy.get('input[id="Option-q3-2"]').focus().type('dad');
    cy.get('input[id="Option-q3-3"]').focus().type('cat');

    // select the correct options
    cy.get('input[type="text"]').each(($el) => {
      cy.wrap($el).invoke('val').then((val) => {
        if (val === 'madam') {
          cy.wrap($el)
            .closest('div.flex.items-center')
            .find('input[type="checkbox"]')
            .first()
            .click({ force: true });
        }
        if (val === 'dad') {
          cy.wrap($el)
            .closest('div.flex.items-center')
            .find('input[type="checkbox"]')
            .first()
            .click({ force: true });
        }
      });
    });

    cy.get('input[id="duration3"]').focus().type(10);
    cy.get('input[id="points3"]').focus().type(3);
    cy.get('button[id="submitGameForm"]').click();

    // Delete question 3
    cy.get('button[id="details1"]').click();
    cy.get('p[id="edit3"]').click();
    cy.get('button[id="deleteQuestion"]').click();

    // Change question type of question 2
    cy.get('p[id="edit2"]').click();
    cy.get('label[for="jmt"]').click();
    cy.get('input[id="answer"]').focus().type('3');

    cy.get('button[id="addYouTube"]').click();
    cy.get('input[id="UrlInput"]').should('exist'); // ensure it's rendered

    cy.get('input[id="UrlInput"]').type('https://www.youtube.com/watch?v=DfljaUwZsOk');
    cy.get('button[id="saveChanges"]').click();
    cy.get('button[id="toDashboard"]').click();
  });

  it('creaes an empty game and deletes it', () => {
    cy.visit('localhost:3000/login');
    cy.url().should('include', 'login');

    cy.get('input[id="email"]').focus().type('bob@gmail.com');
    cy.get('input[id="password"]').focus().type('blah');
    cy.contains('Log in').click()

    cy.url().should('include', 'localhost:3000/dashboard');
  
    // Create a new Game
    cy.contains('Create New Game').click();
    cy.get('input[id="gameTitle"]').focus().type("Game To Delete");
    cy.get('textarea[id="question1"]').focus().type("blah");
    cy.get('textarea[id="answer1"]').focus().type("blah");
  
    cy.get('input[id="duration1"]').focus().type(10);
    cy.get('input[id="points1"]').focus().type(3);
    cy.get('button[id="submitGameForm"]').click();

    // Deletes The Game
    cy.get('button[id="details1"]').click();
    cy.get('button[id="deleteQuiz"]').click();
  })
});