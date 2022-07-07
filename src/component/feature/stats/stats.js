import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStats } from './statsSlice';

export default function Stats() {

    const dispatch = useDispatch()
    const average = useSelector((state) => state.stats.average);
    const nbPlayers = useSelector((state) => state.stats.nbPlayers);
    const status = useSelector((state) => state.stats.status);
    const questions = useSelector((state) => state.questions.questions);

    useEffect(() => {
        if(status === 'idle'){
            dispatch(fetchStats())
        }
    }, [status,dispatch])

  return (
    <div>
        {average ? <div> Moyenne des joueurs : {average.toFixed(2)} / {questions.question.length}  </div> : <div></div>}
        {nbPlayers ? <div> Nombre de joueurs : {nbPlayers}</div> : <div></div>}

    </div>
  )
}
