import { Canvas } from '@react-three/fiber'
import { OrbitControls, Plane } from '@react-three/drei'
import { Room } from '../types'

interface ThreeViewProps {
  rooms: Room[]
}

const ThreeView = ({ rooms }: ThreeViewProps) => {
  return (
    <div className="three-view">
      <Canvas camera={{ position: [15, 15, 15], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        
        {/* Floor grid */}
        <Plane 
          args={[100, 100]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, 0, 0]}
        >
          <meshStandardMaterial color="#2a2a2a" wireframe />
        </Plane>
        
        {/* Render each room as a 3D box */}
        {rooms.map(room => {
          // Get room color based on type
          const getRoomColor = () => {
            switch(room.type) {
              case 'Bedroom': return '#64B5F6'
              case 'Living Room': return '#81C784'
              case 'Kitchen': return '#FFB74D'
              case 'Bathroom': return '#BA68C8'
              case 'Hallway': return '#A1887F'
              case 'Office': return '#4FC3F7'
              case 'Dining Room': return '#AED581'
              case 'Laundry Room': return '#90A4AE'
              default: return '#64B5F6'
            }
          }
          
          // Convert from pixels in 2D view to meters in 3D view
          const pixelsToMeters = (pixels: number) => pixels / 40
          
          // Calculate center position from top-left corner position
          const centerX = pixelsToMeters(room.x + (room.width * 20))
          const centerY = room.height / 2
          const centerZ = pixelsToMeters(room.y + (room.depth * 20))
          
          // Apply rotation
          const rotationY = (room.rotation * Math.PI) / 180
          
          return (
            <mesh
              key={room.id}
              position={[centerX - 12.5, centerY, centerZ - 12.5]}
              rotation={[0, rotationY, 0]}
            >
              <boxGeometry args={[room.width, room.height, room.depth]} />
              <meshStandardMaterial 
                color={getRoomColor()} 
                transparent
                opacity={0.7}
              />
              <meshStandardMaterial 
                wireframe
                color="#fff"
              />
            </mesh>
          )
        })}
        
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default ThreeView