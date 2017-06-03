// ==UserScript==
// @name         WaterlooWorksNow
// @namespace    http://tampermonkey.net/
// @version      2.0
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
            var loadingIconElem = document.createElement('span');
            var loadingElem = document.createElement('div');
            loadingIconElem.setAttribute('class', 'icon-cog icon-spin');
            loadingIconElem.setAttribute('style', 'font-size: 1000%; color: white;');
            loadingElem.setAttribute('id', 'wwnLoading');
            loadingElem.setAttribute('style', 'position: absolute; background: black; background: rgba(0,0,0,0.5); width: 100%; height: 100%; top: 0; left: 0; display: flex; align-items: center; justify-content: center; z-index: 1000;');
            loadingElem.appendChild(loadingIconElem);
            newTab.window.document.body.appendChild(loadingElem);
            
            newTab.window.eval(localStorage.wwnJobOpener);
        };
    };
    
    function renderExpiring() {
        var expiringListings = $('.isAboutToExpire');
        
        for (var i=0; i < expiringListings.length; i++) {
            var tdElem = expiringListings[i].children[2];
            var expiringElem = document.createElement('span');
            expiringElem.setAttribute('class', 'icon-exclamation-sign');
            expiringElem.setAttribute('style', 'color: #c00; margin: auto 4px');
            expiringElem.setAttribute('title', 'Deadline today');
            tdElem.appendChild(expiringElem);
        }
    }
    
    function renderNewTabButtons() {                    
        var searchResults = document.getElementsByClassName('searchResult');

        for (var i=0; i < searchResults.length; i++) {
            var tdElem = searchResults[i].children[2];
            var linkElem = tdElem.getElementsByTagName('a')[0];
            var onclickContents = linkElem.onclick;
            var newElem = document.createElement('button');
            var newSpan = document.createElement('span');
            newSpan.setAttribute('class', 'icon-external-link');
            newElem.setAttribute('onclick', 'wwn.openTab('+ onclickContents +');');
            newElem.setAttribute('class', 'btn btn-mini wwn-newtab');
            newElem.setAttribute('style', 'margin: auto 4px');
            newElem.setAttribute('title', 'Open in new tab');
            newElem.appendChild(newSpan);
            tdElem.appendChild(newElem);
        }
        
        // remove br element after job title link
        $('.searchResult td:nth-child(' + 3 + ') br').remove();
    }
    
    function renderWWN() {
        if ($('.isAboutToExpire').length) {
            renderExpiring();
        }
        if (!$('.wwn-newtab').length) {
            renderNewTabButtons();
        }
    }
    
    $(document).ready(renderWWN);
    
    $('#postingsTablePlaceholder').on('DOMSubtreeModified', renderWWN);

})();
