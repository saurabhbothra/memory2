// Attribution : Referred to Nat Tuck's hangman example and learnt the flow and then implemented on my own.
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';


export default function game_init(root, channel) {
  ReactDOM.render(<Starter channel={channel}/>, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    /* The state contains following variables:  
     * buttonValues contains a map of values that needs to be displayed in buttons along with isDisplayed and isMarkedCompleted attributes.
     * currentNoOfTiles represents the number of tiles that are not matched yet.
     * numberOfClicks represents the total clicks user has taken so far in the game.
     * secondTileIndex represents the index value of the second button which the user clicks for matching.
     * isContinue is a flag which allows the user to click further buttons or not.
     * isMatchFound is a flag which tells whether the user has clicked first button or second button.
     * */
    this.state = { buttonValues: [], 
                   currentNoOfTiles: 16,
	           numberOfClicks: 0,
	           secondTileIndex: -1,
	           isContinue: true,
	           isMatchFound: false
                 };
  

     this.channel.join()
         .receive("ok", resp => {
          console.log("Successfully joined");
          this.got_view(resp);
         })
      .receive("error", resp => {console.log("Unable to join", resp);});

 }

 got_view(view) {
    console.log("new view", view);
    this.setState(view.game);
 }


 onClickTile(i) {

  if(this.state.isContinue){
  
     if(!this.state.buttonValues[i].isDisplayed && !this.state.buttonValues[i].isMarkedCompleted) {
             this.channel.push("check_validity", {i: i})
                  .receive("ok", resp => {this.got_view(resp);});

	     if(!this.state.isMatchFound){
	         this.channel.push("first_button_clicked", {i: i})
                  .receive("ok", resp => {this.got_view(resp);});	    
	      } else {	     
	         this.validateForMatching(i);
	      }
     }
    }
 }

 validateForMatching(i) {
      
          this.channel.push("disable_continue_game", {i: i})
                   .receive("ok", resp => {this.got_view(resp);});

          if(this.state.buttonValues[i].tileValue === this.state.buttonValues[this.state.secondTileIndex].tileValue){
		this.channel.push("buttons_matched", {i: i})
                   .receive("ok", resp => {this.got_view(resp);});
	  } else {
	        setTimeout(() => {
		  this.channel.push("buttons_not_matched", {i: i})
                     .receive("ok", resp => {this.got_view(resp);});
               }, 1000);
	 
	    }
 }

 
 reset() {

         this.channel.push("reset", {})
                .receive("ok", resp => {this.got_view(resp);});  
 }

 tileValue(index) {
   if(this.state.buttonValues.length == 0)
      return ("");
   if(this.state.buttonValues[index].isDisplayed){
        return (this.state.buttonValues[index].tileValue);
   }
   return ("");
 }

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
                     <button id = "b1" onClick={() => this.onClickTile(0)}>{this.tileValue(0)}</button>
	             <button id = "b2" onClick={() => this.onClickTile(1)}>{this.tileValue(1)}</button>
		     <button id = "b3" onClick={() => this.onClickTile(2)}>{this.tileValue(2)}</button>
	             <button id = "b4" onClick={() => this.onClickTile(3)}>{this.tileValue(3)}</button>
		  </div>
		  <div className = "rows">
		     <button id = "b5" onClick={() => this.onClickTile(4)}>{this.tileValue(4)}</button>
		     <button id = "b6" onClick={() => this.onClickTile(5)}>{this.tileValue(5)}</button>
		     <button id = "b7" onClick={() => this.onClickTile(6)}>{this.tileValue(6)}</button>
		     <button id = "b8" onClick={() => this.onClickTile(7)}>{this.tileValue(7)}</button>
                  </div>
                  <div className = "rows">
		    <button id = "b9" onClick={() => this.onClickTile(8)}>{this.tileValue(8)}</button>
		    <button id = "b10" onClick={() => this.onClickTile(9)}>{this.tileValue(9)}</button>
		    <button id = "b11" onClick={() => this.onClickTile(10)}>{this.tileValue(10)}</button>
                    <button id = "b12" onClick={() => this.onClickTile(11)}>{this.tileValue(11)}</button>
		  </div>
		  <div className = "rows">
		    <button id = "b13" onClick={() => this.onClickTile(12)}>{this.tileValue(12)}</button>
		    <button id = "b14" onClick={() => this.onClickTile(13)}>{this.tileValue(13)}</button>
		    <button id = "b15" onClick={() => this.onClickTile(14)}>{this.tileValue(14)}</button>
		    <button id = "b16" onClick={() => this.onClickTile(15)}>{this.tileValue(15)}</button>
		  </div>
	          <button id="r1" onClick={() => this.reset()}>Reset</button><br /><br />
	          <h5> Attempts: {numberOfClicks} </h5>
	 </div>
	 </center>
       </div>

	  );
  }

}
