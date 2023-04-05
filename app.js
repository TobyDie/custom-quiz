$(document).ready(function() {
  // Hide all questions except the first one
  $('.question:not(:first-of-type)').hide();

  // Handle radio button selection
  $('label').on('click', function() {
    // Deselect all labels in the same group
    $(this).siblings('label').removeClass('selected');
    // Select the clicked label
    $(this).addClass('selected');

    // Move to the next question
    var currentQuestion = $(this).parents('.question');
    var nextQuestion = currentQuestion.next('.question');
    currentQuestion.hide();
    nextQuestion.show();

    // Show submit button if last question has been answered
    if (nextQuestion.hasClass('form')) {
      $('#submit-btn').show();
    }
  });

  // Hide submit button initially
  $('#submit-btn').hide();

  // Handle form submission
  $('form').on('submit', function(e) {
    e.preventDefault();

    // Get user's answers
    var answers = [];
    $('.question').each(function() {
      var questionText = $(this).find('.question-text').text();
      var answerText = $(this).find('label.selected').text();
      answers.push({
        question: questionText,
        answer: answerText
      });
    });

    // Get user's name and email
    var name = $('#name').val();
    var email = $('#email').val();

    // Save user's answers, name, and email to cookie and local storage
    var quizData = {
      answers: answers,
      name: name,
      email: email
    };
    Cookies.set('quiz_data', JSON.stringify(quizData), { expires: 90, domain: '.hairqare.co' });
    localStorage.setItem('quiz_data', JSON.stringify(quizData));

    // Post user's answers, name, and email to webhook
    $.post('https://hook.us1.make.com/7ldadddexettepgl3ftl7beuu3i8cp4t', quizData)
      .done(function() {
        console.log('Data posted to webhook');
      })
      .fail(function() {
        console.log('Failed to post data to webhook');
      })
      .always(function() {
        // Redirect to thank you page
        window.location.href = 'https://checkout.hairqare.co/buy/hairqare-challenge-save-90/';
      });
  });

  // Add loading animation to submit button
  $('#submit-btn').on('click', function() {
    $(this).addClass('loading');
  });
});
