import React from 'react'

export default function Board(positions) {
    const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const verticalAxis = [8,7,6,5,4,3,2,1]
    const colors = ['green', 'white']
    let grid = {
        'a': ['', '', '', '', '', '', '', ''], 
        'b': ['', '', '', '', '', '', '', ''], 
        'c': ['', '', '', '', '', '', '', ''], 
        'd': ['', '', '', '', '', '', '', ''], 
        'e': ['', '', '', '', '', '', '', ''], 
        'f': ['', '', '', '', '', '', '', ''], 
        'g': ['', '', '', '', '', '', '', ''], 
        'h': ['', '', '', '', '', '', '', ''], 
    }

    function styleOptions(i, j) {
        const difference = j.charCodeAt(0) - 'a'.charCodeAt(0);
        if ((difference + i) % 2 === 0) {
            return { 'backgroundColor': 'lightgreen', 'height':'80px','width':'80px' };
        }
        else {
            return { 'backgroundColor': 'white' , 'height':'80px','width':'80px'};

        }

    }

    function loadGrid(){
        console.log('render board')
        console.log(grid)
        verticalAxis.map((color) =>
            horizontalAxis.map((i) =>{
                grid[i][color] = '/ChessPieces/transparent.png'

            })
        )
        // console.log(positions['positions'])
        Object.keys(positions['positions']).map((color) =>
            Object.keys(positions['positions'][color]).map((piece) => {
                // console.log('Color', color)
                // console.log('piece', piece)
                // console.log(positions['positions'][color][piece])
                Object.keys(positions['positions'][color][piece]).map((j) =>
                    grid[positions['positions'][color][piece][j][0]][positions['positions'][color][piece][j][1]] = '/ChessPieces/'+color+'/'+piece+'.png'
                )
            })
        )
    }

    function checkValid(input){
        return input !=""
    }

    function imageStyleOptions(){
        return {
            'height':'60px',
            'width':'60px',
        }
    }


    return (
        <div class="container flex justify-center mx-auto">
            {loadGrid()}
            <div class="grid grid-cols-8 my-5 ring-8 ring-gray-400">
                {
                    verticalAxis.map((color) =>
                        horizontalAxis.map((i) =>
                            <div class="justify-center px-3 py-2" style={styleOptions(color, i)}>
                                {
                                    console.log(2)
                                    

                                }
                                <img onLoad={checkValid(grid[i][color])} style={imageStyleOptions()} src={grid[i][color]}></img>
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
