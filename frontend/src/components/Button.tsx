export const Button = ({onClick, children}: {onClick: ()=>void, children: React.ReactNode}) => {
    return (
        <button onClick={onClick}
            className="text-2xl font-medium bg-sky-500 hover:bg-sky-700 py-4 px-6 rounded-sm">
            {children}
        </button>
    )
}