import { Grid} from '@mantine/core'
import Questions from '../feature/question/questions'
import React from 'react'

export default function QuizPage() {
  return (
    <Grid justify="center" align="flex-start">
    <Grid.Col >
        <h1 className='center'>Quizdle</h1>
    </Grid.Col>

    <Grid.Col xs={11}  md={8} lg={6} >
        <Questions></Questions>
    </Grid.Col>
  </Grid>
  )
}
