import React from 'react'

export default function Board({positions, candidates, destinations}) {
    const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"]
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
        const difference = j.charCodeAt(0) - 'a'.charCodeAt(0)+1;
        if(Object.keys(candidates).length !== 0){
            for(let a=0;a<candidates.length;a++){
                if(candidates[a][0]===j && candidates[a][1]===i){
                    return { 'backgroundColor': 'rgb(128, 223, 255)', 'height':'80px','width':'80px' };
                }
            }    
        }

        if(Object.keys(destinations).length !== 0){
            for(let a=0;a<destinations.length;a++){
                if(destinations[a][0]===j && destinations[a][1]===i){
                    return { 'backgroundColor': 'rgb(255, 77, 77)', 'height':'80px','width':'80px' };
                }
            }    
        }


        if ((difference + i) % 2 === 0) {
            return { 'backgroundColor': 'rgb(125,135,150)', 'height':'80px','width':'80px' };
        }
        else {
            return { 'backgroundColor': 'rgb(232,235,239)' , 'height':'80px','width':'80px'};
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
        console.log(grid)
        // console.log(positions['positions'])
        Object.keys(positions).map((color) =>
            Object.keys(positions[color]).map((piece) => {
                Object.keys(positions[color][piece]).map((j) =>
                    grid[positions[color][piece][j][0]][positions[color][piece][j][1]] = '/ChessPieces/'+color+'/'+piece+'.png'
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
        <div class="container flex mx-auto">
            {loadGrid()}
            <div class="grid grid-cols-8 my-5">
                {
                    verticalAxis.map((color) =>
                        horizontalAxis.map((i) =>
                            <div class="justify-center px-2 py-2" style={styleOptions(color, i)}>
                                <img style={imageStyleOptions()} src={grid[i][color]}></img>
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
