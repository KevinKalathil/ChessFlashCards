import React, { Component } from 'react';
import {FaChessBoard} from 'react-icons/fa';

export default function Navbar({handleChange, handleSubmit}) {
    return (
        // <nav class="container flex mx-20 py-8">
        //     <div class="text-4xl">Chess Flashcards</div>
        //     <ul class="hidden sm:flex flex-1 justify-end gap-12">
        //         <li class="cursor-pointer text-xl">Home</li>
        //         <li class="cursor-pointer text-xl">About</li>
        //     </ul>
        // </nav>
        <nav class="flex items-center bg-black p-8 mb-5">

            <div class="flex items-center text-white mr-6">
                <FaChessBoard class="mr-3" size={30}/> 
                <span class="font-semibold text-2xl tracking-tight">Chess FlashCards</span>
            </div>
            <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div class="text-sm lg:flex-grow">
                    <input type='form' placeholder="Add lichess game link to generate more flashcards" class="flex justify-left items-center w-1/2 sm:w-5/6 mx-20 rounded-full border border-black px-5 py-2 md:placeholder-gray-500 md:focus:placeholder-gray-400 outline-none" onChange={(e) => handleChange(e)}></input>
                </div>
                <div>
                <button class="inline-block text-md px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-black hover:bg-white mt-4 lg:mt-0" onClick={async () => handleSubmit()}>Parse Game</button>
                </div>
            </div>
        </nav>
    );

}