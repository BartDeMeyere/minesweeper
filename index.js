
let ROWS = 9
let COLS = 9
let SIZE = 30

let number_of_bombs = 10
let canclickTile = true

let win_snd = new Audio("sounds/win.mp3")
let explosion_snd = new Audio("sounds/explosion.mp3")

//css setup
$(".grid").css("display" , "grid")
$(".grid").css("grid-template-columns" , "repeat(" + COLS + "," + SIZE + "px)")
$(".grid").css("grid-template-rows" , "repeat(" + ROWS + "," + SIZE + "px)")


//make 2D grid array
let grid = Make2DArray( ROWS , COLS)

//render grid in html document
CreateGrid()

$(".cell").css("font-size" , SIZE/3 + "px")
$("#newgame_btn").prop("disabled" , "false")

//place bombs
Place_bombs()
//place digits
Place_Digits()

//make 2D grid
function Make2DArray(rows , cols){

    let arr = new Array()

   //create empty grid
    for(var i = 0 ; i < rows ; i++){

        arr[i] = []

        for(var j = 0 ; j < cols ; j++){

            arr[i][j] = 0

        }
    }

    return arr

}

//get value in grid
function Gridvalue(row , col){

    if(grid[row] === undefined){

        return false
    }

    if(grid[row][col] === undefined){

        return false
    }

    return true
}

//get value by id
function GetCell(row , col){

    return $("#" + row + "_" + col)
}

//grid setup
function CreateGrid(){

    for(var i = 0 ; i < grid.length ; i++){

        for(var j = 0 ; j < grid[i].length ; j++){

            let cell = document.createElement("div")
            cell.classList.add("cell")
            cell.setAttribute("id" , i + "_" + j)
            cell.dataset.row = i 
            cell.dataset.column = j
            cell.dataset.revealed = false
            cell.dataset.flagged = false 
           
            cell.addEventListener("click" , function(event){

                if(canclickTile){

                    var temprow = $(this).data("row")
                    var tempcol = $(this).data("column")
    
                     $(this).css("backgroundColor" , "lightgrey")
                     $(this).attr("data-revealed" , true)

                     if(grid[temprow][tempcol] === 0){
    
                        floodfill(temprow,tempcol)
    
                     }
    
                     if(grid[temprow][tempcol] === 1){
    
                        $(this).css("color" , "blue")
                        $(this).html(grid[temprow][tempcol])
    
                     }
    
                     if(grid[temprow][tempcol] === 2){
    
                        $(this).css("color" , "green")
                        $(this).html(grid[temprow][tempcol])
    
                     }
    
                     if(grid[temprow][tempcol] > 2 && grid[temprow][tempcol] < 9){
    
                        $(this).css("color" , "red")
                        $(this).html(grid[temprow][tempcol])
    
                     }
    
                     if(grid[temprow][tempcol] > 2 && grid[temprow][tempcol] === 9){
    
                        //$(this).css("color" , "magenta")
                        $(this).css("font-size" , SIZE * .6)
                        $(this).html("&#128163")

                        explosion_snd.play()
                        
                        Reveal_bombs()

                        canclickTile = false

                        console.log("booom!!!")

                        $(".gameEnd").html("You lost the game!")

                        $("#newgame_btn").prop("disabled" , false)
    
                     }

                     CheckWin()
                } 

            })

            cell.addEventListener("mousedown" , function(eventData){

                eventData.preventDefault()

                if(eventData.button === 2){

                    console.log("right mouse was clicked")

                    if($(this).attr("data-flagged") === "true"){

                        $(this).attr("data-flagged" , false)
                        $(this).html("")

                    }else{

                        $(this).attr("data-flagged" , true)
                        $(this).html("&#128681")
                    }
                 
                }
            })

            $(".grid").append(cell)
        }
    }
}

//place bombs
function Place_bombs(){

    for(var i = 0 ; i < number_of_bombs ; i++){

        do{

            var row = Math.floor(Math.random() * ROWS)
            var col = Math.floor(Math.random() * COLS)
    
        }while(grid[row][col] !== 0)

        grid[row][col] = 9

    }

}

//show all bombs
function Reveal_bombs(){

    for(var i = 0 ; i < ROWS ; i++){

        for(var j = 0 ; j < COLS ; j++){

            //bomb found
            if(grid[i][j] === 9){

                GetCell(i,j).css("color" , "magenta")
                GetCell(i,j).css("font-size" , SIZE * .6)
                GetCell(i,j).css("backgroundColor" , "lightgrey")
                GetCell(i,j).html("&#128163")
                GetCell(i,j).attr("data-revealed" , true)
            }
        }
    }
}

