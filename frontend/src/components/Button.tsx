export const Button = ({onClick, children}: {onClick: ()=>void, children: React.ReactNode}) => {
    return (
        <button onClick={onClick}
            className="py-4 px-6 text-2xl font-medium bg-sky-600 hover:bg-sky-500 cursor-pointer rounded-sm">
            {children}
        </button>
    )
}