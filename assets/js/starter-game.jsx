import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';


export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    /* The state contains following variables:  
     * buttonValues contains a map of values that needs to be displayed in buttons along with isDisplayed and isMarkedCompleted attributes.
     * currentNoOfTiles represents the number of tiles that are not matched yet.
     * numberOfClicks represents the total clicks user has taken so far in the game.
     * secondTileIndex represents the index value of the second button which the user clicks for matching.
     * isContinue is a flag which allows the user to click further buttons or not.
     * isMatchFound is a flag which tells whether the user has clicked first button or second button.
     * */
    this.state = { buttonValues: this.setButtonValues(), 
                   currentNoOfTiles: 16,
	           numberOfClicks: 0,
	           secondTileIndex: -1,
	           isContinue: true,
	           isMatchFound: false
                 };
  }

 /*
  * This function shuffles the alphabets in the list and then creates a map which contains value, isDisplayed and isMarkedCompleted as the keys.
  * The value key stores the alphabet, isDisplayed is a flag which says whether the alphabet should be displayed in the button and isMarkedCompleted is a
  * flag which tells whether the tile is found a matching pair or not.
  */
  setButtonValues(){
      let alphabetList = ['A','B','C','D','E','F','G','H','A','B','C','D','E','F','G','H'];

      //Attribution : https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array 

      for(let i = alphabetList.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = alphabetList[i];
            alphabetList[i] = alphabetList[j];
            alphabetList[j] = temp;      
      }

      //Attribution for creating a map from an array : http://www.hackingwithreact.com/read/1/13/rendering-an-array-of-data-with-map-and-jsx
	
      let tileProperties = []
      for(let i = 0; i <= 15; i++){
           tileProperties.push({
		   tileValue: alphabetList[i],
		   isDisplayed: false,
		   isMarkedCompleted: false
	   });
      }

      return tileProperties;
  }

  //Attribution : Understood the tic toe game from https://reactjs.org/tutorial/tutorial.html and then created below logic on my own. 

 /*
  * This function is executed when the button is clicked. If only the first button is clicked then it will store the index to secondTileIndex and change the 
  * isDisplayed flag of that tile to true and update the state. If the second button is clicked, it calls the validateForMatching function to check if two tiles have same values. 
  */
  onClickTile(i) {
  
  if(this.state.isContinue){
  
     if(!this.state.buttonValues[i].isDisplayed && !this.state.buttonValues[i].isMarkedCompleted) {

	     let copyButtonValues = this.state.buttonValues.slice();
	     copyButtonValues[i].isDisplayed = true;
             this.setState({
                buttonValues: copyButtonValues
             });

	     if(!this.state.isMatchFound){
                 this.setState({
                    isMatchFound: true,
                    secondTileIndex: i,
		    numberOfClicks: this.state.numberOfClicks + 1
                });	    
	     }  else {
	     
	         this.validateForMatching(i,copyButtonValues);
	     
	     }

     }
    }
  }

 /*
  * This function is called if two tiles are clicked. If both tiles have same values then it changes the isMarkedCompleted flag of both tiles to true
  * and continues the game by updating the state for finding next matching pairs. If both tiles are not matching, it will show the values for one second 
  * and hide the values after that delay by updating the isDisplayed flag to false. The state is then updated and game is continued for next matching pairs.
  */
  validateForMatching(i,copyButtonValues){
        
	  this.setState({
		  isContinue: false
	  });
          if(this.state.buttonValues[i].tileValue == this.state.buttonValues[this.state.secondTileIndex].tileValue){
		  
		let cpButtonValues = this.state.buttonValues.slice();
	        cpButtonValues[i].isMarkedCompleted = true;
                cpButtonValues[this.state.secondTileIndex].isMarkedCompleted = true;
		this.setState({
                    buttonValues: cpButtonValues,
		    currentNoOfTiles:  this.state.currentNoOfTiles - 2,
		    isContinue: true,
		    numberOfClicks: this.state.numberOfClicks + 1,
	            isMatchFound: false,
		    secondTileIndex: -1
		});
	  } else {
		let cppButtonValues = this.state.buttonValues.slice();

             // Attribution for setting a delay of one sec : https://upmostly.com/tutorials/settimeout-in-react-components-using-hooks
	        setTimeout(() => {                       
		  cppButtonValues[i].isDisplayed = false;
		  cppButtonValues[this.state.secondTileIndex].isDisplayed = false;
		  this.setState({
			  buttonValues: cppButtonValues,
			  isContinue: true,
			  numberOfClicks: this.state.numberOfClicks + 1,
			  isMatchFound: false,
			  secondTileIndex: -1
		  });
               }, 1000);
	 
	    }
   }

 /*
  * This function resets the full game and brings back the original state of the game.
  */
  reset(){
         this.setState({
            buttonValues: this.setButtonValues(),
            currentNoOfTiles: 16,
            isContinue: true,
            numberOfClicks: 0,
            isMatchFound: false,
            secondTileIndex: -1
        });  
  }

  /*
   * This function renders the html layout and also keeps track of number of Clicks made by user. It also displays the appropriate status message
   * if the user has won the game.
   */
  render() {

      let statusMessage;
      let numberOfClicks = this.state.numberOfClicks;
      if(this.state.currentNoOfTiles > 0){
        statusMessage = "";
      } else {
        statusMessage = "Congratulations! You Won!";
      }
    
      return(

         <div className = "header">
	   <center>
	   <h1>Welcome To My Memory Game</h1><br /><br />
	   <h2> {statusMessage} </h2>
           <div className = "gamegrid">

                  <div className = "rows">
                     <button id = "b1" onClick={() => this.onClickTile(0)}><TileValue tileValue = {this.state.buttonValues[0].tileValue} isDisplayed = {this.state.buttonValues[0].isDisplayed} /></button>
	             <button id = "b2" onClick={() => this.onClickTile(1)}><TileValue tileValue = {this.state.buttonValues[1].tileValue} isDisplayed = {this.state.buttonValues[1].isDisplayed} /></button>
		     <button id = "b3" onClick={() => this.onClickTile(2)}><TileValue tileValue = {this.state.buttonValues[2].tileValue} isDisplayed = {this.state.buttonValues[2].isDisplayed} /></button>
	             <button id = "b4" onClick={() => this.onClickTile(3)}><TileValue tileValue = {this.state.buttonValues[3].tileValue} isDisplayed = {this.state.buttonValues[3].isDisplayed} /></button>
		  </div>
		  <div className = "rows">
		     <button id = "b5" onClick={() => this.onClickTile(4)}><TileValue tileValue = {this.state.buttonValues[4].tileValue} isDisplayed = {this.state.buttonValues[4].isDisplayed} /></button>
		     <button id = "b6" onClick={() => this.onClickTile(5)}><TileValue tileValue = {this.state.buttonValues[5].tileValue} isDisplayed = {this.state.buttonValues[5].isDisplayed} /></button>
		     <button id = "b7" onClick={() => this.onClickTile(6)}><TileValue tileValue = {this.state.buttonValues[6].tileValue} isDisplayed = {this.state.buttonValues[6].isDisplayed} /></button>
		     <button id = "b8" onClick={() => this.onClickTile(7)}><TileValue tileValue = {this.state.buttonValues[7].tileValue} isDisplayed = {this.state.buttonValues[7].isDisplayed} /></button>
                  </div>
                  <div className = "rows">
		     <button id = "b9" onClick={() => this.onClickTile(8)}><TileValue tileValue = {this.state.buttonValues[8].tileValue} isDisplayed = {this.state.buttonValues[8].isDisplayed} /></button>
		     <button id = "b10" onClick={() => this.onClickTile(9)}><TileValue tileValue = {this.state.buttonValues[9].tileValue} isDisplayed = {this.state.buttonValues[9].isDisplayed} /></button>
		     <button id = "b11" onClick={() => this.onClickTile(10)}><TileValue tileValue = {this.state.buttonValues[10].tileValue} isDisplayed = {this.state.buttonValues[10].isDisplayed} /></button>
                     <button id = "b12" onClick={() => this.onClickTile(11)}><TileValue tileValue = {this.state.buttonValues[11].tileValue} isDisplayed = {this.state.buttonValues[11].isDisplayed} /></button>
		  </div>
		  <div className = "rows">
		    <button id = "b13" onClick={() => this.onClickTile(12)}><TileValue tileValue = {this.state.buttonValues[12].tileValue} isDisplayed = {this.state.buttonValues[12].isDisplayed} /></button>
		    <button id = "b14" onClick={() => this.onClickTile(13)}><TileValue tileValue = {this.state.buttonValues[13].tileValue} isDisplayed = {this.state.buttonValues[13].isDisplayed} /></button>
		    <button id = "b15" onClick={() => this.onClickTile(14)}><TileValue tileValue = {this.state.buttonValues[14].tileValue} isDisplayed = {this.state.buttonValues[14].isDisplayed} /></button>
		    <button id = "b16" onClick={() => this.onClickTile(15)}><TileValue tileValue = {this.state.buttonValues[15].tileValue} isDisplayed = {this.state.buttonValues[15].isDisplayed} /></button>
		  </div>
	          <button id="r1" onClick={() => this.reset()}>Reset</button><br /><br />
	          <h5> Total Clicks: {numberOfClicks} </h5>
	 </div>
	 </center>
       </div>

	  );
  }
}

/*
 * This function displays the value on button if the isDisplayed flag of that button is true. Else, the button value is not displayed.
 */
function TileValue(props){
  if(props.isDisplayed){
       return (props.tileValue);
  }
  return ('');
}