//place the digits for the mines
function Place_Digits(){

    for(var i = 0 ; i < ROWS ; i++){

        for(var j = 0 ; j < COLS ; j++){

            if(grid[i][j] === 9){

                for(var ii = -1 ; ii <= 1 ; ii++){

                    for(var jj = -1 ; jj <= 1 ; jj++){

                        if( ii !== 0 || jj !== 0){

                            if(Gridvalue(i + ii , j + jj)){

                                if(grid[i + ii][j + jj] !== 9){

                                    grid[i + ii][j + jj]++
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

//check if we win the game
function CheckWin(){

    count = 0

    for(var i = 0 ; i < ROWS ; i++){

        for(var j = 0 ; j < COLS ; j++){

            if(GetCell(i , j ).attr("data-revealed") === "false"){

                count++
            }
        }
    }

    if(count === number_of_bombs){

        console.log("Winner!!!")
        $(".gameEnd").html("You win the game!")
        canclickTile = false
        win_snd.play()
        $("#newgame_btn").prop("disabled" , false)
    }

}

//floodfill empty cells
function floodfill(row , col){

    function run(){

        for(var i = -1 ; i <= 1 ; i++){

            for(var j = -1 ; j <= 1 ; j++){
    
                if((i === -1 && j === 0) || (i === 0 && j === -1) || ( i === 0 && j === 1) || ( i === 1 && j === 0)){
    
                    if(GetCell(row + i , col + j)){
    
                        if(GetCell(row + i , col + j).attr("data-revealed") === "false" && GetCell(row + i , col + j).attr("data-flagged") === "false"){
    
                            GetCell(row + i , col + j).attr("data-revealed" , true)
                            GetCell(row + i , col + j).css("backgroundColor" , "lightgrey")
    
                            if(grid[row + i][col + j] === 1){
        
                                GetCell(row + i , col + j).css("color" , "blue")
                                GetCell(row + i , col + j).html(grid[row + i][col + j])
            
                             }
    
                             if(grid[row + i][col + j] === 2){
        
                                GetCell(row + i , col + j).css("color" , "green")
                                GetCell(row + i , col + j).html(grid[row + i][col + j])
            
                             }
            
                             if(grid[row + i][col + j] > 2 && grid[row + i][col + j] < 9){
            
                                GetCell(row + i , col + j).css("color" , "red")
                                GetCell(row + i , col + j).html(grid[row + i][col + j])
            
                             }
    
                            if(grid[row + i][col + j] === 0){
    
                                floodfill(row + i , col + j)
                            }
                            
                        }
                        
                    }
     
                }
            
            }
    
        }

    }

    setTimeout(run , 20)

   
}

//create new game
function newGame(){

    grid = Make2DArray(ROWS , COLS)

    //remove child elements from grid
    $(".grid").empty()

    //render grid in html document
    CreateGrid()

    //place bombs
    Place_bombs()

    //place digits
    Place_Digits()

    $(".gameEnd").html("")

}

//menu controls and event
$("#newgame_btn").on("click" , function(){

    $("#newgame_btn").prop("disabled" , "true")

    canclickTile = true

    newGame()
})

$("#rendercustom_btn").on("click" , function(){

    ROWS  = parseInt($("#temprows").val())
    COLS = parseInt($("#tempcols").val())
    number_of_bombs = parseInt($("#tempmines").val())

    if(number_of_bombs <= (ROWS * COLS)){

        $(".grid").css("grid-template-columns" , "repeat(" + COLS + "," + SIZE + "px)")
        $(".grid").css("grid-template-rows" , "repeat(" + ROWS + "," + SIZE + "px)")
        newGame()
        canclickTile = true
        $(".customcontrols").css("display" , "none")
    }

})

$("#level").on("change",  function(){

    console.log(this.value)

    switch(this.value){

        case "beginner": 
        
                ROWS = 9;
                COLS = 9;
                number_of_bombs = 10
                $(".grid").css("grid-template-columns" , "repeat(" + COLS + "," + SIZE + "px)")
                $(".grid").css("grid-template-rows" , "repeat(" + ROWS + "," + SIZE + "px)")
                newGame()
                canclickTile = true
                $(".customcontrols").css("display" , "none")
                break;

        case "intermediate":
            
                ROWS = 16;
                COLS = 16;
                number_of_bombs = 40
                $(".grid").css("grid-template-columns" , "repeat(" + COLS + "," + SIZE + "px)")
                $(".grid").css("grid-template-rows" , "repeat(" + ROWS + "," + SIZE + "px)")
                newGame();
                canclickTile = true
                $(".customcontrols").css("display" , "none")
                break;

        case "expert": 
        
                ROWS = 16;
                COLS = 30;
                number_of_bombs = 99
                $(".grid").css("grid-template-columns" , "repeat(" + COLS + "," + SIZE + "px)")
                $(".grid").css("grid-template-rows" , "repeat(" + ROWS + "," + SIZE + "px)")
                newGame();
                canclickTile = true
                $(".customcontrols").css("display" , "none")
                break;

        case "custom":

                $(".customcontrols").css("display" , "flex")
                $("#newgame_btn").prop("disabled" , true)
                break;
     
    }

    $("#level")[0].selectedIndex = 0

})


