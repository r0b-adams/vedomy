//  JQuery DOM Variables here:
var yogaImg = $('.yoga-img');
var yogaName = $('.yoga-name');
var yogaLink = $('#yoga-link')
var closeIcon = $('#close-icon')
var openIcon = $('#open-icon')
var sanskName = $('.sanskrit-name');
var quoteHere = $("#quote-here");
var quoteAuthor = $("#author");
var checkBox = $('.checkbox')
var yesExercise = $('#yes-exercise')
var noExercise = $('#no-exercise')
var addMoodBtn = $('#add-mood');
var moodRange = $("#test5");
var sleepNum = $('.hour-amount');
var dietChoices = $('.diet-choices');
var thoughtOfDay = $('#thought-of-day');
var breatheBox = $('#breatheBox')
var boxBtn = $('#boxBtn')
var sideNavPosts = $('.sidenav-posts')

var navTemplate = '';
var instance = M.Sidenav.getInstance($('.sidenav'));

var moodBoxTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
var navBoxTime = moment().format("dddd, MMMM Do YYYY");

var hasVisitedRecently = dayCheck();

GetYogaApi();
getQuotesApi();
getRecipe(); //api key has 150 request daily quota

$(document).ready(function() {
  // clears side nav 
  sideNavPosts.empty();
  var localMoodArr = JSON.parse(localStorage.getItem('moodArr')) || [];

  // for every object in local storage:
  for (i = 0; i <localMoodArr.length; i++ ) {
    // future moodbox creation on page-load:
    //   createMoodBox(localMoodArr[i])
    
    // Regenerates side nave links
    createSideNavLinks(localMoodArr[i]);
  // }
  }

  //initializers        
  $('#modal1').modal();
  $('#modal2').modal();
  $('select').formSelect();
  $('.sidenav').sidenav();

})
    

addMoodBtn.on('click', function() {
  
  // creates object based on results of modal
  var modalSubmit = {
    navTime: navBoxTime,
    time: moodBoxTime,
    mood: moodRange.val(),
    sleep: sleepNum.val(),
    exercise: yesExercise.prop('checked'),
    diet: dietChoices.val(),
    thoughts: thoughtOfDay.val(),
  }

  // gets stred array, puts new object in, and re-stores it.
  var localMoodArr = JSON.parse(localStorage.getItem('moodArr')) || [];
  localMoodArr.push(modalSubmit);
  console.log(localMoodArr);
  localStorage.setItem("moodArr", JSON.stringify(localMoodArr));

  // creates a post link in side nav
  createSideNavLinks(modalSubmit)

})

// This function creates sidenav links based off user posts
function createSideNavLinks(post) {
  var statusIcon;

    // depending on mood of post, will display different emoticon on link
    if (post.mood <= 1) {
      statusIcon = '<i class="material-icons red-text">sentiment_very_dissatisfied</i>'
    } else if (post.mood > 1 & post.mood < 4) {
      statusIcon = '<i class="material-icons orange-text">sentiment_dissatisfied</i>'
    } else if (post.mood > 3 & post.mood < 6) {
      statusIcon = '<i class="material-icons yellow-text accent-3">sentiment_neutral</i>'
    } else if (post.mood > 5 & post.mood < 8) {
      statusIcon = '<i class="material-icons lime-text">sentiment_satisfied</i>'
    } else if (post.mood > 7 & post.mood < 10) {
      statusIcon = '<i class="material-icons light-green-text">sentiment_very_satisfied</i>'
    } else {
      statusIcon = '<i class="material-icons green-text">sentiment_very_satisfied</i>'
    }

  // this variable will go in href, to navigate to post on page.
  var grabTime;
  // adds an html string to the sidenav
  navTemplate += `<li><a href="#!">${statusIcon}${post.navTime}</a></li>`;

  sideNavPosts.html(navTemplate);
}

// Yoga pose API fetching/displaying
function GetYogaApi() {
    var randIndex = Math.floor(Math.random() * 48);
    console.log(randIndex);
    fetch("https://raw.githubusercontent.com/rebeccaestes/yoga_api/master/yoga_api.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var yogaData = data[randIndex]
            yogaImg.attr('src', yogaData.img_url)
            yogaName.text(yogaData.english_name)
            var dropDownIcon = $('<i></i>').text('more_vert');
            dropDownIcon.attr('class', 'material-icons right');
            yogaName.append(dropDownIcon);
            sanskName.text(`The Sanksrit name for this pose is "${yogaData.sanskrit_name}".`);
        });
}

//Inspirational Quotes API
function getQuotesApi() {
    var zenQuote = 'https://type.fit/api/quotes';
    fetch(zenQuote)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {  
        var randomIndex = Math.floor(Math.random() * data.length)   
        console.log(data)
        console.log(data[randomIndex].text, data[randomIndex].author);
        quoteHere.append(data[randomIndex].text);
        if (data[randomIndex].author == null) {
            quoteAuthor.append("Author Unknown")
        } else {
            quoteAuthor.append(data[randomIndex].author)
        }
        console.log(data[randomIndex].author)
    })
};

// fetches recipe for display
function getRecipe () {
  // retrieve data from local storage
  var savedRecipes = JSON.parse(localStorage.getItem("recipes"));

  // if local storage exists and page visited in last 24 hrs
  if (savedRecipes && hasVisitedRecently) {

    // use that data
    console.log("saved recipe contents:");
    console.log(savedRecipes);

  // else there was nothing in local storage or > 24 hrs since last visit
  // fetch new API data and save to local storage
  } else {
    
    var recipeUrl = "https://api.spoonacular.com/recipes/complexSearch?apiKey=c4a52647f4a64446b59c7602af76c88b&addRecipeInformation=true&number=100&tags=healthy&sort=healthiness";

    fetch(recipeUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      localStorage.setItem("recipes", JSON.stringify(data));
    });
  }
}

// returns true if page has been visited in last 24 hr
function dayCheck () {
  var currentTime = moment().unix();
  var referenceTime = parseInt(localStorage.getItem("refTime"));

  // if a reference time exists, check against current time
  if (referenceTime) {
      var difference = currentTime - referenceTime;

      // if time since last visit is less than 24 hrs, return true
      if (difference <= 86400) {
          return true;
      }

  // else system could not retrieve a reference time
  // set reference time for the system
  } else {
      referenceTime = currentTime;
      localStorage.setItem('refTime', referenceTime);
  }

  // page not visited in last 24 hrs OR no reference time found
  return false;
}

// This function checks to see if checkbox is checked, then disbales the other
function ckCheckbox(ckType){
  var checked = document.getElementById(ckType.id);

  if (checked.checked) {
    for(var i=0; i < checkBox.length; i++){

        if(!checkBox[i].checked){
            checkBox[i].disabled = true;
        }else{
            checkBox[i].disabled = false;
        }
    } 
  }
  else {
    for(var i=0; i < checkBox.length; i++){
      checkBox[i].disabled = false;
    } 
  }    
}

//BreatheBox
function animateBox() {
    breatheBox.style.transform = 'scale(0.2)';
    requestAnimationFrame(animateBox);
}
boxBtn.on("click", animateBox); 