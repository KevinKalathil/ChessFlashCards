import React, { Component } from 'react';
import Steps from './steps';

export default function SideBar(moves, count, step) {
    console.log(moves)
    return (
        <div class="grid grid-rows-17 w-1/4 place-self-end self-stretch h-1/3 my-5 rounded">
            <div class="row-span-1 text-2xl flex font-semibold justify-start mx-8 my-3 mb-5">Moves</div>
            <div class="row-span-25 justify-start mx-8 my-3 mb-5"><Steps moves={moves}/></div>
        </div>

    );

}