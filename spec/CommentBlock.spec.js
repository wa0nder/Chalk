'use strict';

import React from 'react';
import { act } from 'react-dom/test-utils';
import CommentBlock from '../js/react_components/CommentBlock.js';
import { unmountComponentAtNode, render } from "react-dom";

function runCommentBlockSpecs(){
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

    describe('CommentBlock', () => {

        it('renders four HTML elements', () => {
            
            act(() => {
                render(e(CommentBlock), container);
            })

            let childs = Array.from(container.querySelector('div').children);
            expect(childs.map(e => e.tagName.toLowerCase())).toEqual(['h4','textarea','button','button']);
        });

        it('clears text with...clearText()', () => {
            let rcomp;

            act(() => {
                rcomp = render(e(CommentBlock), container);
            })

            let textarea = container.querySelector('textarea');
            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(textarea, "Just some text");

            act(() => {
                textarea.dispatchEvent( new Event('input', {bubbles:true}) );
            });

            expect(textarea.value.length).not.toBe(0);

            rcomp.clearText();

            expect(textarea.value.length).toBe(0);
        });

        it('shows error if try to post empty comment body', async () => {

            act(() => render(e(CommentBlock), container) );

            let postbtn = container.querySelector('button');

            act(() => postbtn.dispatchEvent( new MouseEvent('click', {bubbles:true})) );

            await new Promise((res,rej) => {
                setTimeout(() => {
                    expect(document.body.querySelector('.messageLbl.messageLbl--red')).not.toBe(null);
                    res();
                });
            });

        });


        it('calls createNewCommentInDB, clears text after "Post Comment" button click', async () => {
            
            function createNewCommentInDB(){
                return Promise.resolve();
            }

            act(() => render(e(CommentBlock, {createNewCommentInDB}), container) );

            let textarea = container.querySelector('textarea');
            let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeInputValueSetter.call(textarea, "Just some text");

            act(() => {
                textarea.dispatchEvent( new Event('input', {bubbles:true}) );
            });

            let postbtn = container.querySelector('button');

            act(() => postbtn.dispatchEvent( new MouseEvent('click', {bubbles:true})) );

            await new Promise((res,rej) => {
                setTimeout(() => {
                    expect(textarea.value.length).toBe(0);
                    res();
                });
            });
        });

        // it('is removed when "Cancel" button is clicked', () => {

        //     act(() => render(e(CommentBlock), container) );

        //     let postbtn = container.querySelector('div').querySelector('button');

        //     act(() => postbtn.dispatchEvent( new MouseEvent('click', {bubbles:true})) );

        //     await new Promise((res,rej) => {
        //         setTimeout(() => {
                    
        //         });
        //     });
        // })

    });
}

export default runCommentBlockSpecs;