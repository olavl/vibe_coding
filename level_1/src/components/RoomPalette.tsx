import { RoomTypeDefinition } from '../types'

interface RoomPaletteProps {
  addRoom: (roomType: string, width: number, depth: number) => void
}

const roomTypes: RoomTypeDefinition[] = [
  { type: 'Bedroom', width: 4, depth: 4, height: 3, color: '#64B5F6' },
  { type: 'Living Room', width: 6, depth: 5, height: 3, color: '#81C784' },
  { type: 'Kitchen', width: 4, depth: 3, height: 3, color: '#FFB74D' },
  { type: 'Bathroom', width: 2.5, depth: 2, height: 3, color: '#BA68C8' },
  { type: 'Hallway', width: 4, depth: 1.5, height: 3, color: '#A1887F' },
  { type: 'Office', width: 3, depth: 3, height: 3, color: '#4FC3F7' },
  { type: 'Dining Room', width: 4, depth: 3, height: 3, color: '#AED581' },
  { type: 'Laundry Room', width: 2, depth: 2, height: 3, color: '#90A4AE' },
]

const RoomPalette = ({ addRoom }: RoomPaletteProps) => {
  return (
    <div className="room-palette">
      <h3 style={{ marginBottom: '15px', color: '#ddd' }}>Room Types</h3>
      {roomTypes.map((room) => (
        <div 
          key={room.type}
          className="room-item"
          onClick={() => addRoom(room.type, room.width, room.depth)}
          style={{ 
            borderLeft: `5px solid ${room.color}`,
          }}
        >
          <div className="room-title">{room.type}</div>
          <div style={{ fontSize: '12px', color: '#aaa' }}>
            {room.width}m × {room.depth}m
          </div>
        </div>
      ))}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
        <p>Click a room type to add it to your design</p>
        <p>• Drag to move rooms</p>
        <p>• Arrow keys to rotate selected room</p>
        <p>• Delete key to remove selected room</p>
      </div>
    </div>
  )
}

export default RoomPalette