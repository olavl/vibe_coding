import { useEffect, useRef } from 'react'
import { Room } from '../types'

interface GridViewProps {
  rooms: Room[]
  selectedRoomId: string | null
  setSelectedRoomId: (id: string | null) => void
  updateRoom: (room: Room) => void
  deleteRoom: (id: string) => void
}

const GRID_SIZE = 40 // pixels per meter

const GridView = ({ 
  rooms, 
  selectedRoomId, 
  setSelectedRoomId, 
  updateRoom, 
  deleteRoom 
}: GridViewProps) => {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedRoomId) return

      const selectedRoom = rooms.find(room => room.id === selectedRoomId)
      if (!selectedRoom) return

      // Handle rotation with arrow keys
      if (e.key === 'ArrowLeft') {
        updateRoom({
          ...selectedRoom,
          rotation: (selectedRoom.rotation - 90) % 360
        })
      } else if (e.key === 'ArrowRight') {
        updateRoom({
          ...selectedRoom,
          rotation: (selectedRoom.rotation + 90) % 360
        })
      }

      // Handle deletion with Delete key
      if (e.key === 'Delete') {
        deleteRoom(selectedRoomId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedRoomId, rooms, updateRoom, deleteRoom])

  const handleDragStart = (
    e: React.MouseEvent<HTMLDivElement>, 
    roomId: string
  ) => {
    if (gridRef.current) {
      const gridRect = gridRef.current.getBoundingClientRect()
      const startX = e.clientX - gridRect.left
      const startY = e.clientY - gridRect.top
      
      setSelectedRoomId(roomId)
      const selectedRoom = rooms.find(room => room.id === roomId)
      if (!selectedRoom) return

      const initialRoomX = selectedRoom.x
      const initialRoomY = selectedRoom.y

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newX = initialRoomX + (moveEvent.clientX - gridRect.left - startX)
        const newY = initialRoomY + (moveEvent.clientY - gridRect.top - startY)
        
        // Snap to grid
        const snappedX = Math.round(newX / 10) * 10
        const snappedY = Math.round(newY / 10) * 10
        
        updateRoom({
          ...selectedRoom,
          x: snappedX,
          y: snappedY
        })
      }

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
  }

  return (
    <div className="grid-view">
      <div className="grid" ref={gridRef}>
        {rooms.map(room => {
          // Calculate width and depth based on rotation
          const isRotated = room.rotation % 180 !== 0
          const displayWidth = isRotated ? room.depth * GRID_SIZE : room.width * GRID_SIZE
          const displayHeight = isRotated ? room.width * GRID_SIZE : room.depth * GRID_SIZE
          
          // Find room color
          const getRoomColor = () => {
            switch(room.type) {
              case 'Bedroom': return 'rgba(100, 181, 246, 0.7)'
              case 'Living Room': return 'rgba(129, 199, 132, 0.7)'
              case 'Kitchen': return 'rgba(255, 183, 77, 0.7)'
              case 'Bathroom': return 'rgba(186, 104, 200, 0.7)'
              case 'Hallway': return 'rgba(161, 136, 127, 0.7)'
              case 'Office': return 'rgba(79, 195, 247, 0.7)'
              case 'Dining Room': return 'rgba(174, 213, 129, 0.7)'
              case 'Laundry Room': return 'rgba(144, 164, 174, 0.7)'
              default: return 'rgba(100, 181, 246, 0.7)'
            }
          }
          
          const roomColor = getRoomColor()
          const borderColor = roomColor.replace('0.7', '1')
          
          return (
            <div
              key={room.id}
              className="room"
              style={{
                width: `${displayWidth}px`,
                height: `${displayHeight}px`,
                left: `${room.x}px`,
                top: `${room.y}px`,
                transform: `rotate(${room.rotation}deg)`,
                transformOrigin: 'center center',
                backgroundColor: roomColor,
                borderColor: borderColor,
                boxShadow: selectedRoomId === room.id ? '0 0 0 2px white' : 'none',
                zIndex: selectedRoomId === room.id ? 10 : 1,
              }}
              onClick={() => setSelectedRoomId(room.id)}
              onMouseDown={(e) => handleDragStart(e, room.id)}
            >
              <div style={{
                transform: 'rotate(0deg)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                color: 'white',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                fontWeight: 'bold',
                userSelect: 'none'
              }}>
                {room.type}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GridView