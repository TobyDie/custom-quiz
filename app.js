//v7
$(document).ready(function() {
  // Helper function to get the value of a cookie
  function getCookieValue(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookies = decodedCookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return "";
  }

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
      var answerId = $(this).find('input[type="radio"]:checked').attr('value');
      answers[questionId] = answerId;
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
    document.cookie = "quiz_data=" + JSON.stringify(data) + ";max-age=7776000;path=/;domain=.hairqare.co";

    // Track a 'Completed Quiz' event
    cvgTrack({
      eventName: "Completed Quiz",
      properties: {
        answers: answers,
        name: name,
        email: email
      },
    });

    // Start loading animation
    $('.submit-btn').addClass('loading');

    // Post user's answers, name, and email to webhook
    $.ajax({
      url: 'https://hook.us1.make.com/7ldadddexettepgl3ftl7beuu3i8cp4t',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function() {
        // Stop loading animation and redirect to thank you page
        $('.submit-btn').removeClass('loading');
        var cvgUid = getCookieValue('__cvg_uid');
        window.location.href = 'https://checkout.hairqare.co/buy/hairqare-challenge-save-90/?__cvg_uid=' + cvgUid;
      },
      error: function() {
        // Stop loading animation and redirect to thank you page
        $('.submit-btn').removeClass('loading');
        var cvgUid = getCookieValue('__cvg_uid');
        window.location.href = 'https://checkout.hairqare.co/buy/hairqare-challenge-save-90/?__cvg_uid=' + cvgUid;
      }
    });
