import React from 'react';

const GameSetting = (props) => {

  // 1. set game mode
  // 2. set player's name

  return (
    <div className="column-display">
      <div className="row-display--center">
        <button
          onClick={() => props.handleGameSetting('computer')}
          disabled={props.isSettingCompleted}
          className={'btn' + (props.gameMode === 'computer' ? '-active' : '')}
        >
          Challenge computer
        </button>
        <button
          onClick={() => props.handleGameSetting('friend')}
          disabled={props.isSettingCompleted}
          className={'btn' + (props.gameMode === 'friend' ? '-active' : '')}
        >
          Battle with my friend
        </button>
      </div>

      <div className="row-display--center">
        {
          props.gameMode && !props.isSettingCompleted &&
          <form onSubmit={props.handleRename} className="column-display">
            <div className="row-display">
              <input type="text" name="playerName1" placeholder={props.playerName1} />
              <input type="text" name="playerName2" placeholder={props.playerName2} />
            </div>
            <div className="row-display--center">
              <button type="submit" className="btn-confirm">Confirm</button>
            </div>

          </form>
        }
      </div>
    </div>
  )
}

export default GameSetting;
