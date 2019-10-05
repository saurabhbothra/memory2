# Attribution : Referred to Nat Tuck's hangman example and learnt the flow and then implemented on my own.

defmodule Memory.Game do

def new do
    %{
      buttonValues: setButtonValues(), 
      currentNoOfTiles: 16,
      numberOfClicks: 0,
      secondTileIndex: -1,
      isContinue: true,
      isMatchFound: false
     }
end

def setButtonValues do
   alphabetList = ["A", "B", "C", "D", "E", "F", "G", "H", "A", "B", "C", "D", "E", "F", "G", "H"]
   shuffledAlphabetList = Enum.shuffle(alphabetList)
   finalAlphabetList = createListOfMaps(shuffledAlphabetList,[])
   finalAlphabetList
end

def createListOfMaps(shuffledAlphabetList, finalAlphaList) when length(shuffledAlphabetList) == 0 do
   finalAlphaList
end

def createListOfMaps(shuffledAlphabetList, finalAlphaList) when length(shuffledAlphabetList) != 0 do
   alphabet = hd(shuffledAlphabetList)
   alphaMap = %{tileValue: alphabet, isDisplayed: false, isMarkedCompleted: false}
   createListOfMaps(tl(shuffledAlphabetList), finalAlphaList ++ [alphaMap])
end

def reset(game) do
      %{
       buttonValues: setButtonValues(),
       currentNoOfTiles: 16,
       numberOfClicks: 0,
       secondTileIndex: -1,
       isContinue: true,
       isMatchFound: false
      }
end

def check_validity(game, i) do
   copyButtonValues = game.buttonValues
   buttonMap = Enum.at(copyButtonValues, i)
   buttonMap = %{buttonMap | isDisplayed: true}
   finalCopyButtonValues = List.update_at(copyButtonValues, i, &(&1= buttonMap)) 
   %{
        buttonValues: finalCopyButtonValues,
        currentNoOfTiles: game.currentNoOfTiles,
        numberOfClicks: game.numberOfClicks,
        secondTileIndex: game.secondTileIndex,
        isContinue: game.isContinue,
        isMatchFound: game.isMatchFound
   }
end

def firstButtonClicked(game, i) do
   %{
       buttonValues: game.buttonValues,
       currentNoOfTiles: game.currentNoOfTiles,
       numberOfClicks: game.numberOfClicks + 1,
       secondTileIndex: i,
       isContinue: game.isContinue,
       isMatchFound: true
    }
end

def disableContinue(game, i) do
   %{
      buttonValues: game.buttonValues,
      currentNoOfTiles: game.currentNoOfTiles,
      numberOfClicks: game.numberOfClicks,
      secondTileIndex: game.secondTileIndex,
      isContinue: false,
      isMatchFound: game.isMatchFound
    }
end

def buttonsMatched(game, i) do
    copyButtonValues = game.buttonValues
    buttonMapFirstButton = Enum.at(copyButtonValues, i)
    buttonMapFirstButton = %{buttonMapFirstButton | isMarkedCompleted: true}
    buttonMapSecondButton = Enum.at(copyButtonValues, game.secondTileIndex)
    buttonMapSecondButton = %{buttonMapSecondButton | isMarkedCompleted: true}
    finalCopyButtonValues = List.update_at(copyButtonValues, i, &(&1 = buttonMapFirstButton))
    finalCopyButtonValues = List.update_at(finalCopyButtonValues, game.secondTileIndex, &(&1= buttonMapSecondButton))
    %{
      buttonValues: finalCopyButtonValues,
      currentNoOfTiles: game.currentNoOfTiles - 2,
      numberOfClicks: game.numberOfClicks + 1,
      secondTileIndex: -1,
      isContinue: true,
      isMatchFound: false
    }
end

def buttonsNotMatched(game, i) do
    copyButtonValues = game.buttonValues
    buttonMapFirstButton = Enum.at(copyButtonValues, i)
    buttonMapFirstButton = %{buttonMapFirstButton | isDisplayed: false}
    buttonMapSecondButton = Enum.at(copyButtonValues, game.secondTileIndex)
    buttonMapSecondButton = %{buttonMapSecondButton | isDisplayed: false}
    finalCopyButtonValues = List.update_at(copyButtonValues, i, &(&1= buttonMapFirstButton))
    finalCopyButtonValues = List.update_at(finalCopyButtonValues, game.secondTileIndex, &(&1 = buttonMapSecondButton))
    %{
       buttonValues: finalCopyButtonValues,
       currentNoOfTiles: game.currentNoOfTiles,
       numberOfClicks: game.numberOfClicks + 1,
       secondTileIndex: -1,
       isContinue: true,
       isMatchFound: false
     }
end

def client_view(game) do
    %{
      buttonValues: game.buttonValues,
      currentNoOfTiles: game.currentNoOfTiles,
      numberOfClicks: game.numberOfClicks,
      secondTileIndex: game.secondTileIndex,
      isContinue: game.isContinue,
      isMatchFound: game.isMatchFound
    }
end
end
