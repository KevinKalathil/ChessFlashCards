import React from 'react'

export default function Board() {
    const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const verticalAxis = [1, 2, 3, 4, 5, 6, 7, 8]
    const colors = ['green', 'white']

    function styleOptions(i, j) {
        const difference = j.charCodeAt(0) - 'a'.charCodeAt(0);
        if ((difference + i) % 2 == 0) {
            return { 'backgroundColor': 'lightgreen' };
        }
        else {
            return { 'backgroundColor': 'white' };

        }

    }

    return (
        <div class="container flex justify-center mx-auto">
            <div class="grid grid-cols-8 my-10">
                {
                    verticalAxis.map((i) =>
                        horizontalAxis.map((j) =>
                            <div class="justify-center px-4 py-3" style={styleOptions(i, j)}>
                                <img src='/ChessPieces/Chess_bdt60.png'></img>
                            </div>
                        )
                    )
                }
            </div>

        </div>
        // <div class="grid grid-cols-3 gap-4">
        //     <div>1</div>
        //     <div>1</div>
        //     <div>1</div>
        //     <div>1</div>
        //     <div>1</div>
        //     <div>1</div>
        //     <div>1</div>
        //     <div>1</div>
        //     <div>9</div>
        // </div>

    );

}
