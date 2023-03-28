import React, { useState } from 'react'
import axios from 'axios'

const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4

const grid = [
  { id: 0, x: 1, y: 1 },
  { id: 1, x: 2, y: 1 },
  { id: 2, x: 3, y: 1 },
  { id: 3, x: 1, y: 2 },
  { id: 4, x: 2, y: 2 },
  { id: 5, x: 3, y: 2 },
  { id: 6, x: 1, y: 3 },
  { id: 7, x: 2, y: 3 },
  { id: 8, x: 3, y: 3 },
]

const xCount = 3
const yCount = 3

export default function AppFunctional(props) {
  const [activeSquare, setActiveSquare] = useState(initialIndex)
  const [steps, setSteps] = useState(initialSteps)
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)

  function getXY() {
    return [grid[activeSquare].x, grid[activeSquare].y]
  }

  function getXYMesaj() {
    getXY()
    const mesaj = `Koordinatlar (${grid[activeSquare].x},${grid[activeSquare].y})`
    return mesaj
  }

  function reset() {
    setActiveSquare(initialIndex)
    setSteps(initialSteps)
    setMessage(initialMessage)
    setEmail(initialEmail)
  }

  function sonrakiIndex(yon) {
    let nextSquareId = null
    if ((yon === 'left') & (grid[activeSquare].x !== 1)) {
      nextSquareId = grid[activeSquare].id - 1
    } else if ((yon === 'right') & (grid[activeSquare].x !== xCount)) {
      nextSquareId = grid[activeSquare].id + 1
    } else if ((yon === 'up') & (grid[activeSquare].y !== 1)) {
      nextSquareId = grid[activeSquare].id - yCount
    } else if ((yon === 'down') & (grid[activeSquare].y !== yCount)) {
      nextSquareId = grid[activeSquare].id + yCount
    } else {
      nextSquareId = grid[activeSquare].id
    }
    return nextSquareId
  }

  function ilerle(evt) {
    const yon = evt.target.id
    const yonText = evt.target.name
    const nextSquareId = sonrakiIndex(yon)
    if (nextSquareId !== grid[activeSquare].id) {
      setSteps(steps + 1)
      setMessage(initialMessage)
      setActiveSquare(nextSquareId)
    }
    if (nextSquareId === grid[activeSquare].id) {
      setMessage(`${yonText} gidemezsiniz`)
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value)
  }

  function onSubmit(evt) {
    evt.preventDefault()
    const dataSend = {
      x: grid[activeSquare].x,
      y: grid[activeSquare].y,
      email: email,
      steps: steps,
    }
    axios
      .post('http://localhost:9000/api/result', dataSend)
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage(err.response.data.message))
      .finally(() => {
        setEmail(initialEmail)
      })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {grid.map((i) => (
          <div
            key={i.id}
            className={`square${i.id === activeSquare ? ' active' : ''}`}
          >
            {i.id === activeSquare ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={ilerle} id="left" name="Sola">
          SOL
        </button>
        <button onClick={ilerle} id="up" name="Yukarıya">
          YUKARI
        </button>
        <button onClick={ilerle} id="right" name="Sağa">
          SAĞ
        </button>
        <button onClick={ilerle} id="down" name="Aşağıya">
          AŞAĞI
        </button>
        <button onClick={reset} id="reset">
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="email girin"
          onChange={onChange}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
