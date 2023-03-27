import React, { useState } from 'react'

// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

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
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  const [activeSquare, setActiveSquare] = useState(initialIndex)
  const [steps, setSteps] = useState(initialSteps)
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    return [grid[activeSquare].x, grid[activeSquare].y]
  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    getXY()
    const mesaj = `Koordinatlar (${grid[activeSquare].x},${grid[activeSquare].y}) `
    return mesaj
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setActiveSquare(initialIndex)
    setSteps(initialSteps)
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
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
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    const yon = evt.target.id
    setActiveSquare(sonrakiIndex(yon))
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setEmail(evt.target.value)
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault()
    axios
      .post('http://localhost:9000/api/result', {
        x: grid[activeSquare].x,
        y: grid[activeSquare].y,
        email: email,
        steps: steps,
      })
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
        <h3 id="steps">0 kere ilerlediniz</h3>
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
        <h3 id="message"></h3>
      </div>
      <div id="keypad">
        <button onClick={ilerle} id="left">
          SOL
        </button>
        <button onClick={ilerle} id="up">
          YUKARI
        </button>
        <button onClick={ilerle} id="right">
          SAĞ
        </button>
        <button onClick={ilerle} id="down">
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
