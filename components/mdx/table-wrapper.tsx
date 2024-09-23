export function TableWrapper({ children }) {
  return (
    <div className="w-full overflow-x-auto">
      <table>{children}</table>
    </div>
  )
}
