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
      $('.submit-btn').show();
    }
  });

  // Handle form submission
  $('form').on('submit', function(e) {
    e.preventDefault();

    // Get user's answers
    var answers = {};
    $('.question').each(function() {
      var questionId = $(this).data('question-id');
      var answerText = $(this).find('input[type="radio"]:checked').siblings('label').text();
      answers[questionId] = answerText.trim();
    });

    // Get user's name and email
    var name = $('#name').val();
    var email = $('#email').val();

    // Save user's answers, name, and email to cookie with 90 day expiry
    var data = {
      answers: answers,
      name: name,
      email: email
    };
    $.cookie("quiz_data", JSON.stringify(data), { expires: 90, path: "/", domain: ".hairqare.co" });

    // Post user's answers, name, and email to webhook
    $.ajax({
      url: 'https://hook.us1.make.com/7ldadddexettepgl3ftl7beuu3i8cp4t',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function() {
        // Redirect to thank you page
        window.location.href = 'https://checkout.hairqare.co/buy/hairqare-challenge-save-90/';
      },
      error: function() {
        // Redirect to thank you page
        window.location.href = 'https://checkout.hairqare.co/buy/hairqare-challenge-save-90/';
      }
    });
  });
});
