'use strict';

import React from 'react';
import { act } from 'react-dom/test-utils';
import CommentGrid from '../js/react_components/CommentGrid.js';
import { unmountComponentAtNode, render } from "react-dom";

function runCommentGridSpecs(){
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

    describe('CommentGrid', () => {

        it('shows nothing when comment array is empty or undefined/null', () => {

          act(() => {
            render(e(CommentGrid, {commentThreadDoc:{}}), container);
          });

          let gridcontainer = container.querySelector('div');

          expect(gridcontainer.children.length).toBe(0);

          act(() => {
            render(e(CommentGrid, {commentThreadDoc:{comments:[]}}), container);
          });

          gridcontainer = container.querySelector('div');

          expect(gridcontainer.children.length).toBe(0);

        });

        it('shows current comment with red outline', () => {

          let sampleDoc = {
            "_id": "Testing 1 2 3",
            "comments": [
              {
                "author": "tester",
                "body": "Comment 1"
              },
              {
                "author": "tester",
                "body": "Comment 2"
              },
              {
                "author": "tester",
                "body": "Comment 3"
              }
            ]
          }

          act(() => {
            render(e(CommentGrid, {commentThreadDoc:sampleDoc}), container);
          });

          let gridContainer = container.querySelector('div');

          //1st div is grid row, 2nd div is first comment (1st comment is highlighted by default)
          let comment = gridContainer.querySelector('div').querySelector('div');

          expect(comment.style.borderColor).toBe('red');

        });

        it('on scroll event, it highlights current comment and dims ancestor comments', () => {

          let sampleDoc = {
            "_id": "Testing 1 2 3",
            "comments": [
              {
                "author": "tester",
                "body": "Comment 1"
              },
              {
                "author": "tester",
                "body": "Comment 2"
              },
              {
                "author": "tester",
                "body": "Comment 3"
              }
            ]
          }

          act(() => {
            render(e(CommentGrid, {commentThreadDoc:sampleDoc}), container);
          });

          let gridContainer = container.querySelector('div');

          let firstRow = gridContainer.querySelector('div');

          let firstComment = firstRow.querySelector('div');

          firstRow.scrollTo(firstComment.clientWidth, 0);

          let allComments = Array.from(firstRow.children);

          let len = allComments.filter(comment => comment.className !== 'commentBoxTint').length;

          expect(allComments.filter(comment => comment.style.borderColor).length).toBe(1);

          expect(allComments.filter(comment => comment.className === 'commentBoxTint').length).toBe(len-1);

        });

    });
}

export default runCommentGridSpecs;