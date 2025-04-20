import { useState } from 'react'
import Toolbar from './components/Toolbar'
import RoomPalette from './components/RoomPalette'
import GridView from './components/GridView'
import ThreeView from './components/ThreeView'
import { Room } from './types'

function App() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)

  const addRoom = (roomType: string, width: number, depth: number) => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      type: roomType,
      width,
      depth,
      height: 3,
      x: 50,
      y: 50,
      rotation: 0
    }
    setRooms([...rooms, newRoom])
    setSelectedRoomId(newRoom.id)
  }

  const updateRoom = (updatedRoom: Room) => {
    setRooms(rooms.map(room => room.id === updatedRoom.id ? updatedRoom : room))
  }

  const deleteRoom = (roomId: string) => {
    setRooms(rooms.filter(room => room.id !== roomId))
    if (selectedRoomId === roomId) {
      setSelectedRoomId(null)
    }
  }

  const exportDesign = () => {
    const designData = JSON.stringify(rooms, null, 2)
    const blob = new Blob([designData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = 'blockplan-design.json'
    a.click()
    
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-container">
      <Toolbar exportDesign={exportDesign} />
      <div className="workspace">
        <RoomPalette addRoom={addRoom} />
        <div className="view-container">
          <GridView 
            rooms={rooms} 
            selectedRoomId={selectedRoomId}
            setSelectedRoomId={setSelectedRoomId}
            updateRoom={updateRoom}
            deleteRoom={deleteRoom}
          />
          <ThreeView rooms={rooms} />
        </div>
      </div>
    </div>
  )
}

export default App