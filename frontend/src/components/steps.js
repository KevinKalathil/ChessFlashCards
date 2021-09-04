import React, { Component } from 'react';

export default function Steps(moves) {
    console.log(moves['moves']['moves'])
    let step=0
    if(Object.keys(moves['moves']['moves']).length === 0) {
        return (
            <div></div>
        );
    }else{
        console.log(moves)
        step = moves['moves']['step']
        moves = JSON.parse(moves['moves']['moves'][moves['moves']['count']]['nextSteps'])
        console.log(moves)
    }

    function getStyle(index){
        console.log(index, step)
        if(index===step){
            return "text-lg place-self-start text-red-500"
        }
        return "text-lg place-self-start row-span-2"
    }
    return (
        <div class="grid grid-rows-8 place-self-stretch">
            <div class={getStyle(0)}>1. Initial</div>
            <div class={getStyle(1)}>2. {moves[0]}</div>
            <div class={getStyle(2)}>3. {moves[1]}</div>
            <div class={getStyle(3)}>4. {moves[2]}</div>
        </div>
    );

}