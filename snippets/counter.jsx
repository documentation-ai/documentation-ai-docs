// Describes this component for search. Optional — leave empty to omit it.
export const description = "this is a simple counter"

export const Counter = () => {
  const [count, setCount] = React.useState(0)

  return (
    <div className="my-6 flex items-center gap-3">
      <button
        onClick={() => setCount(c => c - 1)}
        className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        −
      </button>
      <span className="min-w-[3rem] text-center text-2xl font-bold">{count}</span>
      <button
        onClick={() => setCount(c => c + 1)}
        className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      >
        +
      </button>
    </div>
  )
}
