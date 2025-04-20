interface ToolbarProps {
  exportDesign: () => void
}

const Toolbar = ({ exportDesign }: ToolbarProps) => {
  return (
    <div className="toolbar">
      <h1 style={{ color: 'white', marginRight: 'auto' }}>BlockPlan</h1>
      <button onClick={exportDesign}>Export Design</button>
    </div>
  )
}

export default Toolbar