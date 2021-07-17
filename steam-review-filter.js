// ==UserScript==
// @name          Steam review keyword filter
// @author        Tobias Bindel
// @license       MIT
// @version       1.0
// @description   https://github.com/ImJezze/steam-review-filter.git
// @match         https://steamcommunity.com/app/*/*reviews/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js
// @grant         GM_addStyle
// @run-at        document-end
// ==/UserScript==

var observer = new window.MutationObserver(function(mutations, observer)
{
  mutations.forEach(e =>
  {
    filterCardRow(e.target);
  });
});

observer.observe(document.getElementById('AppHubCards'), {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false,
});

function filterCardRow(element)
{
  let term = document.getElementById('term');
  
  if (element.classList.contains('apphub_CardRow'))
  {
    let cards = element.getElementsByClassName('apphub_Card');
    Array.from(cards).forEach(e =>
    {
      // make all cards the same size (alligned in two columns)
      $(e).css('width', '460px');
      $(e).css('height', '400px');
      
      let content = element.getElementsByClassName('apphub_CardContentMain')[0];
      $(content).css('height', '350px');
      
      // add card directly into the page
      element.parentNode.insertBefore(e, null);
    
      filterCard(e, term.value);
    });
    
    // remove card row
    if (element.parentNode)
    {
      element.parentNode.removeChild(element);
    }
  }
}

function filterCards(keyword)
{
  let term = document.getElementById('term');  
  let cards = document.getElementsByClassName('apphub_Card');
  Array.from(cards).forEach(e =>
  {
    filterCard(e, term.value);
  });
};

function filterCard(element, keyword)
{
  keyword = keyword == filterKeywordBlank ? '' : keyword;
  
  if (element.classList.contains('apphub_Card'))
  {    
    let cardTextContent = element.getElementsByClassName('apphub_CardTextContent')[0];
    let expression = new RegExp(keyword, 'i')
    let show = !keyword || expression.match(cardTextContent.innerText);
    
    showElement(show, element);
  } 
};

function showElement(show, element)
{
  element.classList.remove('apphub_Card_hidden');
  if (!show)
  {
    element.classList.add('apphub_Card_hidden');
  }
};

// create input field
let filterKeywordBlank = "enter search term";
let filterKeywordInput = document.createElement("input");
filterKeywordInput.type = "text";
filterKeywordInput.class = "text";
filterKeywordInput.id = "term";
filterKeywordInput.onfocus = function() {
  if (this.value == filterKeywordBlank)
  {
    this.value = '';
  }
};
filterKeywordInput.onchange = function() {
  filterCards();
};
filterKeywordInput.onblur = function() {
  if (this.value == '')
  {
    this.value = filterKeywordBlank;
  }
};
filterKeywordInput.value = "enter search term"
filterKeywordInput.autocomplete = "off";

// add input field
var sectionFilter = document.getElementsByClassName('apphub_SectionFilter')[0];
sectionFilter.insertBefore(filterKeywordInput, null);

// add custom styles
let steamCSS = `
  /* hide labels */
  .apphub_SectionFilterLabel {
    display: none;
  }
  
  /* hide 'about reviews' button */
  .learnMore {
    display: none;
  }
  
  /* hide reviews */
  .apphub_Card_hidden {
    display: none;
  }
  
  /* resize language field */
  #filterlanguage {
    width: auto;
    min-width: 150px;
  }
  
  /* resize input field */
  #term {
    height: 22px;
    width: 340px;
    margin-left: 10px;
  }
`;

GM_addStyle(steamCSS);
