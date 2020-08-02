'use strict';

import React from 'react';
import { act } from 'react-dom/test-utils';
import { AccountHome, NewThreadButton, RecentThreads, CommentThreadPreview, SW_Utils } from '../js/react_components/AccountHome.js';
import { unmountComponentAtNode, render } from "react-dom";

let container = null;
let e = React.createElement;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('flashMessage', () =>{

  it("attaches label to given element and vanishes after", async () => {

    let timeout = 50;

    act(() => {
      SW_Utils.flashMessage(container, 'green', 'gone in a few', timeout);
    });

    let label = container.querySelector('label');
    
    expect(label.innerText).toBe('gone in a few');

    expect(label.parentElement).toBe(container);

    await new Promise((resolve, reject) => {
        setTimeout(() => {
            expect(label.parentElement).toBe(null);
            expect(container.firstElementChild).toBe(null);
            resolve();
        }, timeout+2500);
    });

  });
});

describe('scrollCalc x/y/height/width calculations', () => {

    let sc = SW_Utils.scrollCalc;

    it('scrollBarWidth/Height returns 0 when parameter is null', () => {

        expect(sc.calcScrollBarWidth(null)).toBe(0);
        expect(sc.calcScrollBarHeight(null)).toBe(0);
    });

    let elem = {
        clientWidth: 50,
        scrollWidth: 50,
        clientHeight: 40,
        scrollHeight: 40
    }
    it('returns clientWidth/Height when no scrollbar', () => {

        expect(sc.calcScrollBarWidth(elem)).toBe(elem.clientWidth);
        expect(sc.calcScrollBarHeight(elem)).toBe(elem.clientHeight);
    });

    it('scrollBarX/Y returns 0 when parameter is null', () =>{

        expect(sc.calcScrollBarX(null)).toBe(0);
        expect(sc.calcScrollBarY(null)).toBe(0);
    });

});

describe('NewThreadButton', () => {

    it('changes render output on "new thread" button click', () => {

        act(() => {
          render(e(NewThreadButton, {}), container);
        });
        
        let button = container.querySelector('button');
        expect(button.tagName.toLowerCase()).toBe('button');

        //click 'create thread'
        act(() =>{
          button.dispatchEvent( new MouseEvent("click", { bubbles: true }) );
        });
        
        //expect render output to be input field and buttons
        let elements = Array.from(container.firstElementChild.children);
        let tags = elements.map(item => item.tagName.toLowerCase());
        tags.unshift('div');
        
        expect(tags).toEqual(['div','input','button','button']);

        //click cancel button
        let cancelButton = container.querySelector('div').getElementsByTagName('button')[1];
        act(() =>{
          cancelButton.dispatchEvent( new MouseEvent("click", { bubbles: true }) );
        });
        
        

    });

    it('shows error message if "ok" is pressed with empty text field', () => {

      act(() => {
        render(e(NewThreadButton, {}), container);
      });

      console.log('container1: ', container);

      let button = container.querySelector('button');
      expect(button !== null).toBe(true);

      //click 'create thread' then 'ok' button
      act(() =>{
        button.dispatchEvent( new MouseEvent("click", { bubbles: true }) );
      });

      let okButton = container.querySelector('div').querySelector('button');
      act(() =>{
        okButton.dispatchEvent( new MouseEvent("click", { bubbles: true }) );
      });

      //check for error message label
      expect(okButton.querySelector('label') !== null).toBe(true);
      
    });

    it('saves new thread in db when "ok" is pressed with valid thread title', () => {
      let db = new PouchDB('testdb');
      let DataService = {
        getDB: () => db
      }

      function createNewThreadInDB(id){
        return new Promise((res, rej) => {
          resolve('this is just a mock: ', id);
        });
      }

      act(() => {
        render(e(NewThreadButton, {DataService, createNewThreadInDB}), container);
      });

      console.log('container1: ', container);

      //click 'create thread' then 'ok' button
      act(() =>{
        button.dispatchEvent( new MouseEvent("click", { bubbles: true }) );
      });

      //add a sample title to thread field
      let threadTitle = 'Wondering about the world';
      let parentDiv = container.querySelector('div');
      container.parentDiv.querySelector('input').value = threadTitle;

      let okButton = parentDiv.querySelector('button');
      act(() =>{
        okButton.dispatchEvent( new MouseEvent("click", { bubbles: true }) );
      });

      db.get(threadTitle)
        .then((doc) => {

          expect(doc._id).toBe(threadTitle);
        })
        .catch(err => console.log('Error: ', err.message));


    });

});
