'use strict';

import React from 'react';
import { act } from 'react-dom/test-utils';
import { AccountHome, NewThreadButton, RecentThreads, SW_Utils } from '../js/react_components/AccountHome.js';
import { unmountComponentAtNode, render } from "react-dom";
import runCommentDisplaySpecs from './CommentDisplay.spec.js';
import runCommentBlockSpecs from './CommentBlock.spec.js';
import runCommentGridSpecs from './CommentGrid.spec.js';

runCommentDisplaySpecs();

runCommentBlockSpecs();

runCommentGridSpecs();

function runAccountHomeSpecs(){
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

  describe('getNumComments', () => {

    let gnc = SW_Utils.getNumComments;

    it('returns 0 when undefined comments array', () => {
      expect( gnc({}) ).toBe(0);
    });

    it('returns correct number for non-nested array', () => {
      expect( gnc({comments:[{},{},{},{}]}) ).toBe(4);
    });

    it('returns correct number for nested arrays', () => {

      let sampleDoc = { 
        comments: [
          {comments:[{}, {}]},

          {},

          {comments:[{}]},
          
          {comments:[
            {comments: [{}]}
          ]}
      ]}

      expect( gnc(sampleDoc)).toBe(9);

    });

  });
  
  describe('flashMessage', () =>{
  
    it("attaches label to given element and vanishes after", async () => {
  
      let timeout = 10;
  
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
          }, timeout+500);
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
  
      it('shows error message if "ok" is pressed with empty text field', async () => {
  
        function createNewThreadInDB(title){
          return new Promise((res, rej) => {
  
            if(title.length === 0){
              //console.log('rejected');
              rej('must type thread name!');
            }
            
          });
        }
  
        act(() => {
          render(e(NewThreadButton, {createNewThreadInDB}), container);
        });
  
        let button = container.querySelector('button');
        expect(button).not.toBe(null);
  
        //click 'create thread' then 'ok' button
        act(() =>{
          button.dispatchEvent( new MouseEvent("click", { bubbles: true }) );
        });
  
        let okButton = container.querySelector('div').querySelector('button');
        act(() =>{
          okButton.dispatchEvent( new MouseEvent("click", { bubbles: true }) );
        });
  
        //check if error message is displayed
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            expect(okButton.querySelector('label')).not.toBe(null);
            resolve();
          });
        });
        
      });
  
      it('saves new thread in db when "ok" is pressed with valid thread title', async () => {
        let db = new PouchDB('testdb');
  
        function createNewThreadInDB(title){
          return new Promise((res, rej) => {
            db.put({
              "_id": title
            })
            res('this is just a mock of a valid thread title: ');
          });
        }
  
        act(() => {
          render(e(NewThreadButton, {createNewThreadInDB}), container);
        });
        
        let button = container.querySelector('button');
        //click 'create thread' then 'ok' button
        act(() =>{
          button.dispatchEvent( new MouseEvent("click", { bubbles: true }) );
        });
  
        //add a sample title to thread field
        let threadTitle = 'Wondering about the world';
        let parentDiv = container.querySelector('div');
        
        let input = parentDiv.querySelector('input');
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, threadTitle);
        //console.log('input: ', input);
  
        act(() =>{
          input.dispatchEvent( new Event('input', {bubbles: true}) );
        });
  
        let okButton = parentDiv.querySelector('button');
        act(() =>{
          okButton.dispatchEvent( new MouseEvent("click", { bubbles: true }) );
        });
  
        await new Promise((res,rej) => {
          
          db.get(threadTitle)
  
          .then((doc) => {
  
            expect(doc._id).toBe(threadTitle);
  
            //remove doc so further tests don't have 'doc conflict' error
            return db.remove(doc);
          })
  
          .then(() => res())
  
          .catch(err => rej('Error: ', err.message));
        });
        
      });
  
      it('shows "New Thread Button" again if "cancel" is pressed', async () => {
  
        act(() => {
          render(e(NewThreadButton), container);
        });
  
        let button = container.querySelector('button');
        expect(button).not.toBe(null);
  
        //click 'create thread' then 'ok' button
        act(() =>{
          button.dispatchEvent( new MouseEvent("click", { bubbles: true }) );
        });
  
        let cancelButton = container.querySelector('div').getElementsByTagName('button')[1];
        act(() =>{
          cancelButton.dispatchEvent( new MouseEvent("click", { bubbles: true }) );
        });
  
        button = container.querySelector('button');
        expect(button).not.toBe(null);
        expect(button.innerText).toBe('Create New Thread');
        
      });
  
  });
}

runAccountHomeSpecs();


