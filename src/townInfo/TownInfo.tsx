import { useContext, useMemo } from "react";
import "./TownInfo.css"
import { GameContext, GameContextType } from "../data/gameState";
import { isStorytellerToken, roleDistribution } from '../data/teamData';
import { Visibility } from "../types/Visibility";
import { Viability } from "../types/Viability";
import { Team } from "../types/Team";


export default function TownInfo() {
  const { gameState, roles } = useContext(GameContext) as GameContextType;
  const [townsfolk, outsiders, minions] = roleDistribution(gameState.playerCount);
  const allTokens = useMemo(() => {
    return gameState.playerTokens.filter(token => 
      token.visibility === Visibility.Assigned &&
      !isStorytellerToken(token, roles));
  }, [gameState, roles]);
  const aliveTokens = useMemo(() => {
    return allTokens.filter(token => token.viability === Viability.Alive);
  }, [allTokens]);
  const totalCount = allTokens.length;
  const totalAliveCount = aliveTokens.length;
  const travellerAliveCount = aliveTokens.filter(token => roles[token.id].team === Team.Traveller).length;
  
  return <div className="TownInfo__container">
    <div className="TownInfo__box">
      <p style={{ color: "#4c5eff" }}>{townsfolk} Townsfolk</p>
      <p style={{ color: "#61cdff" }}>{outsiders} Outsiders</p>
      <p style={{ color: "#ff5825" }}>{minions} Minions</p>
      <p style={{ color: "#ff2a2a" }}>1 Demon</p>
    </div>
    <div className="TownInfo__box">
      <p>{totalAliveCount} / {totalCount} Alive</p>
      <p>{totalAliveCount-travellerAliveCount} Alive Player(s)</p>
      <p>{travellerAliveCount} Alive Traveller(s)</p>
      <p>Majority {Math.ceil(totalAliveCount/2)}</p>
    </div>
  </div>
}
