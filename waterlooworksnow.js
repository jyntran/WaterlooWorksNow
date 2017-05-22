// ==UserScript==
// @name         WaterlooWorksNow
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Waterloo Works script to add new functionality. Adds new tab functionality to listings.
// @author       jyntran
// @match        https://waterlooworks.uwaterloo.ca/myAccount/hire-waterloo/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var wwn = window.wwn = {};

    wwn.openTab = function(fn){
  		var newTab = window.open(window.location.href);
  		var fnBody = fn.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1].trim();
  		localStorage.setItem("wwnJobOpener", 'window.' + fnBody.toString());
  		newTab.window.onload = function() {
  			newTab.window.eval(localStorage.wwnJobOpener);
  		};
  	};

    $(document).ready(function() {
	    var searchResults = document.getElementsByClassName('searchResult');

	    for (var i=0; i < searchResults.length; i++) {
	        var tdElem = searchResults[i].children[2];
	        var linkElem = searchResults[i].children[2].getElementsByTagName('a')[0];
	        var onclickContents = linkElem.onclick;
	        var newElem = document.createElement('button');
	        var newSpan = document.createElement('span');
	        newSpan.setAttribute('class', 'icon-external-link');
	        newElem.setAttribute('onclick', 'wwn.openTab('+ onclickContents +');');
	        newElem.setAttribute('class', 'btn btn-primary btn-mini');
	        newElem.appendChild(newSpan);
	        tdElem.appendChild(newElem);
	    }
    });
})();
